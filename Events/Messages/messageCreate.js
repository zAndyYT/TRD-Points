const { EmbedBuilder } = require('discord.js');
const cooldown = new Set();

module.exports = {
    name:'messageCreate',
    async execute(message,client){
        let prefix = 'sg!';
        if(!message.content.startsWith(prefix) || message.author.bot) return;
        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const commandName = args.shift().toLowerCase();
        const command = client.pcommands.get(commandName) || client.pcommands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if(!command) {
            const command = client.commands.get(commandName);
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('Error');

            if (command) {
                embed.setDescription(`El comando sg!**${commandName}** no existe con prefix, pero está disponible como un comando de barra (/). Intenta con /${commandName}`);
            } else {
                embed.setDescription(`El comando sg!**${commandName}** no existe. Revisa mi lista de comandos con /help (Proximamente haremos el help con prefix)`);
            }

            return message.reply({embeds:[embed]});
        }

        const cooldowns = await command.Cooldown;

        if(command.Cooldown && cooldown.has(message.author.id)){
            const embed = new EmbedBuilder()
                .setDescription(`Este comando tiene cooldown tienes que esperar un poco para volver a utilizar este comando | Tienes que esperar ${cooldowns / 1000} segundos`);

            return message.reply({embeds:[embed]});
        }

        cooldown.add(message.author.id);
        try {
            setTimeout(()=>{
                cooldown.delete(message.author.id);
            }, cooldowns);
        } catch (error) {
            return;
        }

        try{
            command.execute(client,message,args);
        }catch(err){
            message.reply({content:"Ocurrio un error"});
            console.log(err);
        }
    }
};