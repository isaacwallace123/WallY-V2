import { Document } from "mongoose";
import UserModel from "../models/User.Schema";

import { GuildInterface } from "./Guild";

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

    async getGuildData(guildId: string): Promise<GuildInterface> {
        const userbase = await this.getUserData();
        const existingGuild = this.guilds.get(guildId);

        if (existingGuild) return existingGuild;

        const newGuild: GuildInterface = {
            balance: 0,
            level: 1,
            xp: 0,
            daily: new Date(),
        };

        this.guilds.set(guildId, newGuild);

        await userbase.save();

        return newGuild;
    }
}

export { UserInterface, User };