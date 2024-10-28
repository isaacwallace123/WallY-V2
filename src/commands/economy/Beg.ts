import type { ChatInputCommandInteraction, Collection } from 'discord.js';

import { Command } from '../../types/Command';
import { Client } from '../../types/Client';
import { User } from '../../types/User';
import { Suffix } from '../../utils/Suffix';
import { Currencies } from '../../utils/Constants';
import { EmbedGenerator } from '../../utils/EmbedGenerator';

const rewards = [
    { amount: 100, chance: 0.85 },
    { amount: 200, chance: 0.1 },
    { amount: 500, chance: 0.05 },
];

interface Quote {
    title: string;
    description: string;
}

const Quotes:Record<string, Quote[]> = {
    Nothing : [
        { title: "Too bad", description: "You don't deserve my cursed riches" },
        { title: "What a shame", description: "My gold is buried deep, and you're not getting any" },
        { title: "Repulsive..", description: "Coins aren't for the damned like you" }
    ],

    Something: [
        { title: "Oh no!", description: "Oh you poor soul, take" }
    ]
}

const GetQuote = (num: number):Quote => {
    const ChosenArray = num <= 0 ? Quotes.Nothing : Quotes.Something;
    
    return ChosenArray[Math.floor(Math.random() * ChosenArray.length)];
}

class BegCommand extends Command {
    constructor() {
        super({
            name: 'beg',
            description: 'Beg for some money you filthy peasant!',
            cooldown: 60,
        });
    }

    async execute(client: Client, interaction: ChatInputCommandInteraction) {
        if (!interaction.guildId) return await interaction.reply({ content: 'This command can only be used in a server', ephemeral: true });

        await interaction.deferReply();

        let RandomValue = Math.random();

        const amount = RandomValue < 0.5 ? 0 : rewards.find(reward => (RandomValue = (RandomValue - 0.5) * 2) - reward.chance < 0)?.amount || 0;

        const UsedQuote:Quote = GetQuote(amount);

        const guild = await new User(interaction.user.id).getGuildData(interaction.guildId);

        await guild.addBalance(amount);

        const embed = (amount <= 0 ? EmbedGenerator.Error : EmbedGenerator.default)({
            title: UsedQuote.title,
            description: `"${UsedQuote.description}${amount <= 0 ? "" : ` **${Currencies.main}${Suffix(amount)}**`}"`,
            footer: { text: `${amount <= 0 ? "Imagine begging" : ""}` }
        });

        await interaction.editReply({ embeds: [embed] });
    }
}

export default BegCommand;