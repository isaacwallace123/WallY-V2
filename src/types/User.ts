import { Document } from "mongoose";
import { Guild, GuildInterface } from "./Guild";

import UserModel from "../models/User.Schema";

interface UserInterface {
    id: string;
    guilds: Map<string, GuildInterface>;
}

type UserDocument = Document & UserInterface;

class User implements UserInterface {
    id: string;
    guilds: Map<string, GuildInterface>;

    constructor(id: string) {
        this.id = id;
        this.guilds = new Map<string, GuildInterface>();
    }

    async getUserData(): Promise<UserDocument> {
        let userbase = await UserModel.findOne({ id: this.id });

        if (!userbase) {
            userbase = new UserModel({
                id: this.id,
                guilds: new Map<string, GuildInterface>(),
            });

            await userbase.save();
        }

        this.guilds = userbase.guilds;

        return userbase;
    }

    async getGuildData(guildId: string): Promise<Guild> {
        const userbase = await this.getUserData();
        const existingGuild = this.guilds.get(guildId);

        if (existingGuild) return new Guild(this, guildId, existingGuild);

        const newGuild: GuildInterface = {
            balance: 0,
            level: 1,
            xp: 0,
            daily: new Date(),
        };

        this.guilds.set(guildId, newGuild);

        await userbase.save();

        return new Guild(this, guildId, newGuild);
    }
}

/*class User implements UserInterface {
    id: string;
    guilds: Map<string, GuildInterface>;

    constructor(id: string) {
        this.id = id;
        this.guilds = new Map<string, GuildInterface>();
    }

    async getUserData(): Promise<UserDocument> {
        let userbase = await UserModel.findOne({ id: this.id });

        if (!userbase) {
            console.log("Creating new user data.");
            
            userbase = new UserModel({
                id: this.id,
                guilds: new Map<string, GuildInterface>(),
            });

            await userbase.save();
        }

        this.guilds = userbase.guilds;

        return userbase;
    }

    async getGuildData(guildId: string): Promise<{ guild: GuildInterface; user: User }> {
        const userbase = await this.getUserData();
        const existingGuild = this.guilds.get(guildId);

        if (existingGuild) return { guild: existingGuild, user: this};

        const newGuild: GuildInterface = {
            balance: 0,
            level: 1,
            xp: 0,
            daily: new Date(),
        };

        this.guilds.set(guildId, newGuild);

        await userbase.save();

        return { guild: newGuild, user: this };
    }

    async addBalance(guildId: string, amount: number): Promise<{ guild: GuildInterface; user: User, balance: number }> {
        const { guild } = await this.getGuildData(guildId);
    
        guild.balance += amount;

        await UserModel.updateOne(
            { id: this.id, [`guilds.${guildId}`]: { $exists: true } },
            { $inc: { [`guilds.${guildId}.balance`]: amount } }
        );

        return { guild, user: this, balance: guild.balance };
    }

    async setDaily(guildId: string): Promise<{ guild: GuildInterface; user: User, daily: Date }> {
        const { guild } = await this.getGuildData(guildId);

        guild.daily = new Date();

        await UserModel.updateOne(
            { id: this.id, [`guilds.${guildId}`]: { $exists: true } },
            { $set: { [`guilds.${guildId}.daily`]: guild.daily } }
        );
    
        return { guild, user: this, daily: guild.daily };
    }
}*/

export { UserInterface, User };