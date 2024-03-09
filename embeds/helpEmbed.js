const { EmbedBuilder, Client } = require("discord.js");


const embed = new EmbedBuilder().setColor('Random').setTimestamp();

/**
 * @param {Client} client
 */
const buildHelpEmbed = (client) => {
  embed
    .setTitle(`**Menú de ayuda de ${client.user.username}**`)
    .setFooter({
      iconURL: `${client.user.displayAvatarURL()}`,
      text: `${client.user.username}`,
    })
    .setDescription(
          `*Todos los comandos son de barra. Para ejecutar un comando, escríbelo en el chat y presiona enter.*\n\n⚙️ **Comandos**\n
          > \`/articulo\` - *Administra los artículos de la tienda.*
          >> \`/articulo añadir\` - *Añade un artículo a la tienda.*
          >> \`/articulo quitar\` - *Quita un artículo de la tienda.*
          >> \`/articulo quitar_todo\` - *Quita todos los artículos de la tienda.*
          
          > \`/puntos\` - *Administra los puntos de un usuario (only Mauricio).*
          >> \`/puntos añadir\` - *Añade puntos a un usuario.*
          >> \`/puntos quitar\` - *Quita puntos a un usuario.*
          
          > \`/comprararticulo\` - *Compra un artículo de la tienda.*
          > \`/mispuntos\` - *Muestra los puntos que tienes.*
          > \`/quitarpuntos\` - *Quita puntos de tu cuenta.*
          > \`/tienda\` - *Muestra los artículos disponibles en la tienda.*
          > \`/help\` - *Muestra este embed.*`
        );
  return embed;
};

module.exports = buildHelpEmbed;