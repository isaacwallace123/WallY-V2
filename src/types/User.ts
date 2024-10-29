import { Document } from "mongoose";

import { UserModel, UserObject } from "../models/User.Schema";
import { GuildObject } from "../models/Guild.Schema";

import { Server } from "./Server";
import { Guild, GuildInterface } from "./Guild";

interface BankInterface {
    balance: number;
    level: number;
    last: Date;
}

interface UserInterface {
    id: string;
    bank: BankInterface;
    guilds: Map<string, GuildInterface>;
}

type UserDocument = Document & User;

class User implements UserInterface {
    id: string;

    bank: BankInterface = {
        balance: UserObject.bank.balance.default,
        level: UserObject.bank.level.default,
        last: UserObject.bank.last.default,
    };

    guilds: Map<string, GuildInterface> = new Map<string, GuildInterface>();

    constructor(id: string) {
        this.id = id;
    }

    private async getUserbase(): Promise<UserDocument> {
        let userbase = await UserModel.findOne({ id: this.id });

        if (!userbase) {
            userbase = new UserModel({
                id: this.id,
                bank: this.bank,
                guilds: new Map<string, GuildInterface>(),
            });

            await userbase.save();
        } else {
            userbase.bank ??= this.bank;
            userbase.guilds ??= new Map<string, GuildInterface>();
        }

        this.guilds = userbase.guilds;
        this.bank = userbase.bank;

        return userbase;
    }

    async getUserData(): Promise<User> {
        await this.getUserbase();

        return this;
    }

    async getGuildData(guildId: string): Promise<Guild> {
        const userbase = await this.getUserbase();

        await new Server(guildId).addUser(this);

        let guildData = this.guilds.get(guildId);

        if (!guildData) {
            guildData = {
                balance: GuildObject.balance.default,
                crypto: GuildObject.crypto.default,
                level: GuildObject.level.default,
                xp: GuildObject.xp.default,
                daily: GuildObject.daily.default,
            };
    
            this.guilds.set(guildId, guildData);
    
            await userbase.save();
        } else {
            guildData.balance ??= GuildObject.balance.default;
            guildData.crypto ??= GuildObject.crypto.default;
            guildData.level ??= GuildObject.level.default;
            guildData.xp ??= GuildObject.xp.default;
            guildData.daily ??= GuildObject.daily.default;
        }

        return new Guild(this, guildId, guildData);
    }

    async setBankCooldown(): Promise<User> {
        this.bank.last = new Date();

        await UserModel.updateOne({ id: this.id },{ $set: { "bank.last": this.bank.last } });

        return this;
    }

    async upgradeBank(): Promise<User> {
        this.bank.level++;

        await UserModel.updateOne({ id: this.id }, { $inc: { "bank.level": 1 } });

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