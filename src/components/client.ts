import { ClientIntents } from "../utils/Constants";

import Client from "../types/Client";

const client = new Client({
    intents: ClientIntents,
});

export default client;