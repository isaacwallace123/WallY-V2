import { GuildMember, type ChatInputCommandInteraction } from 'discord.js';

import { Command } from '../../types/Command';
import { Client } from '../../types/Client';
import { useMainPlayer } from 'discord-player';
import { EmbedGenerator } from '../../utils/EmbedGenerator';

class ShuffleCommand extends Command {
    constructor() {
        super({
            name: 'shuffle',
            description: 'Shuffle the current queue.',
        });
    }

    async execute(client: Client, interaction: ChatInputCommandInteraction) {
        const member = interaction.member;

        if (!member || !(member instanceof GuildMember) || !interaction.guildId) return interaction.reply({ ephemeral: true, content: 'This command can only be used in a server' });

        const channel = member.voice.channel;

        if (!channel) return interaction.reply({ ephemeral: true, content: 'You must be in a voice call to run this command' });

        const player = useMainPlayer();
        const queue = player.nodes.get(interaction.guildId);

        if (!queue || queue.getSize() === 0) return interaction.reply({ ephemeral: true, content: "There is no queue to shuffle." });

        await interaction.deferReply();

        queue.tracks.shuffle();

        const embed = EmbedGenerator.Info({
            title: 'Shuffled Queue',
            description: 'The current queue has been shuffled.',
        }).withAuthor(interaction.user);

        return interaction.editReply({ embeds: [embed] });
    }
}

export default ShuffleCommand;