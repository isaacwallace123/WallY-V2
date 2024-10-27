import { Schema } from "mongoose";
import { GuildInterface } from "../types/Guild";

const guildSchema = new Schema<GuildInterface>({
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
        default: 1,
    },
    daily: {
        type: Date,
        default: Date.now(),
    }
}, { _id: false });

export default guildSchema;