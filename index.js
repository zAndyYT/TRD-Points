const { Client, GatewayIntentBits, Partials, Collection, ActionRowBuilder, EmbedBuilder, ButtonBuilder, Events, PermissionsBitField, ChannelType, ButtonStyle, ModalBuilder, discordTranscripts, Collector, AttachmentBuilder, TextInputBuilder, TextInputStyle, StringSelectMenuBuilder, ActionRow } = require("discord.js");
const { Guilds, GuildMembers, GuildMessages, MessageContent, DirectMessages, GuildPresences, GuildVoiceStates, GuildMessageReactions, DirectMessageReactions, DirectMessageTyping } = GatewayIntentBits;
const { Message, GuildMember, ThreadMember } = Partials;



const client = new Client({
	intents: [Guilds, GuildMembers, GuildMessages, MessageContent, DirectMessages, GuildPresences, GuildVoiceStates, GuildMessageReactions, DirectMessageReactions, DirectMessageTyping],
	partials: [Message, GuildMember, ThreadMember],


});




const { loadEvents } = require('./Handlers/eventHandler');
const { loadCommands } = require('./Handlers/commandHandler');


client.config = require("./config.json");
client.events = new Collection;
client.commands = new Collection();



client.setMaxListeners(0);


const allowedGuilds = ['1177625088070262784', '1181410019279904848'];

client.on('guildCreate', guild => {
    if (!allowedGuilds.includes(guild.id)) {
        console.log(`Me salí del servidor '${guild.name}' porque su ID no está en mi lista de servidores permitidos.`);
        guild.leave();
    }
});


 


client.login(client.config.token).then(() => {
	loadEvents(client)
	loadCommands(client)
	

});