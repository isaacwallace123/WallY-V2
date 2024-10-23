import { GuildMember, type ChatInputCommandInteraction } from 'discord.js';

import { Command } from '../../types/Command';
import { Client } from '../../types/Client';
import { useQueue } from 'discord-player';
import { EmbedGenerator } from '../../utils/EmbedGenerator';

class StopCommand extends Command {
    constructor() {
        super({
            name: 'stop',
            description: 'Stop the music player.',
        });
    }

    async execute(client: Client, interaction: ChatInputCommandInteraction) {
        if (!interaction.guildId) return await interaction.reply('This command can only be used in a server');

        const member = interaction.member;

        if (!member || !(member instanceof GuildMember)) return interaction.reply({ ephemeral: true, content: 'You must be in a server to continue' });

        const channel = member.voice.channel;

        if (!channel) return interaction.reply({ ephemeral: true, content: 'You must be in a voice call to run this command' });

        const queue = useQueue(interaction.guildId);

        if (!queue) {
            const embed = EmbedGenerator.Error({
                title: 'Not Playing',
                description: 'I am currently not playing any tracks'
            })

            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        await interaction.deferReply();

        queue.node.stop();

        const embed = EmbedGenerator.Info({
            title: 'Track stopped!',
            description: 'I have successfully stopped the track'
        });

        return interaction.editReply({ embeds: [embed] });
    }
}

export default StopCommand;