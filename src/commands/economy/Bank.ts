import { ApplicationCommandOptionType, ButtonInteraction, ButtonStyle, ComponentType, type ChatInputCommandInteraction } from 'discord.js';

import { Command } from '../../types/Command';
import { Client } from '../../types/Client';
import { User } from '../../types/User';

import { EmbedGenerator } from '../../utils/EmbedGenerator';
import { FormatBalance, FormatBank, FormatBankWithoutLimit } from '../../utils/FormatCurrency';
import { getMaxBalance, getUpgradePrice } from '../../utils/Constants';
import { Suffix } from '../../utils/Suffix';
import { ActionRowBuilder, ButtonBuilder } from '@discordjs/builders';

enum UpgradeActions {
    Confirm = "Confirm",
    Cancel = "Cancel"
}

class BalanceCommand extends Command {
    constructor() {
        super({
            name: 'bank',
            description: 'Manage your finances',

            options: [
                {
                    name: 'deposit',
                    description: 'Deposit money into your bank',
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'amount',
                            description: 'The amount you would like to deposit',
                            type: ApplicationCommandOptionType.Integer,
                            required: true,
                        }
                    ]
                },
                {
                    name: 'withdraw',
                    description: 'Withdraw money from your bank',
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'amount',
                            description: 'The amount you would like to withdraw',
                            type: ApplicationCommandOptionType.Integer,
                            required: true,
                        }
                    ]
                },
                {
                    name: 'upgrade',
                    description: 'Upgrade your bank balance limit',
                    type: ApplicationCommandOptionType.Subcommand,
                },
            ]
        });
    }

    private async upgrade(interaction: ChatInputCommandInteraction) {
        const UserObject = new User(interaction.user.id);

        const UserData = await UserObject.getUserData();
        const GuilData = await UserObject.getGuildData(interaction.guildId!);
        
        const UpgradePrice = getUpgradePrice(UserData.bank.level);

        const message = await interaction.editReply({ embeds: [EmbedGenerator.Info({
            title: 'Upgrade Panel',
            description: `\n**Price:** ${FormatBalance(getUpgradePrice(UserData.bank.level))}\n**Bank Limit:** ${FormatBankWithoutLimit(getMaxBalance(UserData.bank.level))}\n\nWould you still like to proceed?`
        })], components: [
            new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder().setCustomId(UpgradeActions.Confirm).setLabel('Confirm').setStyle(ButtonStyle.Success).setDisabled(GuilData.balance < UpgradePrice),
                new ButtonBuilder().setCustomId(UpgradeActions.Cancel).setLabel('Cancel').setStyle(ButtonStyle.Danger),
            )
        ]});

        const collector = message.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60000 });

        collector.on('collect', async (response: ButtonInteraction) => {
            if (response.customId === UpgradeActions.Confirm) {
                const { bank } = await UserData.upgradeBank();

                await GuilData.removeBalance(UpgradePrice);

                const embed = EmbedGenerator.Success({
                    title: 'Successfully Upgraded',
                    description: `\n**New Bank limit:** ${FormatBankWithoutLimit(getMaxBalance(bank.level))}`
                });

                return await interaction.editReply({ embeds: [embed], components: [] });
            }

            collector.stop();
        });

        collector.on('end', async () => {
            return await interaction.deleteReply();
        });
    }

    private async withdraw(interaction: ChatInputCommandInteraction, amount: number) {
        const UserObject = new User(interaction.user.id);

        const UserData = await UserObject.getUserData();

        const Timestamp = UserData.bank.last ? new Date(UserData.bank.last).getTime() : 0;

        if (Date.now() - Timestamp < 86400000) return await interaction.editReply({ embeds: [EmbedGenerator.default({
            description: `Your withdraw is on cooldown. Try again <t:${Math.floor(new Date(Timestamp + 86400000).getTime() / 1000)}:R>`
        })]});

        if (UserData.bank.balance <= 0) return await interaction.editReply({ embeds: [EmbedGenerator.default({
            description: `You need the actual money in your bank to withdraw.`
        })]});

        const GuilData = await UserObject.getGuildData(interaction.guildId!);

        const { balance } = await GuilData.addBalance(amount);
        const { bank } = await UserData.removeBank(amount);

        await UserData.setBankCooldown();

        const embed = EmbedGenerator.Success({
            description: `${FormatBank(amount, bank.level)} --> ${FormatBalance(balance)}`
        });

        return await interaction.editReply({ embeds: [embed] })
    }

    private async deposit(interaction: ChatInputCommandInteraction ,amount: number) {
        const UserObject = new User(interaction.user.id);

        const GuildData = await UserObject.getGuildData(interaction.guildId!);

        if (GuildData.balance <= 0 || GuildData.balance < amount) return await interaction.editReply({ embeds: [EmbedGenerator.default({
            description: `You need the actual money in your balance to deposit.`
        })]});

        const UserData = await UserObject.getUserData();

        if (UserData.bank.balance + amount > getMaxBalance(UserData.bank.level)) return await interaction.editReply({ embeds: [EmbedGenerator.default({
            description: `You must upgrade your bank limit to do that`
        })]});

        const { bank } = await UserData.addBank(amount);
        await GuildData.removeBalance(amount);

        const embed = EmbedGenerator.Success({
            description: `${FormatBalance(amount)} --> ${FormatBank(bank.balance, bank.level)}`
        });

        return await interaction.editReply({ embeds: [embed] });
    }

    async execute(client: Client, interaction: ChatInputCommandInteraction) {
        if (!interaction.guildId) return await interaction.reply({ content: 'This command can only be used in a server', ephemeral: true });

        await interaction.deferReply({ ephemeral: true });

        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'upgrade') return await this.upgrade(interaction);

        const amount = interaction.options.getInteger('amount', true);

        if(amount <= 0) return await interaction.editReply({ embeds: [EmbedGenerator.default({
            description: 'The amount must be a positive number greater than 0'
        })]});

        if (subcommand === 'deposit') {
            return await this.deposit(interaction, amount);
        } else if (subcommand === 'withdraw') {
            return await this.withdraw(interaction, amount);
        }
    }
}

export default BalanceCommand;