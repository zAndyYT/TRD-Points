const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const MegaDB = require('megadb');

let tiendaDB = new MegaDB.crearDB('tienda');
let stockDB = new MegaDB.crearDB('stock');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('tienda')
    .setDescription('Muestra los artículos disponibles en la tienda'),

  async execute(interaction) {
    const guildId = interaction.guild.id;
    const tienda = await tiendaDB.obtener(guildId) || {};

    let paginaActual = 0;
    const articulosPorPagina = 3; // Ajusta este valor según cuántos artículos quieres mostrar por página
    const totalArticulos = Object.keys(tienda).length;
    const paginas = Math.ceil(totalArticulos / articulosPorPagina);

    const generarEmbed = async (pagina) => {
      const embed = new EmbedBuilder()
        .setColor('#1abc9c')
        .setTitle('Tienda de Puntos')
        .setAuthor({ name: 'Sistema de Puntos', iconURL: interaction.client.user.displayAvatarURL() })
        .setImage('https://media.discordapp.net/attachments/1167972304857333832/1212143404079910982/Sin_titulo.png?ex=65f0c384&is=65de4e84&hm=61c977070d6b38f00357f250ef6bd2fcb62d62eb99642910e1c221d0f7314dd0&=&format=webp&quality=lossless&width=748&height=420') // Asegúrate de reemplazar esto con la URL de tu imagen
        .setFooter({ text: 'Sistema de Puntos © 2024', iconURL: interaction.client.user.displayAvatarURL() })
        .setTimestamp();

        let descripcion = '💭 No hay artículos disponibles por el momento';
        if (totalArticulos > 0) {
          descripcion = '✨ **Artículos disponibles** ✨\n';
          const inicio = pagina * articulosPorPagina;
          const fin = inicio + articulosPorPagina;
          const articulosPagina = Object.keys(tienda).slice(inicio, fin);
      
          for (const articulo of articulosPagina) {
            const stockArticulo = await stockDB.obtener(articulo) || 0;
            descripcion += `**${articulo}**\nCosto: ${tienda[articulo]} puntos\nStock: ${stockArticulo}\n\n`;
          }
        }
      
   

      embed.setDescription(descripcion);
      return embed;
    };

    const actualizarMensaje = async (i, pagina) => {
      const embed = await generarEmbed(pagina);
      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('izquierda')
            .setEmoji('⬅️')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(pagina === 0),
          new ButtonBuilder()
            .setCustomId('derecha')
            .setEmoji('➡️')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(pagina >= paginas - 1)
        );

        await i.update({ embeds: [embed], components: [row] });
    };

    await interaction.reply({
      embeds: [await generarEmbed(paginaActual)],
      components: [
        new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setCustomId('izquierda')
              .setEmoji('⬅️')
              .setStyle(ButtonStyle.Primary)
              .setDisabled(paginaActual === 0),
            new ButtonBuilder()
              .setCustomId('derecha')
              .setEmoji('➡️')
              .setStyle(ButtonStyle.Primary)
              .setDisabled(paginaActual >= paginas - 1)
          )
      ],
      ephemeral: true // Esto hace que el mensaje solo sea visible para el usuario que ejecutó el comando
    });

    const filter = i => i.user.id === interaction.user.id;

    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });
    collector.on('collect', async i => {
      if (i.customId === 'izquierda' && paginaActual > 0) {
        paginaActual--;
      } else if (i.customId === 'derecha' && paginaActual < paginas - 1) {
        paginaActual++;
      }

      await actualizarMensaje(i, paginaActual);
    });

    collector.on('end', collected => {
      // Aquí puedes manejar el fin del collector, por ejemplo, deshabilitando los botones
    });
  }
};