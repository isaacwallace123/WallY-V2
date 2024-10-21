import { Document } from "mongoose";
import ServerModel from "../models/Server.Schema";

interface ServerInterface {
    id: string;
    bank: number;
}

type ServerDocument = Document & ServerInterface;

class Server extends Document implements ServerInterface {
    id: string;
    bank: number;

    constructor(id: string) {
        super();

        this.id = id;
        this.bank = 0;
    }

    async getServerData(): Promise<ServerDocument> {
        let serverData = await ServerModel.findOne({ id: this.id });

        if (!serverData) {
            console.log("Creating new server data.");
            
            serverData = new ServerModel({
                id: this.id,
                bank: 0,
            });

            await serverData.save();
        }

        this.bank = serverData.bank;

        return serverData;
    }

    async addBank(amount: number): Promise<void> {
        const serverData = await this.getServerData();

        this.bank += amount;
        serverData.bank = this.bank;

        await serverData.save();
    }
}

export { Server };