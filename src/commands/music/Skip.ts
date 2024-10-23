import { GuildMember, type ChatInputCommandInteraction } from 'discord.js';

import { Command } from '../../types/Command';
import { Client } from '../../types/Client';
import { useQueue } from 'discord-player';
import { EmbedGenerator } from '../../utils/EmbedGenerator';

class SkipCommand extends Command {
    constructor() {
        super({
            name: 'skip',
            description: 'Skip to the next track',
        });
    }

    async execute(client: Client, interaction: ChatInputCommandInteraction) {
        if (!interaction.guildId) return await interaction.reply('This command can only be used in a server');

        const member = interaction.member;

        if (!member || !(member instanceof GuildMember)) return interaction.reply({ ephemeral: true, content: 'You must be in a server to continue' });

        const channel = member.voice.channel;

        if (!channel) return interaction.reply({ ephemeral: true, content: 'You must be in a voice call to run this command' });

        const queue = useQueue(interaction.guildId);

        if (!queue?.isPlaying()) {
            const embed = EmbedGenerator.Error({
                title: 'Not Playing',
                description: 'I am currently not playing any tracks'
            })
            
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        await interaction.deferReply();

        queue.node.skip();

        const embed = EmbedGenerator.Info({
            title: 'Track skipped!',
            description: 'I have successfully skipped to the next track'
        });

        return interaction.editReply({ embeds: [embed] });
    }
}

export default SkipCommand;