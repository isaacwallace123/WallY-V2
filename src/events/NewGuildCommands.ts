import { Events, Guild } from "discord.js";
import { Routes } from 'discord-api-types/v9';

import { Signal } from "../types/Signal";
import { Client } from "../types/Client";

const clientId: string = process.env.CLIENT_ID!;

class InitializeApplicationCommands extends Signal {
    constructor() {
        super({
            name: Events.GuildCreate,
            once: false,
        });
    }

    async execute(client: Client, guild: Guild) {
        const guildCommands = client.GetRawGuildCommands();
        
        client.rest.put(Routes.applicationGuildCommands(clientId, guild.id), { body: guildCommands })
            .then(() => console.log(`Successfully updated guild commands for ${guild.id}`))
            .catch(console.error);
    }
}

export default InitializeApplicationCommands;