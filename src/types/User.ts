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

interface CryptoInterface {
    balance: number;
    shells: number;
    last: Date;
}

interface UserInterface {
    id: string;
    bank: BankInterface;
    crypto: CryptoInterface;
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

    crypto: CryptoInterface = {
        balance: UserObject.crypto.balance.default,
        shells: UserObject.crypto.shells.default,
        last: UserObject.crypto.last.default,
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
                crypto: this.crypto,
                guilds: new Map<string, GuildInterface>(),
            });

            await userbase.save();
        } else {
            userbase.bank ??= this.bank;
            userbase.crypto ??= this.crypto;
            userbase.guilds ??= new Map<string, GuildInterface>();
        }

        this.bank = userbase.bank;
        this.crypto = userbase.crypto;
        this.guilds = userbase.guilds;

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
                level: GuildObject.level.default,
                xp: GuildObject.xp.default,
                daily: GuildObject.daily.default,
            };
    
            this.guilds.set(guildId, guildData);
    
            await userbase.save();
        } else {
            guildData.balance ??= GuildObject.balance.default;
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

    async setMineCooldown(): Promise<User> {
        this.crypto.last = new Date();

        await UserModel.updateOne({ id: this.id },{ $set: { "crypto.last": this.crypto.last } });

        return this;
    }

    async addShell(): Promise<User> {
        this.crypto.shells++;

        await UserModel.updateOne({ id: this.id }, { $inc: { "crypto.shells": 1 } });

        return this;
    }

    async setCrypto(amount: number): Promise<User> {
        this.crypto.balance = amount;

        await UserModel.updateOne({ id: this.id },{ $set: { "crypto.balance": amount } });

        return this;
    }

    async addCrypto(amount: number): Promise<User> {
        this.crypto.balance += amount;

        await UserModel.updateOne({ id: this.id },{ $inc: { "crypto.balance": amount } });

        return this;
    }

    async removeCrypto(amount: number): Promise<User> {
        return await this.addCrypto(-amount);
    }
};

export { UserInterface, User, UserDocument };