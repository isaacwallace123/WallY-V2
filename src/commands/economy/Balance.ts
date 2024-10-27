import { ApplicationCommandOptionType, type ChatInputCommandInteraction } from 'discord.js';

import { Command } from '../../types/Command';
import { Client } from '../../types/Client';
import { User } from '../../types/User';
import { Suffix } from '../../utils/Suffix';
import { CurrencySymbol } from '../../utils/Constants';

class BalanceCommand extends Command {
    constructor() {
        super({
            name: 'balance',
            description: 'Check your user balance.',
            options: [
                {
                    name: 'user',
                    description: 'The specified user',
                    type: ApplicationCommandOptionType.User,
                    required: false,
                }
            ]
        });
    }

    async execute(client: Client, interaction: ChatInputCommandInteraction) {
        if (!interaction.guildId) return await interaction.reply('This command can only be used in a server');

        const userOption = interaction.options.getUser("user", false);

        const userId = userOption ? userOption.id : interaction.user.id;

        await interaction.deferReply({ ephemeral: true });

        const guild = await new User(userId).getGuildData(interaction.guildId);
        
        const balance = guild?.balance || 0;

        await interaction.editReply(`<@${userId}>'s current balance is ${CurrencySymbol}**${Suffix(balance)}**`);
    }
}

export default BalanceCommand;