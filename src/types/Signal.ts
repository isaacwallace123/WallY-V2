import { Client, ClientEvents } from 'discord.js';

interface SignalData {
    name: keyof ClientEvents;
    once?: boolean;
}

abstract class Signal {
    public data: SignalData;

    constructor(data: SignalData) {
        this.data = data;
    }

    abstract execute(client: Client, ...args: any[]): Promise<void> | void;

    GetData() {
        return this.data;
    }
}

export { SignalData, Signal };