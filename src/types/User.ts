import { Document } from "mongoose";
import UserModel from "../models/User.Schema";

import Guild from "./Guild";
import GuildInterface from "./Guild";

interface UserInterface {
    id: string;
    guilds: Map<string, Guild>;
}

class User extends Document implements UserInterface {
    id: string;
    guilds: Map<string, Guild>;

    constructor(id: string) {
        super();
        this.id = id;
        this.guilds = new Map<string, Guild>();
    }

    async getUserData(): Promise<UserInterface & Document> {
        let userbase = await UserModel.findOne({ id: this.id });

        if (!userbase) {
            console.log("Creating new user data.");
            
            userbase = new UserModel({
                id: this.id,
                guilds: new Map<string, Guild>(),
            });

            await userbase.save();
        }

        this.guilds = userbase.guilds;

        return userbase;
    }

    async getGuildData(guildId: string): Promise<Guild> {
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