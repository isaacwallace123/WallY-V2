import { ApplicationCommandOptionType, type ChatInputCommandInteraction, ButtonStyle, ComponentType, ButtonInteraction, InteractionCollector } from 'discord.js';
import { ActionRowBuilder, ButtonBuilder } from '@discordjs/builders';

import { Command } from '../../types/Command';
import { Client } from '../../types/Client';
import { User } from '../../types/User';
import { Guild } from '../../types/Guild';
import { Card, Suits, Faces, UnknownCard } from '../../types/Card';

import { EmbedGenerator } from '../../utils/EmbedGenerator';
import { WebsiteLink } from '../../utils/Constants';
import { FormatBalance } from '../../utils/FormatCurrency';

enum PlayerAction {
    Hit = 'hit',
    Stand = 'stand',
    Double = 'double'
}

enum GameOutcome {
    Win = "win",
    Tie = "tie",
    Loss = "loss",
    Ongoing = "ongoing",
}

class Deck {
    cards: Card[];

    constructor() {
        this.cards = this.Create();
        this.Shuffle();
    }

    private Create(): Card[] {
        return Object.values(Suits).flatMap(suit => 
            Object.entries(Faces).map(([faceName, face]) => ({
                value: faceName === 'Aces' ? 11 : ['King', 'Queen', 'Jack'].includes(faceName) ? 10 : Number(faceName),
                suit: suit,
                face: faceName,
                icon: suit === Suits.Clubs || suit === Suits.Spades ? face.Black : face.Red
            }))
        );
    }

    private Shuffle(): void {
        this.cards.forEach((_, i) => {
            const random = Math.floor(Math.random() * (i + 1));

            [this.cards[i], this.cards[random]] = [this.cards[random], this.cards[i]];
        })
    }

    public DrawCard(): Card {
        const card = this.cards.pop()

        if (!card) {
            this.cards = this.Create();
            this.Shuffle();

            return this.DrawCard();
        }
        
        return card;
    }
}

class BlackjackPlayer {
    hand: Card[];
    value: number;
    finished: boolean;

    constructor(private deck: Deck) {
        this.hand = [];
        this.value = 0;
        this.finished = false;
    }

    private Calculate(): number {
        let total = this.hand.reduce((accumulator, card) => accumulator + card.value, 0);

        let aces = this.hand.filter(card => card.face === 'Aces').length; 
    
        while (total > 21 && aces > 0) {
            total -= 10;
            aces--;
        }
    
        this.value = total;
    
        return total;
    }

    display(cards: number): string {
        const showsCards = this.hand.slice(0, Math.min(cards, this.hand.length));
        const displayedCards = showsCards.map(card => `[${card.suit}${card.icon}](${WebsiteLink})`).join('  ');

        return this.hand.length - showsCards.length > 0 ? `${displayedCards}  [${UnknownCard.Left}${UnknownCard.Right}](${WebsiteLink})` : displayedCards;
    }
    
    hit(): number {
        this.hand.push(this.deck.DrawCard());

        this.Calculate();

        if (this.value >= 21) this.finished = true;

        return this.value;
    }
}

class BlackjackSession {
    private IsFinished: boolean;

    private deck: Deck;

    private userdata!: Guild;

    private player: BlackjackPlayer;
    private dealer: BlackjackPlayer;

    private collector: any;

    private blackjack: boolean;

    constructor(private interaction: ChatInputCommandInteraction, private stake: number, private DoubleDownEnabled: boolean) {
        this.IsFinished = false;

        this.deck = new Deck();

        this.player = new BlackjackPlayer(this.deck);
        this.dealer = new BlackjackPlayer(this.deck);

        this.player.hit();
        this.dealer.hit();
        this.player.hit();
        this.dealer.hit();

        this.blackjack = this.player.value == 21;
    }

    private GetOutcome(): GameOutcome {
        if (!this.IsFinished) {
            return GameOutcome.Ongoing;
        } else if (this.player.value > 21) {
            return GameOutcome.Loss;
        } else if (this.dealer.value > 21 || this.player.value > this.dealer.value) {
            return GameOutcome.Win;
        } else if (this.player.value === this.dealer.value) {
            return GameOutcome.Tie;
        } else {
            return GameOutcome.Loss;
        }
    }

