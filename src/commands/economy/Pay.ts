import { ApplicationCommandOptionType, type ChatInputCommandInteraction } from 'discord.js';

import { Command } from '../../types/Command';
import { Client } from '../../types/Client';
import { User } from '../../types/User';

import { FormatBalance } from '../../utils/FormatCurrency';

class PayCommand extends Command {
    constructor() {
        super({
            name: 'pay',
            description: 'Pay a person some money.',
            options: [
                {
                    name: 'user',
                    description: 'The specified user',
                    type: ApplicationCommandOptionType.User,
                    required: true,
                },
                {
                    name: 'amount',
                    description: 'The amount to pay',
                    type: ApplicationCommandOptionType.Integer,
                    required: true,
                },
            ]
        });
    }

    async execute(client: Client, interaction: ChatInputCommandInteraction) {
        if (!interaction.guildId) return await interaction.reply({ content: 'This command can only be used in a server', ephemeral: true });

        await interaction.deferReply({ ephemeral: true });

        const user = interaction.options.getUser("user", true);

        if(user.id === interaction.user.id) return await interaction.editReply('You cannot pay yourself!');

        const amount = interaction.options.getInteger("amount", true);

        if(amount <= 0) return await interaction.editReply('The amount must be a positive number greater than 0');

        const TargetUserData = await new User(user.id).getGuildData(interaction.guildId);
        const UserData = await new User(interaction.user.id).getGuildData(interaction.guildId);

        if(UserData.balance < amount) return await interaction.editReply('You do not have enough money to pay user');

        const NewUserData = await TargetUserData.addBalance(amount);
        await UserData.removeBalance(amount);

        return await interaction.editReply({ content: `<@${NewUserData.user.id}>'s new balance is **${FormatBalance(NewUserData.balance)}**` });
    }
}

export default PayCommand;