const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const MegaDB = require('megadb');

let puntosDB = new MegaDB.crearDB('puntos');

module.exports = {

    data: new SlashCommandBuilder()
        .setName('points')
        .setDescription('Muestra cuántos puntos tienes')
        .addUserOption(option => option.setName('usuario').setDescription('El usuario del que quieres ver los puntos')),

    async execute(interaction) {

        const usuarioSeleccionado = interaction.options.getUser('usuario') || interaction.user;
        let puntos = await puntosDB.obtener(`${interaction.guild.id}.${usuarioSeleccionado.id}`);
        puntos = Number(puntos);
        if (isNaN(puntos)) {
            puntos = 0;
        }

        const embed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle(`Puntos de ${usuarioSeleccionado.username}`)
            .setThumbnail(usuarioSeleccionado.displayAvatarURL())
            .addFields({ name: 'Puntos', value: puntos.toLocaleString(), inline: true });

        await interaction.reply({ embeds: [embed], ephemeral: !interaction.options.getUser('usuario')});

    },

};