import { GuildMember, type ChatInputCommandInteraction } from 'discord.js';

import { Command } from '../../types/Command';
import { Client } from '../../types/Client';
import { useQueue, useTimeline } from 'discord-player';
import { EmbedGenerator } from '../../utils/EmbedGenerator';

class QueueCommand extends Command {
    constructor() {
        super({
            name: 'queue',
            description: 'Displays the current queue of songs.',
        });
    }

    async execute(client: Client, interaction: ChatInputCommandInteraction) {
        if (!interaction.guildId) return await interaction.reply('This command can only be used in a server');

        const member = interaction.member;

        if (!member || !(member instanceof GuildMember)) return interaction.reply({ ephemeral: true, content: 'You must be in a server to continue' });

        const channel = member.voice.channel;

        if (!channel) return interaction.reply({ ephemeral: true, content: 'You must be in a voice call to run this command' });

        const queue = useQueue(interaction.guildId);

        if (!queue?.isPlaying() || !queue?.currentTrack) {
            const embed = EmbedGenerator.Error({
                title: 'Not Playing',
                description: 'I am currently not playing any tracks'
            });
            
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        await interaction.deferReply();

        let FinalDescription = `**Now: [${queue.currentTrack.title} - ${queue.currentTrack.author}](${queue.currentTrack.url}) - ${queue.currentTrack.duration}**\n\n`

        const trackString = queue.tracks.toArray().slice(0,10).map((track, placement) => {
            return `${placement + 1}) [${track.title} - ${track.author}](${track.url}) - ${track.duration}\n`
        }).join('\n');

        FinalDescription += trackString;

        const embed = EmbedGenerator.Info({
            title: 'Current Queue',
            description: FinalDescription,
            thumbnail: { url: queue.currentTrack.thumbnail }
        });

        return interaction.editReply({ embeds: [embed] });
    }
}

export default QueueCommand;