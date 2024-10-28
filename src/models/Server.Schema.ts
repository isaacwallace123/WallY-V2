import { model, Schema } from "mongoose";
import { Server } from "../types/Server";

import UserModel from "./User.Schema";

const serverSchema = new Schema<Server>({
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
});

const ServerModel = model<Server>('Server', serverSchema);

export default ServerModel;