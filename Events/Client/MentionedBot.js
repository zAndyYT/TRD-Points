const {
  Events,
  EmbedBuilder,
  ButtonStyle,
  ButtonBuilder,
  ActionRowBuilder,
} = require("discord.js");

module.exports = {
  name: Events.MessageCreate,

  async execute(message, client, interaction) {
    if (message.author.bot) return;
    if (message.content.includes("<@934210786442743838")) { // ID de tu bot

      const pingEmbed = new EmbedBuilder()
        .setColor("DarkerGrey")
        .setTitle("🏓 • ¿Quién me mencionó??")
        .setDescription(
          `¡Hola ${message.author.username}!, aquí tienes información útil sobre mí.\n⁉️ • **¿Cómo ver todos los comandos?**\nUsa **/help** o escribe / para ver la lista de todos los comandos!`
        )
        .addFields({ name: `**🏡 • Servidores:**`, value: `${client.guilds.cache.size}`, inline: true })
        .addFields({ name: `**👥 • Usuarios:**`, value: `${client.users.cache.size}`, inline: true })
        .addFields({ name: `**💣 • Comandos:**`, value: `${client.commands.size}`, inline: true })
        .setTimestamp()
        .setImage('https://i.pinimg.com/originals/f2/92/76/f29276f293b1fc60ca6f54eb33920b74.gif')
        .setFooter({ text: `Solicitado por ${message.author.username}.` })
      const buttons = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setEmoji("➕")
          .setLabel("Invitar")
          .setStyle(ButtonStyle.Link)
          .setURL(`https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`), // enlace de invitación de tu bot
        new ButtonBuilder()
          .setEmoji("🔗")
          .setLabel('WebSite')
          .setStyle(ButtonStyle.Link)
          .setURL('https://shadowgbotweb.web.app/'),
        new ButtonBuilder()
          .setEmoji("📣")
          .setLabel("Soporte")
          .setStyle(ButtonStyle.Link)
          .setURL("https://discord.gg/uKDcAueuHm") // Enlace a tu sitio web
      );
      return message.reply({ embeds: [pingEmbed], components: [buttons] });
    }
  },
};