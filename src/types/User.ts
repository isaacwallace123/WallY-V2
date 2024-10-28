import { Document } from "mongoose";
import { Guild, GuildInterface } from "./Guild";

import UserModel from "../models/User.Schema";
import { Server } from "./Server";

interface UserInterface {
    id: string;
    bank: number;
    guilds: Map<string, GuildInterface>;
}

type UserDocument = Document & UserInterface;

class User implements UserInterface {
    id: string;
    bank: number = 0;

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
            balance: 1000,
            crypto: 0,
            level: 1,
            xp: 0,
            daily: new Date(Date.now() - (24 * 60 * 60 * 1000)),
        };

        this.guilds.set(guildId, newGuild);

        await userbase.save();

        return new Guild(this, guildId, newGuild);
    }

    async setBank(amount: number): Promise<User> {
        this.bank = amount;

        await UserModel.updateOne({ id: this.id },{ $set: { bank: this.bank } });

        return this;
    }

    async addBank(amount: number): Promise<User> {
        this.bank += amount;

        await UserModel.updateOne({ id: this.id },{ $inc: { bank: amount } });

        return this;
    }

    async removeBank(amount: number): Promise<User> {
        return await this.addBank(-amount);
    }
};

export { UserInterface, User, UserDocument };