import UserModel from "../models/User.Schema";
import { User } from "./User";

interface GuildInterface {
    balance: number;
    level: number;
    xp: number,
    daily: Date,
}

class Guild implements GuildInterface {
    user: User;
    guildId: string;

    balance: number;
    level: number;
    xp: number;
    daily: Date;

    constructor(user: User, guildId: string, guildData: GuildInterface) {
        this.user = user;
        this.guildId = guildId;

        this.balance = guildData.balance;
        this.level = guildData.level;
        this.xp = guildData.xp;
        this.daily = guildData.daily;
    }

    async setBalance(amount: number): Promise<Guild> {
        this.balance = amount;

        await UserModel.updateOne(
            { id: this.user.id, [`guilds.${this.guildId}`]: { $exists: true } },
            { $set: { [`guilds.${this.guildId}.balance`]: this.balance } }
        );

        return this;
    }

    async setDaily(): Promise<Guild> {
        this.daily = new Date();

        await UserModel.updateOne(
            { id: this.user.id, [`guilds.${this.guildId}`]: { $exists: true } },
            { $set: { [`guilds.${this.guildId}.daily`]: this.daily } }
        );

        return this;
    }

    async addBalance(amount: number): Promise<Guild> {
        this.balance += amount;

        await UserModel.updateOne(
            { id: this.user.id, [`guilds.${this.guildId}`]: { $exists: true } },
            { $inc: { [`guilds.${this.guildId}.balance`]: amount } }
        );

        return this;
    }
}

export { GuildInterface, Guild };