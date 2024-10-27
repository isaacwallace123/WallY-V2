import type { ChatInputCommandInteraction } from 'discord.js';

import { Command } from '../../types/Command';
import { Client } from '../../types/Client';
import { User } from '../../types/User';

import { Suffix } from '../../utils/Suffix';
import { CurrencySymbol } from '../../utils/Constants';
import { EmbedGenerator } from '../../utils/EmbedGenerator';

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
        await interaction.deferReply({ ephemeral: true });

        if (!interaction.guildId) return await interaction.editReply('This command can only be used in a server');
        
        const guild = await new User(interaction.user.id).getGuildData(interaction.guildId);

        const LastClaimTime: Date | null = guild?.daily || null;
        const CurrentTime = Date.now();
        const Timestamp = LastClaimTime ? new Date(LastClaimTime).getTime() : 0;

        if (CurrentTime - Timestamp < DailyCooldown) return await interaction.editReply({ embeds: [EmbedGenerator.default({
            description: `You have already claimed your daily reward. Try again <t:${Math.floor((Timestamp + DailyCooldown - CurrentTime) / 1000)}:R>`
        })]});
        
        const { balance } = await guild.addBalance(RewardAmount);
        await guild.setDaily();

        await interaction.editReply(`Your new balance is ${CurrencySymbol}**${Suffix(balance)}**`);
    }
}

export default DailyCommand;