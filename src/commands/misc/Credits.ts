import type { ChatInputCommandInteraction } from 'discord.js';

import { Command } from '../../types/Command';
import { Client } from '../../types/Client';

import { EmbedGenerator } from '../../utils/EmbedGenerator';

class CreditsCommand extends Command {
    constructor() {
        super({
            name: 'credits',
            description: 'Know who spent the time to build the bot!',
            isGlobal: true,
        });
    }

    async execute(client: Client, interaction: ChatInputCommandInteraction) {
        await interaction.deferReply({ ephemeral: true });

        const embed = EmbedGenerator.Info({
            title: "Credits",
            description: `Programmer: isaacwallace123\nImages: Soggy`
        });

        return await interaction.editReply({ embeds: [embed] });
    }
}

export default CreditsCommand;