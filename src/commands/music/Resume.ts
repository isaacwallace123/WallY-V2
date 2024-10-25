import { GuildMember, type ChatInputCommandInteraction } from 'discord.js';

import { Command } from '../../types/Command';
import { Client } from '../../types/Client';
import { useTimeline } from 'discord-player';
import { EmbedGenerator } from '../../utils/EmbedGenerator';

class ResumeCommand extends Command {
    constructor() {
        super({
            name: 'resume',
            description: 'Resume the current song',
        });
    }

    async execute(client: Client, interaction: ChatInputCommandInteraction) {
        const member = interaction.member;

        if (!member || !(member instanceof GuildMember) || !interaction.guildId) return interaction.reply({ ephemeral: true, content: 'This command can only be used in a server' });

        const channel = member.voice.channel;

        if (!channel) return interaction.reply({ ephemeral: true, content: 'You must be in a voice call to run this command' });

        const timeline = useTimeline(interaction.guildId);

        if (!timeline?.track) {
            const embed = EmbedGenerator.Error({
                title: 'Not Playing',
                description: 'I am currently not playing any tracks'
            });

            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        if (!timeline.paused) {
            const embed = EmbedGenerator.Error({
                title: 'Error',
                description: 'The track is not paused'
            });

            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        await interaction.deferReply();

        timeline.resume();

        const embed = EmbedGenerator.Info({
            title: 'Resumed',
            description: 'I have successfully resumed the track'
        });

        return interaction.editReply({ embeds: [embed] });
    }
}

export default ResumeCommand;