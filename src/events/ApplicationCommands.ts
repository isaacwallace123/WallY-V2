import { Events } from "discord.js";
import { Routes } from 'discord-api-types/v9';

import { Signal } from "../types/Signal";
import { Client } from "../types/Client";

const clientId: string = process.env.CLIENT_ID!;

class InitializeApplicationCommands extends Signal {
    constructor() {
        super({
            name: Events.ClientReady,
            once: true,
        });
    }

    private async deleteCommands(client: Client) {
        const guilds = client.guilds.cache.map(guild => guild.id);

        await client.rest.put(Routes.applicationCommands(clientId), { body: [] })
            .then(() => console.log('Successfully deleted all global commands.'))
            .catch(console.error);

        for (const guildId of guilds) 
            client.rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] })
                .then(() => console.log('Successfully deleted all guild commands.'))
                .catch(console.error);
    }

    async execute(client: Client) {
        //await this.deleteCommands(client);

        const globalCommands = client.GetRawGlobalCommands();

        client.rest.put(Routes.applicationCommands(clientId), { body: globalCommands })
            .then(() => console.log('Successfully updated global guild commands'))
            .catch(console.error);

        const guilds = client.guilds.cache.map(guild => guild.id);
        const guildCommands = client.GetRawGuildCommands();

        for (const guildId of guilds)
            client.rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: guildCommands })
                .then(() => console.log(`Successfully updated guild commands for ${guildId}`))
                .catch(console.error);

        /*client.rest.put(Routes.applicationCommands(clientId), { body: client.GetRawCommands() }) //This is to globalize all commands
            .then(() => console.log('Successfully updated global guild commands'))
            .catch(console.error);*/
    }
}

export default InitializeApplicationCommands;