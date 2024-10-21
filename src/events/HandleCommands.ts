import { Events, ChatInputCommandInteraction } from 'discord.js';

import { Command } from '../types/Command';
import { Signal } from '../types/Signal';
import { Client } from '../types/Client';

class HandleCommands extends Signal {
    constructor() {
        super({
            name: Events.InteractionCreate,
            once: false,
        });
    }

    async execute(client: Client, interaction: ChatInputCommandInteraction) {
        if (!interaction.isCommand() || !interaction.inCachedGuild()) return;

        const command: Command | undefined = client.commands.get(interaction.commandName);

        if (!command) return;

        try {
            await command.execute(client, interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: "There was an error executing this command", ephemeral: true });
        }
    }
}

export default HandleCommands;