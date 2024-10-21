import type { Client } from 'discord.js';
import { HooksRegistry, Symbols } from './Registry.js';

function ClientHook() {
  const client = HooksRegistry.get(Symbols.Client) as Client | undefined;
  
  if (!client) throw new Error('Client has not been initialized');

  return client;
}

export { ClientHook }