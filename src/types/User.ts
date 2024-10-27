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
            balance: 1000,
            level: 1,
            xp: 0,
            daily: new Date(Date.now() - (24 * 60 * 60 * 1000)),
        };

        this.guilds.set(guildId, newGuild);

        await userbase.save();

        return new Guild(this, guildId, newGuild);
    }
};

export { UserInterface, User };