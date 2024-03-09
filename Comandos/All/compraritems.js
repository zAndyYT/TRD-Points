const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const MegaDB = require('megadb');

let tiendaDB = new MegaDB.crearDB('tienda');
let puntosDB = new MegaDB.crearDB('puntos');
let comprasDB = new MegaDB.crearDB('compras');
let stockDB = new MegaDB.crearDB('stock'); // Añade esta línea

module.exports = {

  data: new SlashCommandBuilder()
    .setName('comprararticulo')
    .setDescription('Compra un artículo de la tienda')
    .addStringOption(option =>  
      option.setName('articulo')
        .setDescription('El nombre del artículo')
        .setRequired(true)),

  async execute(interaction, client) {
    const guildId = interaction.guild.id;
    const articulo = interaction.options.getString('articulo').toLowerCase();
    const tienda = await tiendaDB.obtener(guildId) || {};
    let puntosUsuario = await puntosDB.obtener(interaction.user.id);
    let stockArticulo = await stockDB.obtener(articulo) || 0; // Añade esta línea

    // Convertir las claves del objeto tienda a minúsculas
    const tiendaLowerCase = Object.keys(tienda).reduce((result, key) => {
      result[key.toLowerCase()] = tienda[key];
      return result;
    }, {});

    const precioArticulo = tiendaLowerCase[articulo];
    const comprasUsuario = await comprasDB.obtener(interaction.user.id) || {};

    if (precioArticulo === undefined) {
      await interaction.reply("Este artículo no existe en la tienda.");
      return;
    }
    if (puntosUsuario < precioArticulo) {
      await interaction.reply("No tienes suficientes puntos para comprar este artículo.");
      return;
    }
    if (stockArticulo <= 0) { // Añade esta línea
      await interaction.reply("Este artículo está agotado en la tienda."); // Añade esta línea
      return; // Añade esta línea
    } // Añade esta línea

    // Restar los puntos del usuario
    await puntosDB.restar(interaction.user.id, precioArticulo);

    // Registrar la compra
    comprasUsuario[articulo] = (comprasUsuario[articulo] || 0) + 1;
    await comprasDB.establecer(interaction.user.id, comprasUsuario);

    // Restar del stock
    await stockDB.establecer(articulo, stockArticulo - 1); // Añade esta línea

    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('Compra exitosa')
      .setURL(interaction.url)
      .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
      .setDescription(`Has comprado ${articulo} por ${precioArticulo} puntos. Stock restante: ${stockArticulo - 1}`) // Modifica esta línea
      .addFields(
        { name: 'Puntos restantes', value: (puntosUsuario - precioArticulo).toString() },
        { name: 'Confirmación de compra', value: 'Por favor, toma una foto de esta compra para comprobar tu compra en los tickets.' }
      )
      .setTimestamp()
      .setFooter({ text: 'Gracias por tu compra!', iconURL: interaction.user.displayAvatarURL() });

    await interaction.reply({ embeds: [embed], fetchReply: true, ephemeral: true });

            // Enviar un mensaje a los vendedores
            try {
              await interaction.channel.send({
                content: `${interaction.user} ha comprado ${articulo}. <@&1212151445797863474>, si alguno de ustedes tiene la fruta, favor de pagarle. Favor de abrir un ticket en el canal <#1188922852825632809> y un staff lo atenderá. Por favor, asegúrate de tomar una captura de pantalla de esta compra.`,
                allowedMentions: { roles: ['1212151445797863474'] },
              });
            } catch (error) {
              console.error(error);
            }
        
            // Enviar un mensaje al usuario con la información de pago
            // Enviar un mensaje al canal de compras
            const channelId = '1216085868561825792'; // Reemplaza esto con el ID de tu canal
            try {
              const channel = await client.channels.fetch(channelId);
              const fecha = new Date().toLocaleString(); // Obtiene la fecha y hora actual
              await channel.send(`${interaction.user} ha comprado ${articulo} a las ${fecha}.`);
            } catch (error) {
              console.error(`No se pudo enviar un mensaje al canal con la ID ${channelId}: ${error}`);
            }

            const userId1 = '491318448660676611'; // Asegúrate de que esta ID es correcta
            const userId2 = '719285265675452437'; // Asegúrate de que esta ID es correcta

            try {
              const user1 = await client.users.fetch(userId1);
              await user1.send(`Hola Mauricio, al parecer ${interaction.user} ha comprado ${articulo}. Por favor dile a uno de los vendedores para que le paguen.`);
            } catch (error) {
              console.error(`No se pudo enviar un mensaje al usuario con la ID ${userId1}: ${error}`);
            }

            try {
              const user2 = await client.users.fetch(userId2);
              await user2.send(`Hola Andy, al parecer ${interaction.user} ha comprado ${articulo}. Por favor dile a uno de los vendedores para que le paguen.`);
            } catch (error) {
              console.error(`No se pudo enviar un mensaje al usuario con la ID ${userId2}: ${error}`);
            }
          }
        }
      