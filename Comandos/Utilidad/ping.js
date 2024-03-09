const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Conseguir el bot\'s silbido'),
    async execute(interaction) {
        let circles = {
            good: '<:High:1166951883366207488> ',
            okay: '<:Mid:1166951886688092220> ',
            bad: '<:Low:1166951885433995264>',
        };

        await interaction.deferReply(); // Defer the reply before editing

        const pinging = await interaction.editReply({ content: 'pinging...' });

        const ws = interaction.client.ws.ping; // websocket ping
        const msgEdit = Date.now() - pinging.createdTimestamp; // api latency

        // uptime
        let days = Math.floor(interaction.client.uptime / 86400000);
        let hours = Math.floor(interaction.client.uptime / 3600000) % 24;
        let minutes = Math.floor(interaction.client.uptime / 60000) % 60;
        let seconds = Math.floor(interaction.client.uptime / 1000) % 60;

        const wsEmoji = ws <= 100 ? circles.good : ws <= 200 ? circles.okay : circles.bad;
        const msgEmoji = msgEdit <= 200 ? circles.good : circles.bad;

        const pingEmbed = new EmbedBuilder()
            .setThumbnail(interaction.client.user.displayAvatarURL({ size: 64 }))
            .setColor('Blue')
            .setTimestamp()
            .setFooter({ text: `Pinged en` })
            .addFields(
                {
                    name: 'Latencia de WebSocket',
                    value: `${wsEmoji} \`${ws}ms\``,
                },
                {
                    name: 'Latencia API',
                    value: `${msgEmoji} \`${msgEdit}ms\``,
                },
                {
                    name: `${interaction.client.user.username} Tiempo de actividad`,
                    value: `<:Timer:1166951887690539038> \`${days} dias, ${hours} horas, ${minutes} minutos, ${seconds} segundos\``,
                }
            );

        await pinging.edit({ embeds: [pingEmbed], content: '\u200b' });
    },
};

// emojis - https://mega.nz/folder/UTQDUAYa#idGhPj-luwuPhr8MnhrkWA