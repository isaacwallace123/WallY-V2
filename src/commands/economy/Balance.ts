import { ApplicationCommandOptionType, type ChatInputCommandInteraction } from 'discord.js';

import { Command } from '../../types/Command';
import { Client } from '../../types/Client';
import { User } from '../../types/User';

import { EmbedGenerator } from '../../utils/EmbedGenerator';
import { FormatBalance, FormatBank, FormatCrypto, FormatShells } from '../../utils/FormatCurrency';
import { Server } from '../../types/Server';

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
        const user = userOption ? userOption : interaction.user;

        if (!user || user.bot || user.system) return await interaction.reply({ content: 'User data does not exist', ephemeral: true });

        await interaction.deferReply({ ephemeral: true });

        const UserModel = new User(user.id);

        const { bank, crypto } = await UserModel.getUserData();
        const { balance } = await UserModel.getGuildData(interaction.guildId);
        const { leaderboards } = await new Server(interaction.guildId).sortBalances();

        const userPlacement = leaderboards.balances.findIndex(userId => userId === user.id) + 1;

        const embed = EmbedGenerator.default({
            description: `${FormatBalance(balance)}\n${FormatBank(bank.balance, bank.level)}\n\n${FormatCrypto(crypto.balance)}\n${FormatShells(crypto.shells)}`,
            footer: { text: `Server Rank: #${userPlacement}` }
        }).withAuthor(user);

        await interaction.editReply({ embeds: [embed] });
    }
}

export default BalanceCommand;