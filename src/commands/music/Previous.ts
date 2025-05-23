import { GuildMember, type ChatInputCommandInteraction } from 'discord.js';
import { useHistory } from 'discord-player';

import { Command } from '../../types/Command';
import { Client } from '../../types/Client';

import { EmbedGenerator } from '../../utils/EmbedGenerator';

class PreviousCommand extends Command {
    constructor() {
        super({
            name: 'previous',
            description: 'Skip to the previously played track',
        });
    }

    async execute(client: Client, interaction: ChatInputCommandInteraction) {
        const member = interaction.member;

        if (!member || !(member instanceof GuildMember) || !interaction.guildId) return interaction.reply({ ephemeral: true, content: 'This command can only be used in a server' });

        const channel = member.voice.channel;

        if (!channel) return interaction.reply({ ephemeral: true, content: 'You must be in a voice call to run this command' });

        const history = useHistory(interaction.guildId);

        if (!history || history.isEmpty()) {
            const embed = EmbedGenerator.Error({
                title: 'No Previous',
                description: 'There are no previously played tracks'
            })
            
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        await interaction.deferReply();

        await history.back();

        const embed = EmbedGenerator.Info({
            title: 'Track skipped!',
            description: 'I have successfully skipped to the previous track'
        });

        return interaction.editReply({ embeds: [embed] });
    }
}

export default PreviousCommand;