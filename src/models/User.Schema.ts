import { model, Schema } from "mongoose";
import { User } from "../types/User";

import guildSchema from "./Guild.Schema";

const userSchema = new Schema<User>({
    id: {
        type: String,
        required: true,
        unique: true,
    },

    guilds: {
        type: Map,
        of: guildSchema,
    }
});

const UserModel = model<User>('User', userSchema);

export default UserModel;