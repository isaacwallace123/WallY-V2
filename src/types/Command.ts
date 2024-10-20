import { CommandData } from 'commandkit';
import { ChatInputCommandInteraction, Client } from 'discord.js';

abstract class Command {
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