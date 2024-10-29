import { Client as DiscordClient, Collection } from 'discord.js';

import { Command } from './Command';
import { Signal } from './Signal';

interface CommandTypes {
    guild: string[];
    global: string[];

    list: Collection<string, Command>;
}

class Client extends DiscordClient {
    public commands: CommandTypes = {
        guild: [],
        global: [],

        list: new Collection<string, Command>(),
    };

    public signals: Signal[] = [];

    constructor(options: any) {
        super(options);
    }

    AddCommand(command: Command) {
        this.commands.list.set(command.data.name, command);
    }

    AddGlobalCommand(command: Command) {
        this.commands.global.push(command.data.name);
    }

    AddGuildCommand(command: Command) {
        this.commands.guild.push(command.data.name);
    }

    AddSignal(signal: Signal) {
        this.signals.push(signal);
    }

    GetRawGlobalCommands(): Object {
        return Array.from(this.commands.list.values())
            .filter(command => this.commands.global.includes(command.data.name))
            .map(command => command.data);
    }

    GetRawGuildCommands(): Object {
        return Array.from(this.commands.list.values())
            .filter(command => this.commands.guild.includes(command.data.name))
            .map(command => command.data);
    }

    GetRawCommands():Object {
        return Array.from(this.commands.list.values()).map(command => command.data);
    }

    GetRawSignals():Object {
        return this.signals.map(signal => signal.data);
    }
}

export { Client };