    private CreateActionRow(): ActionRowBuilder<ButtonBuilder> {
        return new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder().setCustomId(PlayerAction.Hit).setLabel('Hit').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId(PlayerAction.Stand).setLabel('Stand').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId(PlayerAction.Double).setLabel('Double Down').setStyle(ButtonStyle.Success).setDisabled(!this.DoubleDownEnabled)
        );
    }

    private DisplayMatch() {
        const OutCome = this.GetOutcome();

        const EmbedType = {
            [GameOutcome.Win]: EmbedGenerator.Success,
            [GameOutcome.Tie]: EmbedGenerator.Warning,
            [GameOutcome.Loss]: EmbedGenerator.Error,
            [GameOutcome.Ongoing]: EmbedGenerator.Info
        }[OutCome];

        return EmbedType({
            description: `**${this.interaction.user.username}'s Blackjack Game**`,
            fields: [
                {
                    name: `${OutCome === GameOutcome.Ongoing ? "Stake" : `${OutCome === GameOutcome.Loss ? "Loss" : `${OutCome === GameOutcome.Win ? "Won" : "Kept"}`}`}`,
                    value: `**${FormatBalance(this.stake)}**`,
                },
                {
                    name: 'Dealer', 
                    value: `${this.dealer.display(this.IsFinished ? this.dealer.hand.length : 1)} ${this.IsFinished ? `\` ${this.dealer.value > 21 ? "BUST" : this.dealer.value} \`` : '\` ?? \`'}`,
                },
                { 
                    name: 'You', 
                    value: `${this.player.display(this.player.hand.length)} \` ${this.player.value > 21 ? "BUST" : this.player.value} \``,
                }
            ],
        });
    }

    async GiveRewards() {
        const OutCome: GameOutcome = this.GetOutcome();

        if (OutCome === GameOutcome.Win) {
            this.stake += Math.ceil(this.blackjack ? this.stake * 0.5 : 0);

            await this.userdata.addBalance(this.stake).catch(() => this.GiveRewards());
        } else if (OutCome === GameOutcome.Loss) {
            await this.userdata.removeBalance(this.stake).catch(() => this.GiveRewards());
        }
    }

    async HandleDealer() {
        while (this.dealer.value < 17) {
            this.dealer.hit();
        }
    }

    async EndSession() {
        this.IsFinished = true;

        await this.HandleDealer();
        await this.GiveRewards();
    }

    async HandleAction(response: ButtonInteraction) {
        if (response.user.id !== response.message.interactionMetadata!.user.id) return response.reply({ content: "This is not your game!", ephemeral: true });

        this.DoubleDownEnabled = false;

        if (response.customId === PlayerAction.Hit) {
            this.player.hit();

            this.IsFinished = this.player.finished;
        } else if (response.customId === PlayerAction.Double) {
            this.stake *= 2;

            this.player.hit();

            this.IsFinished = true;
        } else {
            this.IsFinished = true;
        }
        
        if (this.IsFinished) {
            this.collector.stop();

            await this.EndSession();
        }

        await response.update({ embeds: [this.DisplayMatch()], components: this.IsFinished ? [] : [this.CreateActionRow()] });
    }

    async initialize(): Promise<void> {
        this.userdata = await new User(this.interaction.user.id).getGuildData(this.interaction.guildId!);
    }

    async start() {
        if (this.player.finished || this.dealer.finished) {
            await this.EndSession();

            return this.interaction.editReply({ embeds: [this.DisplayMatch()], components: [] });
        }

        const message = await this.interaction.editReply({ embeds: [this.DisplayMatch()], components: [this.CreateActionRow()] });

        this.collector = message.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60000 });

        this.collector.on('collect', async (response: ButtonInteraction) => await this.HandleAction(response));

        this.collector.on('end', async (collected: ButtonInteraction[], reason: string) => {
            if (reason === 'time') {
                await this.EndSession();
    
                return message.edit({ embeds: [this.DisplayMatch()], components: [] });
            }
        });
    }
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

    async execute(client: Client, interaction: ChatInputCommandInteraction) {
        if (!interaction.guildId) return await interaction.reply({ content: 'This command can only be used in a server', ephemeral: true });

        const amount = interaction.options.getInteger('amount', true);

        if (amount <= 0) return await interaction.reply({ content: 'You cannot bet anything less than or equal to zero.', ephemeral: true });

        const user = await new User(interaction.user.id).getGuildData(interaction.guildId);

        if (user.balance < amount) return await interaction.reply({ content: 'You do not have enough money to wager that amount!', ephemeral: true });

        await interaction.deferReply();

        const Session = new BlackjackSession(interaction, amount, user.balance >= amount * 2);

        await Session.initialize();
        await Session.start();
    }
}

export default BlackjackCommand;