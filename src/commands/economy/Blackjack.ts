import { ApplicationCommandOptionType, type ChatInputCommandInteraction, ButtonStyle, ComponentType, ButtonInteraction } from 'discord.js';
import { ActionRowBuilder, ButtonBuilder } from '@discordjs/builders';

import { Command } from '../../types/Command';
import { Client } from '../../types/Client';
import { User } from '../../types/User';
import { EmbedGenerator } from '../../utils/EmbedGenerator';

import { websiteLink } from '../../utils/Constants';

enum PlayerAction {
    Hit = 'hit',
    Stand = 'stand',
    Double = 'double'
}

class BlackjackCommand extends Command {
    constructor() {
        super({
            name: 'blackjack',
            description: 'Play a game of blackjack.',
            options: [
                {
                    name: 'amount',
                    description: 'The amount you would like to wager.',
                    type: ApplicationCommandOptionType.Integer,
                    required: true,
                }
            ]
        });
    }

    private getDisplay(cards: string[]): string {
        return cards.map(card => {
            const [rank, suit] = card.split(' of ');
            const suitIcon = suit === "Hearts" ? "♥" : suit === "Diamonds" ? "♦" : suit === "Spades" ? "♠" : "♣";
            return `[${rank}${suitIcon}](${websiteLink})`;
        }).join(', ');
    }

    private createDeck(): string[] {
        return ['Hearts', 'Diamonds', 'Clubs', 'Spades'].flatMap(suit => ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'].map(rank => `${rank} of ${suit}`)).sort(() => Math.random() - 0.5);
    }

    private calculateTotal(hand: string[]): number {
        let total = hand.reduce((accumulator, card) => {
            const value = card.split(' ')[0];

            return accumulator + (['K', 'Q', 'J'].includes(value) ? 10 : value === 'A' ? 11 : parseInt(value));
        }, 0);
        return hand.filter(card => card.startsWith('A')).reduce((accumulator) => accumulator > 21 ? accumulator - 10 : accumulator, total);
    }

    private createActionRow(isDoubleDownEnabled: boolean) {
        return new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder().setCustomId(PlayerAction.Hit).setLabel('Hit').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId(PlayerAction.Stand).setLabel('Stand').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId(PlayerAction.Double).setLabel('Double Down').setStyle(ButtonStyle.Success).setDisabled(!isDoubleDownEnabled)
        );
    }

    private async dealerTurn(response: ButtonInteraction,playerHand: string[],dealerHand: string[],deck: string[],amount: number,playerTotal: number,dealerTotal: number) {
        while (dealerTotal < 17) {
            dealerHand.push(deck.pop()!);
            dealerTotal = this.calculateTotal(dealerHand);
        }

        const result = dealerTotal > 21 || playerTotal > dealerTotal
            ? `You win ${amount * 2}!`
            : dealerTotal === playerTotal
            ? 'Draw! Wager returned.'
            : `You lose ${amount}.`;

        const EmbedType = dealerTotal > 21 || playerTotal > dealerTotal ? EmbedGenerator.Success : dealerTotal === playerTotal ? EmbedGenerator.Warning : EmbedGenerator.Error

        const embed = EmbedType({
            title: 'Blackjack Result',
            fields: [
                { 
                    name: 'You', 
                    value: `${this.getDisplay(playerHand)} (Total: ${playerTotal})`
                },
                { 
                    name: 'Dealer', 
                    value: `${this.getDisplay(dealerHand)} (Total: ${dealerTotal})`
                }
            ],
            footer: { text: `${result}` }
        });

        await response.update({ embeds: [embed], components: [] });

        return true;
    }

    private async playerHit(response: ButtonInteraction, playerHand: string[], dealerHand: string[], deck: string[], amount: number, playerTotal: number, dealerTotal: number) {
        const card = deck.pop()!;
        
        playerHand.push(card);
        playerTotal = this.calculateTotal(playerHand);

        const playerBusted:boolean = playerTotal > 21;

        const EmbedType = playerBusted ? EmbedGenerator.Error : EmbedGenerator.Info;
        const result = playerBusted ? `You busted! You lose ${amount}.` : `Hit or Stand?`;

        const embed = EmbedType({
            title: 'Blackjack Result',
            fields: [
                { 
                    name: 'You', 
                    value: `${this.getDisplay(playerHand)} (Total: ${playerTotal})`
                },
                { 
                    name: 'Dealer', 
                    value: `${this.getDisplay(playerBusted ? dealerHand : [dealerHand[0]])} ${playerBusted ? `(Total: ${dealerTotal})` : ''}`
                }
            ],
            footer: { text: `${result}` }
        });

        await response.update({ embeds: [embed], components: playerBusted ? [] : [this.createActionRow(false)] });

        return playerBusted;
    }

    private async handleAction(response: ButtonInteraction, playerHand: string[], dealerHand: string[], deck: string[], amount: number, collector: any) {
        if (response.user.id !== response.message.interactionMetadata!.user.id) return response.reply({ content: "This is not your game!", ephemeral: true });

        const playerTotal = this.calculateTotal(playerHand);
        const dealerTotal = this.calculateTotal(dealerHand);

        const outcome = response.customId === PlayerAction.Hit 
            ? await this.playerHit(response, playerHand, dealerHand, deck, amount, playerTotal, dealerTotal) 
            : await this.dealerTurn(response, playerHand, dealerHand, deck, amount, playerTotal, dealerTotal);
        
        if (outcome) collector.stop();
    }

    async execute(client: Client, interaction: ChatInputCommandInteraction) {
        if (!interaction.guildId) return await interaction.reply('This command can only be used in a server');

        const amount = interaction.options.getInteger('amount', true);
        const user = await new User(interaction.user.id).getGuildData(interaction.guildId);

        if (user.balance < amount) return await interaction.reply({ content: 'You do not have enough money to wager that amount!', ephemeral: true });

        await interaction.deferReply();

        const deck = this.createDeck();

        const playerHand = [deck.pop()!, deck.pop()!];
        const dealerHand = [deck.pop()!, deck.pop()!];

        let playerTotal = this.calculateTotal(playerHand);

        const embed = EmbedGenerator.Info({
            title: 'Blackjack Game',
            fields: [
                { 
                    name: 'You', 
                    value: `${this.getDisplay(playerHand)} (Total: ${playerTotal})`
                },
                { 
                    name: 'Dealer', 
                    value: `${this.getDisplay([dealerHand[0]])}`
                }
            ]
        });

        const isDoubleDownEnabled = user.balance >= amount * 2;

        const message = await interaction.editReply({ embeds: [embed], components: [this.createActionRow(isDoubleDownEnabled)] });

        const collector = message.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60000 });

        collector.on('collect', async (response: ButtonInteraction) => this.handleAction(response, playerHand, dealerHand, deck, amount, collector));

        collector.on('end', async () => {
            if(collector.ended) return;

            const timeoutEmbed = EmbedGenerator.Error({
                title: 'Game Ended',
                description: 'Game timed out.',
            });

            return message.edit({ embeds: [timeoutEmbed], components: [] });
        });
    }
}

export default BlackjackCommand;