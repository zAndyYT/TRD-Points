const { SlashCommandBuilder, EmbedBuilder} = require('discord.js');

const userId1 = '491318448660676611';
const userId2 = '719285265675452437';

module.exports = {
    data: new SlashCommandBuilder()
    .setName('animated-avatar')
    .setDescription('Actualiza el avatar animado de tu bot')
    .addAttachmentOption(option => option.setName('avatar').setDescription('El avatar animado que quieres poner').setRequired(true)),

    async execute (interaction, client) {

        if (interaction.user.id !== userId1 && interaction.user.id !== userId2) return await interaction.reply('Este comando es exclusivo para los usuarios con IDs `' + userId1 + '` y `' + userId2 + '`.');

        const { options } = interaction;
        const avatar = options.getAttachment('avatar');

        async function sendMessage (message) {
            const embed = new EmbedBuilder()
            .setColor('Blurple')
            .setDescription(message);
            await interaction.reply({ embeds: [embed], ephemeral: true });

            if (avatar.contentType !== 'image/gif') return await sendMessage('El archivo debe ser un gif');
        
        }
        var error;
        await client.user.setAvatar(avatar.url).catch(async err => {
            error = true;
            console.log(err);
            return await sendMessage(`Error : \`${err.toString()}\``);

     
        });

        if (error) return;
        await sendMessage('Avatar actualizado correctamente');
    }
}