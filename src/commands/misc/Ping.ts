import type { ChatInputCommandInteraction } from 'discord.js';

import { Command } from '../../types/Command';
import { Client } from '../../types/Client';

class PingCommand extends Command {
    constructor() {
        super({
            name: 'ping',
            description: 'pong!',
        });
    }

    async execute(client: Client, interaction: ChatInputCommandInteraction) {
        const clientLatency = client.ws.ping.toFixed(0);

        await interaction.reply(`:ping_pong: Pong! ${clientLatency}ms`);
    }
}

export default PingCommand;