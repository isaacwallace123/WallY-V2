import client from './components/DiscordClient';

import GetFiles from './utils/GetFiles';
import path from 'path';
import dotenv from 'dotenv';

import { Command } from './types/Command';
import { Signal } from './types/Signal';

import { ConnectDatabase, CloseDatabase } from './database/Connection';

dotenv.config();

const main = async () => {
    await ConnectDatabase();

    for (const file of GetFiles(path.join(__dirname, 'commands'))) {
        const CommandClass = await import(file).then(mod => mod.default);
    
        const CommandInstance: Command = new CommandClass();
    
        client.AddCommand(CommandInstance);
    }

    for (const file of GetFiles(path.join(__dirname, 'events'))) {
        const SignalClass = await import(file).then(mod => mod.default);
        const signal: Signal = new SignalClass();
    
        if (signal.data.once) {
            client.once(signal.data.name, (...args: any[]) => signal.execute(client, ...args));
        } else {
            client.on(signal.data.name, (...args: any[]) => signal.execute(client, ...args));
        }
    
        client.AddSignal(signal);
    }

    client.login(process.env.DISCORD_TOKEN);
};

main().catch(err => console.error(err));

process.on('SIGINT', async () => {
    try {
        await client.destroy();
        await CloseDatabase();
    } catch(error) {
        console.error('Error during shutdown:', error);
    } finally {
        process.exit(0);
    }
});

process.on('SIGTERM', async () => {
    try {
        await client.destroy();
        await CloseDatabase();
    } catch(error) {
        console.error('Error during shutdown:', error);
    } finally {
        process.exit(0);
    }
});