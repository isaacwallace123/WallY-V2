import { Events, ChatInputCommandInteraction } from 'discord.js';

import { GuildQueueEvent, Player } from 'discord-player';
import { YoutubeiExtractor } from 'discord-player-youtubei';
import { SoundCloudExtractor, SpotifyExtractor } from '@discord-player/extractor';

import { Signal } from '../types/Signal';
import { Client } from '../types/Client';

import { EmbedGenerator } from '../utils/EmbedGenerator';

class PlayerInitialization extends Signal {
    constructor() {
        super({
            name: Events.ClientReady,
            once: true,
        });
    }

    async execute(client: Client, interaction: ChatInputCommandInteraction) {
        const player = new Player(client, {
            ytdlOptions: {
                quality: "highestaudio",
                highWaterMark: 1 << 25
            }
        })

        await player.extractors.register(YoutubeiExtractor, {});
        await player.extractors.register(SpotifyExtractor, {});
        await player.extractors.register(SoundCloudExtractor, {});

        player.events.on(GuildQueueEvent.playerStart, (queue, track) => {
            if (!track?.requestedBy) return;

            const embed = EmbedGenerator.Info({
                title: "Playing Track",
                description: `**[${track.title} - ${track.author}](${track.url})**`,
                thumbnail: { url: track.thumbnail },
                footer: { text: `Duration: ${track.duration}` }
            }).withAuthor(track.requestedBy);

            return queue.metadata.channel.send({ embeds: [embed] });
        });

        player.events.on(GuildQueueEvent.playerError, (queue, error) => {
            console.error(error);

            const track = queue.currentTrack;

            const embed = EmbedGenerator.Error({
                title: "Error playing that track",
                description: `The following track had an error while transcoding.\n**[${track?.title} - ${track?.author}](${track?.url})**`,
            }).withAuthor(queue.metadata.user);

            return queue.metadata.channel.send({ embeds: [embed] });
        });

        //player.events.on('debug', (queue, message) => console.log(`[DEBUG ${queue.guild.id}] ${message}`));
    }
}

export default PlayerInitialization;
