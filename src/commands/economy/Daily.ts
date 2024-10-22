import type { ChatInputCommandInteraction } from 'discord.js';

import { Command } from '../../types/Command';
import { Client } from '../../types/Client';
import { User } from '../../types/User';

const RewardAmount = 100;
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

        if (!interaction.guildId) return await interaction.editReply('This command can only be used in a server.');
        
        const guild = await new User(interaction.user.id).getGuildData(interaction.guildId);

        const LastClaimTime: Date | null = guild?.daily || null;
        const CurrentTime = Date.now();

        const Timestamp = LastClaimTime ? new Date(LastClaimTime).getTime() : 0;

        if (CurrentTime - Timestamp < DailyCooldown) {
            const TimeLeft = DailyCooldown - (CurrentTime - Timestamp);

            return await interaction.editReply(`You have already claimed your daily reward. Please come back in ${Math.floor(TimeLeft / (1000 * 60 * 60))} hours and ${Math.floor((TimeLeft % (1000 * 60 * 60)) / (1000 * 60))} minutes.`);
        }
        
        const { balance } = await guild.addBalance(RewardAmount);
        await guild.setDaily();

        await interaction.editReply(`Your current balance is: ${balance}`);
    }
}

export default DailyCommand;