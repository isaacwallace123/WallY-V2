import { Schema } from "mongoose";

import { GuildInterface } from "../types/Guild";

const GuildObject = {
    balance: {
        type: Number,
        default: 1000,
    },
    level: {
        type: Number,
        default: 1,
    },
    xp: {
        type: Number,
        default: 0,
    },
    daily: {
        type: Date,
        default: new Date(Date.now() - (24 * 60 * 60 * 1000)),
    }
}

const GuildSchema = new Schema<GuildInterface>(GuildObject, { _id: false, versionKey: false });

export { GuildObject, GuildSchema };