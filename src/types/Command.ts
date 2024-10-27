import { CommandData } from 'commandkit';
import { ChatInputCommandInteraction, Client } from 'discord.js';

interface ExtraCommandData {
    cooldown?: number;
}

type CommandType = CommandData & ExtraCommandData;

interface CommandInterface {
    data: CommandType;
}

abstract class Command implements CommandInterface {
    public data: CommandType;

    constructor(data: CommandType) {
        this.data = data;
    }

    abstract execute(client: Client, interaction: ChatInputCommandInteraction): Promise<any> | any;

    GetData() {
        return this.data;
    }
}

export { CommandInterface, CommandType, Command };