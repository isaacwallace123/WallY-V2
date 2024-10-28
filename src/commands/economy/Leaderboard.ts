import { ApplicationCommandOptionType, type ChatInputCommandInteraction } from 'discord.js';

import { Command } from '../../types/Command';
import { Client } from '../../types/Client';
import { User } from '../../types/User';
import { Suffix } from '../../utils/Suffix';
import { CurrencySymbol } from '../../utils/Constants';
import { Server } from '../../types/Server';
import { EmbedGenerator } from '../../utils/EmbedGenerator';

class LeaderboardCommand extends Command {
    constructor() {
        super({
            name: 'leaderboard',
            description: 'See the top players.',
            options: [
                {
                    type: ApplicationCommandOptionType.Subcommand,
                    name: 'levels',
                    description: 'View the top players by levels'
                },
                {
                    type: ApplicationCommandOptionType.Subcommand,
                    name: 'balances',
                    description: 'View the top players by their balances'
                }
            ]
        });
    }

    private async Levels(interaction: ChatInputCommandInteraction) {
        const { leaderboards } = await new Server(interaction.guildId!).sortLevels();

        const playersWithLevels = await Promise.all(
            leaderboards.levels.slice(0,10).map(async (userId) => {
                const { level } = await new User(userId).getGuildData(interaction.guildId!);
                return { id: userId, level: level };
            })
        );

        const leaderboardMessage = playersWithLevels.map((player, index) => `**${index + 1}. <@${player.id}> - Level ${player.level}** `).join('\n');

        const userPlacement = leaderboards.levels.findIndex(userId => userId === interaction.user.id) + 1;

        const embed = EmbedGenerator.Info({
            title: 'Most Experienced Users',
            description: leaderboardMessage,
            footer: { text: `Your placement is #${userPlacement}` }
        });

        await interaction.reply({ embeds: [embed] });
    }

    private async Balances(interaction: ChatInputCommandInteraction) {
        const { leaderboards } = await new Server(interaction.guildId!).sortBalances();

        const playersWithLevels = await Promise.all(
            leaderboards.balances.slice(0,10).map(async (userId) => {
                const { balance } = await new User(userId).getGuildData(interaction.guildId!);
                return { id: userId, balance: balance };
            })
        );

        const leaderboardMessage = playersWithLevels.map((player, index) => `**${index + 1}. <@${player.id}> - ${CurrencySymbol}${Suffix(player.balance)}** `).join('\n');

        const userPlacement = leaderboards.balances.findIndex(userId => userId === interaction.user.id) + 1;

        const embed = EmbedGenerator.Info({
            title: 'Richest Players',
            description: leaderboardMessage,
            footer: { text: `Your placement is #${userPlacement}` }
        });

        await interaction.reply({ embeds: [embed] });
    }

    async execute(client: Client, interaction: ChatInputCommandInteraction) {
        if (!interaction.guildId) return await interaction.reply({ content: 'This command can only be used in a server', ephemeral: true });

        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'levels') await this.Levels(interaction);
        else if (subcommand === 'balances') await this.Balances(interaction);
    }
}

export default LeaderboardCommand;