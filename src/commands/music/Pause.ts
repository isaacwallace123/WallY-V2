import { GuildMember, type ChatInputCommandInteraction } from 'discord.js';
import { useTimeline } from 'discord-player';

import { Command } from '../../types/Command';
import { Client } from '../../types/Client';

import { EmbedGenerator } from '../../utils/EmbedGenerator';

class PauseCommand extends Command {
    constructor() {
        super({
            name: 'pause',
            description: 'Pause and unpause the current track.',
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

        await interaction.deferReply();

        const WasPaused = timeline.paused;

        if (WasPaused)
            timeline.resume();
        else
            timeline.pause();

        const embed = EmbedGenerator.Info({
            title: `${WasPaused ? "Resumed" : "Paused"}`,
            description: `I have successfully ${WasPaused ? "resumed" : "paused"} the track`
        });

        return interaction.editReply({ embeds: [embed] });
    }
}

export default PauseCommand;