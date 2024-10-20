import { Client as DiscordClient, Collection } from 'discord.js';

import Command from './Command';
import Signal from './Signal';

class Client extends DiscordClient {
    public commands: Collection<string, Command>;
    public signals: Signal[];

    constructor(options: any) {
        super(options);
        this.commands = new Collection();
        this.signals = [];
    }

    AddCommand(command: Command) {
        this.commands.set(command.data.name, command);
    }

    AddSignal(signal: Signal) {
        this.signals.push(signal);
    }

    GetRawCommands():Object {
        return Array.from(this.commands.values()).map(command => command.data);
    }

    GetRawSignals():Object {
        return this.signals.map(signal => signal.data);
    }
}

export default Client;