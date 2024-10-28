import { Document } from "mongoose";

import { UserModel, UserObject } from "../models/User.Schema";
import { GuildObject } from "../models/Guild.Schema";

import { Server } from "./Server";
import { Guild, GuildInterface } from "./Guild";

interface BankInterface {
    balance: number;
    level: number;
}

interface UserInterface {
    id: string;
    bank: BankInterface;
    guilds: Map<string, GuildInterface>;
}

type UserDocument = Document & UserInterface;

class User implements UserInterface {
    id: string;

    bank: BankInterface = {
        balance: UserObject.bank.balance.default,
        level: UserObject.bank.level.default,
    };

    guilds: Map<string, GuildInterface> = new Map<string, GuildInterface>();

    constructor(id: string) {
        this.id = id;
    }

    async getUserData(): Promise<UserDocument> {
        let userbase = await UserModel.findOne({ id: this.id });

        if (!userbase) {
            userbase = new UserModel({
                id: this.id,
                bank: this.bank,
                guilds: new Map<string, GuildInterface>(),
            });

            await userbase.save();
        }

        this.guilds = userbase.guilds;
        this.bank = userbase.bank;

        return userbase;
    }

    async getGuildData(guildId: string): Promise<Guild> {
        const userbase = await this.getUserData();
        const existingGuild = this.guilds.get(guildId);

        await new Server(guildId).addUser(this);

        if (existingGuild) return new Guild(this, guildId, existingGuild);

        const newGuild: GuildInterface = {
            balance: GuildObject.balance.default,
            crypto: GuildObject.crypto.default,
            level: GuildObject.level.default,
            xp: GuildObject.xp.default,

            daily: new Date(Date.now() - (24 * 60 * 60 * 1000)),
        };

        this.guilds.set(guildId, newGuild);

        await userbase.save();

        return new Guild(this, guildId, newGuild);
    }

    async upgradeBank(): Promise<User> {
        this.bank.level++;

        await UserModel.updateOne({ id: this.id }, { $set: { "bank.level": 1 } });

        return this;
    }

    async setBank(amount: number): Promise<User> {
        this.bank.balance = amount;

        await UserModel.updateOne({ id: this.id },{ $set: { "bank.balance": amount } });

        return this;
    }

    async addBank(amount: number): Promise<User> {
        this.bank.balance += amount;

        await UserModel.updateOne({ id: this.id },{ $inc: { "bank.balance": amount } });

        return this;
    }

    async removeBank(amount: number): Promise<User> {
        return await this.addBank(-amount);
    }
};

export { UserInterface, User, UserDocument };