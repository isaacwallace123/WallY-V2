import { CommandData } from 'commandkit';
import { ChatInputCommandInteraction, Client } from 'discord.js';

interface CommandInterface {
    data: CommandData;
}

abstract class Command implements CommandInterface {
    public data: CommandData;

    constructor(data: CommandData) {
        this.data = data
    }

    abstract execute(client: Client, interaction: ChatInputCommandInteraction): Promise<void> | void;

    GetData() {
        return this.data;
    }
}

export default Command;