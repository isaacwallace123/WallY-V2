import { Events, ChatInputCommandInteraction, Collection } from 'discord.js';

import { Command } from '../types/Command';
import { Signal } from '../types/Signal';
import { Client } from '../types/Client';

import { EmbedGenerator } from '../utils/EmbedGenerator';

const CooldownTitles:string[] = [
    "Too spicy, take a breather",
    "Hold your horses",
    "Pump the brakes, speed racer",
    "Heeeyoo lets slow it down",
    "Spam isn't cool fam"
]

class HandleCommands extends Signal {
    private cooldowns: Map<string, Collection<string, number>>;

    constructor() {
        super({
            name: Events.InteractionCreate,
            once: false,
        });

        this.cooldowns = new Map();
    }

    async execute(client: Client, interaction: ChatInputCommandInteraction) {
        if (!interaction.isCommand()) return;

        const command: Command | undefined = client.commands.list.get(interaction.commandName);

        if (!command || (!interaction.inCachedGuild() && command.data.isGlobal === false)) return await interaction.reply({ embeds: [EmbedGenerator.default({
            description: `This command can only be ran in a server`
        })]});

        if (command.data.cooldown) {
            const now = Date.now();
            const cooldownAmount = command.data.cooldown * 1000;
            const timestamps = this.cooldowns.get(interaction.commandName) ?? new Collection();

            this.cooldowns.set(interaction.commandName, timestamps);
        
            const expirationTime = timestamps.get(interaction.user.id) ?? 0;

            if (now < expirationTime) return await interaction.reply({
                embeds: [EmbedGenerator.default({
                    title: `${CooldownTitles[Math.floor(Math.random() * CooldownTitles.length)]}`,
                    description: `You'll be able to use this command again <t:${Math.floor(expirationTime / 1000)}:R>\n\nThe default cooldown is **${command.data.cooldown} seconds**`
                })],
                ephemeral: true,
            });
        
            timestamps.set(interaction.user.id, now + cooldownAmount);

            setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
        }

        try {
            await command.execute(client, interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: "There was an error executing this command", ephemeral: true });
        }
    }
}

export default HandleCommands;