import { model, Schema } from "mongoose";

import { Server } from "../types/Server";

import { UserModel } from "./User.Schema";

const ServerObject = {
    id: {
        type: String,
        required: true,
        unique: true,
    },
    bank: {
        type: Number,
        default: 0,
    },
    leaderboards: {
        balances: {
            type: [String],
            ref: UserModel.modelName,
            default: [],
        },
        levels: {
            type: [String],
            ref: UserModel.modelName,
            default: [],
        },
    },
}

const ServerSchema = new Schema<Server>(ServerObject, { versionKey: 'versionkey' });

const ServerModel = model<Server>('Server', ServerSchema);

export { ServerObject, ServerModel };