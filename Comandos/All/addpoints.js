const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const MegaDB = require('megadb');

let puntosDB = new MegaDB.crearDB('puntos');

module.exports = {

  data: new SlashCommandBuilder()
    .setName('puntos')
    .setDescription('Administra los puntos de un usuario')
    .addSubcommand(subcommand =>
      subcommand.setName('añadir')
        .setDescription('Añade puntos a un usuario')
        .addUserOption(option => option.setName('usuario').setDescription('El usuario al que añadir puntos').setRequired(true))  
        .addIntegerOption(option => option.setName('puntos').setDescription('La cantidad de puntos para añadir').setRequired(true))
        .addStringOption(option => option.setName('razon').setDescription('La razón para añadir puntos')))
    .addSubcommand(subcommand =>
      subcommand.setName('quitar')
        .setDescription('Quita puntos a un usuario')
        .addUserOption(option => option.setName('usuario').setDescription('El usuario al que quitar puntos').setRequired(true))  
        .addIntegerOption(option => option.setName('puntos').setDescription('La cantidad de puntos para quitar').setRequired(true))
        .addStringOption(option => option.setName('razon').setDescription('La razón para quitar puntos'))),

  async execute(interaction) {

    const allowedUsers = ['719285265675452437', '491318448660676611']; // Reemplaza esto con los IDs de los usuarios permitidos

    if (!allowedUsers.includes(interaction.user.id)) {
      await interaction.reply('No tienes permiso para usar este comando.');
      return;
    }

    const guildId = interaction.guild.id;
    const usuario = interaction.options.getUser('usuario');
    const puntos = interaction.options.getInteger('puntos');
    const razon = interaction.options.getString('razon') || 'No se proporcionó razón';

    let puntosActuales = await puntosDB.obtener(`${guildId}.${usuario.id}`) || 0;

    if (interaction.options.getSubcommand() === 'añadir') {
      await puntosDB.establecer(`${guildId}.${usuario.id}`, puntosActuales + puntos);
      puntosActuales += puntos;
    } else if (interaction.options.getSubcommand() === 'quitar') {
      if (puntos > puntosActuales) {
        return interaction.reply({
          content: `❌ ${usuario} no tiene suficientes puntos para quitar`,
          ephemeral: true 
        });
      }
      await puntosDB.restar(`${guildId}.${usuario.id}`, puntos);
      puntosActuales -= puntos;
    }

    const embed = new EmbedBuilder()
        .setTitle(`Puntos ${interaction.options.getSubcommand() === 'añadir' ? 'añadidos' : 'quitados'}`)
        .setDescription(`Se han ${interaction.options.getSubcommand() === 'añadir' ? 'añadido' : 'quitado'} ${puntos} puntos a ${usuario}`)
        .addFields(
            {name: 'Razón', value: razon},
            {name: 'Puntos actuales', value: puntosActuales.toString()}
        )
        .setThumbnail(usuario.displayAvatarURL())
        .setFooter({text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL()})
        .setTimestamp();

    await interaction.reply({embeds: [embed]});

    try {
      await usuario.send(`Se te han ${interaction.options.getSubcommand() === 'añadir' ? 'añadido' : 'quitado'} ${puntos} puntos. Tu nuevo saldo es ${puntosActuales}`);
    } catch {
      await interaction.followUp('No se pudo notificar por DM al usuario') 
    }

  },

};