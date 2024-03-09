const { ActivityType } = require('discord.js');
const mongoose = require('mongoose');
const config = require("../../config.json")

const fs = require('fs');
const path = require('path');


module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        

        try {

            
        


            const totalMembers = client.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0);
            const totalServers = client.guilds.cache.size;
            const totalChannels = client.channels.cache.size;
            const shardCount = client.shard ? client.shard.count : 1;

            // Imprime el mensaje de inicio
            console.log(('[ONLINE]') + ` ${client.user.tag} está en línea en ${totalServers} servidor(es) con ${totalMembers} miembros y ${totalChannels} canales!`);

            const activities = [
                `en ${totalServers} servidore${totalServers > 1 ? 's' : ''}`,
                `en ${totalChannels} canale${totalChannels > 1 ? 's' : ''}`,
                `/help `,
                
            ];

            let i = 0;

            setInterval(() => {
                client.user.setPresence({ activities: [{ name: activities[i++ % activities.length], type: ActivityType.Watching }] });
            }, 15000);
        }
        catch (error) {
            console.error(error);
        }
    }
}