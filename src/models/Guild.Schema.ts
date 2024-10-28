import { Schema } from "mongoose";

import { GuildInterface } from "../types/Guild";

const GuildObject = {
    balance: {
        type: Number,
        default: 1000,
    },
    crypto: {
        type: Number,
        default: 0
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
        default: Date.now(),
    }
}

const GuildSchema = new Schema<GuildInterface>(GuildObject, { _id: false });

export { GuildObject, GuildSchema };