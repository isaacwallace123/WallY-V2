import { GuildMember, type ChatInputCommandInteraction } from 'discord.js';

import { Command } from '../../types/Command';
import { Client } from '../../types/Client';
import { useQueue } from 'discord-player';
import { EmbedGenerator } from '../../utils/EmbedGenerator';

class LeaveCommand extends Command {
    constructor() {
        super({
            name: 'leave',
            description: 'Force bot to leave the voice call',
        });
    }

    async execute(client: Client, interaction: ChatInputCommandInteraction) {
        if (!interaction.guildId) return await interaction.reply('This command can only be used in a server');

        const member = interaction.member;

        if (!member || !(member instanceof GuildMember)) return interaction.reply({ ephemeral: true, content: 'You must be in a server to continue' });

        const channel = member.voice.channel;

        if (!channel) return interaction.reply({ embeds: [EmbedGenerator.Error({
            title: 'Ouch...',
            description: 'You want me gone that badly?..'
        })], ephemeral: true});

        const queue = useQueue(interaction.guildId);

        if (!queue) return interaction.reply({ embeds: [EmbedGenerator.Error({
            title: 'Ouch...',
            description: 'I wasn\'t event playing anything...'
        })], ephemeral: true });

        await interaction.deferReply({ ephemeral: true });

        queue.delete();

        return interaction.editReply({ embeds: [EmbedGenerator.Error({
            title: 'Disconnected!',
            description: 'Goodbye, till next time!'
        })]});
    }
}

export default LeaveCommand;