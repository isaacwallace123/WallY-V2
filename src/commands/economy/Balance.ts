import type { ChatInputCommandInteraction } from 'discord.js';

import { Command } from '../../types/Command';
import { Client } from '../../types/Client';
import { User } from '../../types/User';

class BalanceCommand extends Command {
    constructor() {
        super({
            name: 'balance',
            description: 'Check your user balance.',
        });
    }

    async execute(client: Client, interaction: ChatInputCommandInteraction) {
        await interaction.deferReply({ ephemeral: true });

        const UserData = new User(interaction.user.id);

        if (!interaction.guildId) {
            await interaction.editReply('This command can only be used in a server.');
            return;
        }

        const guildData = await UserData.getGuildData(interaction.guildId);
        
        const balance = guildData?.balance || 0;

        await interaction.editReply(`Your current balance is: ${balance}`);
    }
}

export default BalanceCommand;