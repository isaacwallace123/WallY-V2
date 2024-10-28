import { ApplicationCommandOptionType, type ChatInputCommandInteraction } from 'discord.js';

import { Command } from '../../types/Command';
import { Client } from '../../types/Client';
import { User } from '../../types/User';

import { FormatBalance } from '../../utils/FormatCurrency';
import { EmbedGenerator } from '../../utils/EmbedGenerator';

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

        const user = interaction.options.getUser("user", true);

        if(user.id === interaction.user.id || user.bot || user.system) return await interaction.reply({ content: 'You cannot pay that user!', ephemeral: true });

        const amount = interaction.options.getInteger("amount", true);

        if(amount <= 0) return await interaction.reply({ content: 'The amount must be a positive number greater than 0', ephemeral: true });

        await interaction.deferReply();

        const TargetUserData = await new User(user.id).getGuildData(interaction.guildId);
        const UserData = await new User(interaction.user.id).getGuildData(interaction.guildId);

        if(UserData.balance < amount) return await interaction.editReply({ embeds: [EmbedGenerator.Error({
            description: `You don't have ${FormatBalance(amount)} to give.`
        }).withAuthor(interaction.user)]});

        const { balance: TargetBalance } = await TargetUserData.addBalance(amount);
        const { balance: UserBalance } = await UserData.removeBalance(amount);

        const embed = EmbedGenerator.Success({
            title: 'Payment Successful',
            description: `<@${interaction.user.id}> **-->** ${FormatBalance(amount)} **-->** <@${user.id}>`,
            /*fields: [
                {
                    name: `${interaction.user.username}`,
                    value: `${FormatBalance(UserBalance)}`,
                    inline: true,
                },
                {
                    name: `${user.username}`,
                    value: `${FormatBalance(TargetBalance)}`,
                    inline: true,
                },
            ]*/
        })

        return await interaction.editReply({ embeds: [embed] });
    }
}

export default PayCommand;