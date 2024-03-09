const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription('Obtener el enlace de invitación del bot'),

    async execute(interaction) {
        // ID del usuario permitido
        const allowedUserId = '719285265675452437';

        if (interaction.user.id !== allowedUserId) {
            return await interaction.reply('No tienes permiso para usar este comando.', { ephemeral: true });
        }

        // Reemplaza 'tu-client-id' y 'tus-permisos' con tu ID de cliente y los permisos que necesitas
        const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('Enlace de invitación del bot')
        .setDescription(`[Haz clic aquí para invitar al bot](${inviteLink})`);
    
    await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};