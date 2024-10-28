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

    async setDaily(): Promise<Guild> {
        this.daily = new Date();

        await UserModel.updateOne(
            { id: this.user.id, [`guilds.${this.guildId}`]: { $exists: true } },
            { $set: { [`guilds.${this.guildId}.daily`]: this.daily } }
        );

        return this;
    }

    async setBalance(amount: number): Promise<Guild> {
        this.balance = amount;

        await UserModel.updateOne(
            { id: this.user.id, [`guilds.${this.guildId}`]: { $exists: true } },
            { $set: { [`guilds.${this.guildId}.balance`]: this.balance } }
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

    async removeBalance(amount: number): Promise<Guild> {
        if(this.balance < amount) throw new Error('Insufficient balance');

        return await this.addBalance(-amount);
    }

    async setLevel(level: number): Promise<Guild> {
        this.level = level;

        await UserModel.updateOne(
            { id: this.user.id, [`guilds.${this.guildId}`]: { $exists: true } },
            { $set: { [`guilds.${this.guildId}.level`]: this.level } }
        );

        return this;
    }

    async addLevel(level: number): Promise<Guild> {
        this.level += level;

        await UserModel.updateOne(
            { id: this.user.id, [`guilds.${this.guildId}`]: { $exists: true } },
            { $inc: { [`guilds.${this.guildId}.level`]: level } }
        );

        return this;
    }

    async removeLevel(level: number): Promise<Guild> {
        return await this.addLevel(-level);
    }

    async setXp(xp: number): Promise<Guild> {
        this.xp = xp;

        await UserModel.updateOne(
            { id: this.user.id, [`guilds.${this.guildId}`]: { $exists: true } },
            { $set: { [`guilds.${this.guildId}.xp`]: this.xp } }
        );

        return this;
    }

    async addXp(xp: number): Promise<Guild> {
        this.xp += xp;

        await UserModel.updateOne(
            { id: this.user.id, [`guilds.${this.guildId}`]: { $exists: true } },
            { $inc: { [`guilds.${this.guildId}.xp`]: xp } }
        );

        return this;
    }

    async removeXp(xp: number): Promise<Guild> {
        return await this.addLevel(-xp);
    }
}

export { GuildInterface, Guild };