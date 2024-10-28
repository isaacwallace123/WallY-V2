import { model, Schema } from "mongoose";
import { User } from "../types/User";

import guildSchema from "./Guild.Schema";

const userSchema = new Schema<User>({
    id: {
        type: String,
        required: true,
        unique: true,
    },

    bank: {
        type: Number,
        default: 0
    },

    guilds: {
        type: Map,
        of: guildSchema,
        default: {},
    }
});

const UserModel = model<User>('User', userSchema);

export default UserModel;