import { model, Schema } from "mongoose";

import { User } from "../types/User";

import { GuildSchema } from "./Guild.Schema";

const UserObject = {
    id: {
        type: String,
        required: true,
        unique: true,
    },

    bank: {
        balance: {
            type: Number,
            default: 0
        },
        level: {
            type: Number,
            default: 1
        },
        last: {
            type: Date,
            default: new Date(Date.now() - (24 * 60 * 60 * 1000))
        },
    },

    guilds: {
        type: Map,
        of: GuildSchema,
        default: {},
    }
}

const UserSchema = new Schema<User>(UserObject, { versionKey: 'versionkey' });

const UserModel = model<User>('User', UserSchema);

export { UserObject, UserModel };