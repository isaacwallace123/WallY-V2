import type { ChatInputCommandInteraction } from 'discord.js';

import { Command } from '../../types/Command';
import { Client } from '../../types/Client';
import { User } from '../../types/User';

import { EmbedGenerator } from '../../utils/EmbedGenerator';
import { FormatBalance } from '../../utils/FormatCurrency';

const RewardAmount = 1000;
const DailyCooldown = 24 * 60 * 60 * 1000;

class DailyCommand extends Command {
    constructor() {
        super({
            name: 'daily',
            description: 'Collect your daily reward.',
        });
    }

    async execute(client: Client, interaction: ChatInputCommandInteraction) {
        if (!interaction.guildId) return await interaction.reply({ content: 'This command can only be used in a server', ephemeral: true });

        await interaction.deferReply({ ephemeral: true });
        
        const guild = await new User(interaction.user.id).getGuildData(interaction.guildId);

        const Timestamp = guild.daily ? new Date(guild.daily).getTime() : 0;

        if (Date.now() - Timestamp < DailyCooldown) return await interaction.editReply({ embeds: [EmbedGenerator.default({
            description: `You have already claimed your daily reward. Try again <t:${Math.floor(new Date(Timestamp + DailyCooldown).getTime() / 1000)}:R>`
        })]});
        
        await guild.addBalance(RewardAmount);
        await guild.setDaily();

        const embed = EmbedGenerator.default({
            description: `Successfully claimed ${FormatBalance(RewardAmount)}`
        });

        await interaction.editReply({ embeds: [embed] });
    }
}

export default DailyCommand;