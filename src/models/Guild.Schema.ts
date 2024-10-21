import { Schema } from "mongoose";
import GuildInterface from "../types/Guild";

const guildSchema = new Schema<GuildInterface>({
    balance: {
        type: Number,
        default: 0,
    },
    level: {
        type: Number,
        default: 1,
    },
});

export default guildSchema;