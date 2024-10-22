import { ApplicationCommandOptionType, type ChatInputCommandInteraction } from 'discord.js';

import { Command } from '../../types/Command';
import { Client } from '../../types/Client';
import { User } from '../../types/User';

class BalanceCommand extends Command {
    constructor() {
        super({
            name: 'give',
            description: 'Give specified user money',
            options: [
                {
                    name: 'user',
                    description: 'The user you want to give money to.',
                    type: ApplicationCommandOptionType.User,
                    required: true,
                },
                {
                    name: 'amount',
                    description: 'The amount you want to give the user.',
                    type: ApplicationCommandOptionType.Number,
                    required: false,
                },
            ]
        });
    }

    async execute(client: Client, interaction: ChatInputCommandInteraction) {
        await interaction.deferReply({ ephemeral: true });

        if (!interaction.guildId) {
            await interaction.editReply('This command can only be used in a server.');
            return;
        }

        const guild = await new User(interaction.user.id).getGuildData(interaction.guildId);
        
        const balance = guild?.balance || 0;

        await interaction.editReply(`Your current balance is: ${balance}`);
    }
}

export default BalanceCommand;