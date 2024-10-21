import { ClientIntents } from "../utils/Constants";
import { Client } from "../types/Client";

import { HooksRegistry, Symbols } from "../hooks/Registry";

const DiscordClient: Client = new Client({
    intents: ClientIntents,
});

HooksRegistry.set(Symbols.Client, DiscordClient);

export default DiscordClient;