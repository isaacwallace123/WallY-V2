import { ActivityType, Events } from "discord.js";

import { Signal } from "../types/Signal";
import { Client } from "../types/Client";

class InitializeApplicationCommands extends Signal {
    constructor() {
        super({
            name: Events.ClientReady,
            once: true,
        });
    }

    async execute(client: Client) {
        client.user?.setActivity({
            name: 'people gamble',
            type: ActivityType.Watching,
        });
    }
}

export default InitializeApplicationCommands;