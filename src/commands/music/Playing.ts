import { GuildMember, type ChatInputCommandInteraction } from 'discord.js';

import { Command } from '../../types/Command';
import { Client } from '../../types/Client';
import { usePlayer, useTimeline } from 'discord-player';
import { EmbedGenerator } from '../../utils/EmbedGenerator';

class PlayingCommand extends Command {
    constructor() {
        super({
            name: 'playing',
            description: 'Skip to the previously played track',
        });
    }

    async execute(client: Client, interaction: ChatInputCommandInteraction) {
        if (!interaction.guildId) return await interaction.reply('This command can only be used in a server');

        const member = interaction.member;

        if (!member || !(member instanceof GuildMember)) return interaction.reply({ ephemeral: true, content: 'You must be in a server to continue' });

        const channel = member.voice.channel;

        if (!channel) return interaction.reply({ ephemeral: true, content: 'You must be in a voice call to run this command' });

        const node = usePlayer(interaction.guildId);
        const timeline = useTimeline(interaction.guildId);

        if (!timeline?.track || !node) {
            const embed = EmbedGenerator.Error({
                title: 'Not Playing',
                description: 'I am currently not playing any tracks'
            });

            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        await interaction.deferReply();

        const { track, timestamp } = timeline;

        const embed = EmbedGenerator.Info({
            title: 'Now Playing',
            description: `**[${track.title} - ${track.author}](${track.url})**`,
            fields: [{ 
                name: 'Progress', 
                value: node.createProgressBar() ?? 'No progress available'
            }],
            thumbnail: { url: track.thumbnail },
            footer: { 
                text: `Requested by ${track.requestedBy?.tag} • ${timestamp.progress}%`, 
                iconURL: track.requestedBy?.displayAvatarURL() 
            }
        });

        return interaction.editReply({ embeds: [embed] });
    }
}

export default PlayingCommand;