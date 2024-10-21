import { ApplicationCommandOptionType, GuildMember, type ChatInputCommandInteraction } from 'discord.js';

import { Command } from '../../types/Command';
import { Client } from '../../types/Client';
import { useMainPlayer } from 'discord-player';
import { EmbedGenerator } from '../../utils/EmbedGenerator';

class PlayCommand extends Command {
    constructor() {
        super({
            name: 'play',
            description: 'Play a song from a URL or search query.',
            options: [
                {
                    name: 'query',
                    description: 'The URL or search query for the song.',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                }
            ]
        });
    }

    async execute(client: Client, interaction: ChatInputCommandInteraction) {
        let query = interaction.options.getString("query", true)

        const member = interaction.member;

        if (!member || !(member instanceof GuildMember)) return interaction.reply({ ephemeral: true, content: 'You must be in a server to continue.' });

        const channel = member.voice.channel;

        if (!channel) return interaction.reply({ ephemeral: true, content: 'You must be in a voice call to run this command.' });

        const player = useMainPlayer();

        await interaction.deferReply();

        const result = await player.search(query, {
            requestedBy: interaction.user,
        });

        if (!result.hasTracks()) {
            const embed = EmbedGenerator.Error({
                title: 'No results found',
                description: `No results found for \`${query}\``
            });
    
            return interaction.reply({ ephemeral: true, embeds: [embed] });
        }

        try {
            const { track, searchResult } = await player.play(channel, result, {
                nodeOptions: {
                    metadata: interaction,
                    noEmitInsert: true,
                    leaveOnStop: false,
                    leaveOnEmpty: true,
                    leaveOnEmptyCooldown: 180000,
                    leaveOnEnd: true,
                    leaveOnEndCooldown: 180000,
                    pauseOnEmpty: true,
                    preferBridgedMetadata: true,
                    disableBiquad: true,
                },
                requestedBy: interaction.user,
                connectionOptions: {
                    deaf: true,
                }
            });

            const isPlaylist = searchResult.hasPlaylist();
    
            const embed = EmbedGenerator.Info({
                title: `${isPlaylist ? 'Playlist' : 'Track'} queued!`,
                description: `${isPlaylist ? `${searchResult.playlist?.title}` : `**[${track.title} - ${track.author}](${track.url})**`}`,
                thumbnail: { url: track.thumbnail },
                footer: { text: `Duration: ${track.duration}` }
            }).withAuthor(interaction.user);
    
            return interaction.editReply({ embeds: [embed] });
        } catch(error) {
            const embed = EmbedGenerator.Error({
                title: 'Something went wrong',
                description: `Something went wrong while playing \`${query}\``
            }).withAuthor(interaction.user);
    
            return interaction.editReply({ embeds: [embed] });
        }
    }
}

export default PlayCommand;