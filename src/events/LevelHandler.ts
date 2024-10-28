import { Events, Message } from "discord.js";

import { Signal } from "../types/Signal";
import { Client } from "../types/Client";
import { User } from "../types/User";

import { calculateLevelXP, getRandomXP } from "../utils/Constants";

class LevelHandler extends Signal {
    private cooldowns = new Set();

    constructor() {
        super({
            name: Events.MessageCreate,
            once: false,
        });
    }

    async execute(client: Client, message: Message) {
        if (!message.inGuild() || message.author.bot || message.author.system || this.cooldowns.has(message.author.id)) return;

        const user = await new User(message.author.id).getGuildData(message.guildId);

        const XPToGive = getRandomXP();

        const CurrentXP = user.xp + XPToGive;
        const XPNeeded = calculateLevelXP(user.level);

        if(CurrentXP > XPNeeded) {
            const RemainingXP = CurrentXP - XPNeeded;

            const { level } = await (await user.setXp(RemainingXP)).addLevel(1)

            message.channel.send(`${message.member} you have leveled up to **Level ${level}.**`);
        } else {
            await user.addXp(XPToGive);
        }

        this.cooldowns.add(message.author.id);

        setTimeout(() => {
            this.cooldowns.delete(message.author.id)
        }, 5000);
    }
}

export default LevelHandler;