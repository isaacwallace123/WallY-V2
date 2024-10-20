import { Events } from "discord.js";
import { Routes } from 'discord-api-types/v9';

import Signal from '../types/Signal';
import Client from '../types/Client';

class InitializeApplicationCommands extends Signal {
    constructor() {
        super({
            name: Events.ClientReady,
            once: true,
        });
    }

    async execute(client: Client) {
        const guilds = client.guilds.cache.map(guild => guild.id);
        const clientId = process.env.CLIENT_ID;

        if (!clientId) {
            console.error('CLIENT_ID is not defined in the environment variables.');
            return;
        }

        for (const guildId of guilds) {
            client.rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: client.GetRawCommands() })
                .then(() => console.log('Successfully updated commands for guild ' + guildId))
                .catch(console.error);
        }
    }
}

export default InitializeApplicationCommands;