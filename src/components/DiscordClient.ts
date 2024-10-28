import { Client } from "../types/Client";

import { ClientIntents } from "../utils/Constants";

import { HooksRegistry, Symbols } from "../hooks/Registry";

const DiscordClient: Client = new Client({
    intents: ClientIntents,
});

HooksRegistry.set(Symbols.Client, DiscordClient);

export default DiscordClient;