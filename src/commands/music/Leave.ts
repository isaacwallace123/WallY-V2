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

        if (!channel) return interaction.reply({ ephemeral: true, content: 'You must be in a voice call to run this command' });

        const queue = useQueue(interaction.guildId);
        
        await interaction.deferReply();

        const embed = EmbedGenerator.Error({
            title: 'Disconnected!',
            description: 'Goodbye and have fun!'
        });

        if (!queue) return interaction.reply({ embeds: [embed], ephemeral: true });

        queue.delete();

        return interaction.editReply({ embeds: [embed] });
    }
}

export default LeaveCommand;