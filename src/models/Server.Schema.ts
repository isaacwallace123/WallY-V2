import { model, Schema } from "mongoose";
import { Server } from "../types/Server";

const serverSchema = new Schema<Server>({
    id: {
        type: String,
        required: true,
        unique: true,
    },

    bank: {
        type: Number,
        default: 0,
    }
});

const ServerModel = model<Server>('Server', serverSchema);

export default ServerModel;