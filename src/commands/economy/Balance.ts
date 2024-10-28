import { ApplicationCommandOptionType, type ChatInputCommandInteraction } from 'discord.js';

import { Command } from '../../types/Command';
import { Client } from '../../types/Client';
import { User } from '../../types/User';
import { Suffix } from '../../utils/Suffix';
import { Currencies } from '../../utils/Constants';
import { EmbedGenerator } from '../../utils/EmbedGenerator';

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
        if (!interaction.guildId) return await interaction.reply({ content: 'This command can only be used in a server', ephemeral: true });

        const userOption = interaction.options.getUser("user", false);

        const userId = userOption ? userOption.id : interaction.user.id;
        const user = client.users.cache.find((user) => user.id === userId);

        if (!user) return await interaction.reply({ content: 'User does not exist', ephemeral: true });

        await interaction.deferReply({ ephemeral: true });

        const UserModel = new User(userId);

        const { bank } = await UserModel.getUserData();
        const { balance, crypto } = await UserModel.getGuildData(interaction.guildId);

        const embed = EmbedGenerator.default({
            description: `${Currencies.main}${Suffix(balance)}\n${Currencies.crypto}${Suffix(crypto)}\n${Currencies.bank}${bank}`
        }).withAuthor(user);

        await interaction.editReply({ embeds: [embed] });
    }
}

export default BalanceCommand;