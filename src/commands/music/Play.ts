import { ApplicationCommandOptionType, GuildMember, type ChatInputCommandInteraction } from 'discord.js';
import { useMainPlayer } from 'discord-player';

import { Command } from '../../types/Command';
import { Client } from '../../types/Client';

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
        const member = interaction.member;

        if (!member || !(member instanceof GuildMember) || !interaction.guildId) return interaction.reply({ ephemeral: true, content: 'This command can only be used in a server' });

        const channel = member.voice.channel;

        if (!channel) return interaction.reply({ ephemeral: true, content: 'You must be in a voice call to run this command' });
        
        let query = interaction.options.getString("query", true);

        const player = useMainPlayer();

        await interaction.deferReply();

        const result = await player.search(query, {
            requestedBy: interaction.user,
        });

        if (!result.hasTracks()) {
            const embed = EmbedGenerator.Error({
                title: 'No Results Found',
                description: `No results found for \`${query}\``
            });
    
            return interaction.editReply({ embeds: [embed] });
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