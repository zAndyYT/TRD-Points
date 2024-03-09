const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const MegaDB = require('megadb');

let tiendaDB = new MegaDB.crearDB('tienda');
let stockDB = new MegaDB.crearDB('stock'); // Añade esta línea

module.exports = {

  data: new SlashCommandBuilder()
    .setName('articulo')
    .setDescription('Administra los artículos de la tienda')
    .addSubcommand(subcommand =>
      subcommand.setName('quitar')
        .setDescription('Quita un artículo de la tienda')
        .addStringOption(option =>  
          option.setName('nombre')
            .setDescription('El nombre del artículo')
            .setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand.setName('quitar_todo')
        .setDescription('Quita todos los artículos de la tienda'))
        .addSubcommand(subcommand =>
          subcommand.setName('añadir')
            .setDescription('Añade un artículo a la tienda')
            .addStringOption(option =>  
              option.setName('nombre')
                .setDescription('El nombre del artículo')
                .setRequired(true))
            .addIntegerOption(option =>
              option.setName('precio')
                .setDescription('El precio del artículo')
                .setRequired(true))
            .addIntegerOption(option =>  // Añade esta línea
              option.setName('stock')    // Añade esta línea
                .setDescription('El stock inicial del artículo') // Añade esta línea
                .setRequired(true))), // Añade esta línea
    

  async execute(interaction) {

    const allowedUsers = ['719285265675452437', '491318448660676611']; // Reemplaza esto con los IDs de los usuarios permitidos

    if (!allowedUsers.includes(interaction.user.id)) {
      await interaction.reply('No tienes permiso para usar este comando.');
      return;
    }

    const guildId = interaction.guild.id;
    let tienda = await tiendaDB.obtener(guildId) || {};

    if (interaction.options.getSubcommand() === 'quitar') {
      const nombre = interaction.options.getString('nombre');
      delete tienda[nombre];
      await tiendaDB.establecer(guildId, tienda);

      const embed = new EmbedBuilder()
        .setColor('#00ff00')
        .setTitle('Artículo quitado')
        .setDescription(`El artículo **${nombre}** ha sido quitado de la tienda`)
        .setTimestamp();

      await interaction.reply({embeds: [embed], ephemeral: true});

    } else if (interaction.options.getSubcommand() === 'quitar_todo') {
      await tiendaDB.eliminar(guildId);

      const embed = new EmbedBuilder()
        .setColor('#00ff00')
        .setTitle('Todos los artículos quitados')
        .setDescription('Todos los artículos han sido quitados de la tienda')
        .setTimestamp();

      await interaction.reply({embeds: [embed], ephemeral: true});

    } else if (interaction.options.getSubcommand() === 'añadir') {
      const nombre = interaction.options.getString('nombre');
      const precio = interaction.options.getInteger('precio');
      const stock = interaction.options.getInteger('stock'); // Añade esta línea
      tienda[nombre] = precio;
      await tiendaDB.establecer(guildId, tienda);
      await stockDB.establecer(nombre, stock); // Añade esta línea

      const embed = new EmbedBuilder()
        .setColor('#00ff00')
        .setTitle('Artículo añadido')
        .setDescription(`El artículo **${nombre}** ha sido añadido a la tienda con un precio de **${precio}** y un stock inicial de **${stock}**`) // Modifica esta línea
        .setTimestamp();

      await interaction.reply({embeds: [embed], ephemeral: true});
    }
  }
};