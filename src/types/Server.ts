import { Document } from "mongoose";

import { User, UserDocument } from "./User";

import ServerModel from "../models/Server.Schema";

interface Leaderboards {
    balances: string[];
    levels: string[];
}

interface ServerInterface {
    id: string;
    bank: number;
    leaderboards: Leaderboards;
}

type ServerDocument = Document & ServerInterface;

class Server implements ServerInterface {
    id: string;

    bank: number = 0;

    leaderboards:Leaderboards = {
        balances: [],
        levels: [],
    }

    constructor(id: string) {
        this.id = id;
    }

    async getServerData(): Promise<ServerDocument> {
        let serverData = await ServerModel.findOne({ id: this.id });

        if (!serverData) {
            serverData = new ServerModel({
                id: this.id,
                bank: this.bank,
                leaderboards: this.leaderboards
            });

            await serverData.save();
        }

        this.bank = serverData.bank;
        this.leaderboards = serverData.leaderboards;

        return serverData;
    }

    async addBank(amount: number): Promise<Server> {
        const serverData = await this.getServerData();

        this.bank += amount;
        serverData.bank = this.bank;

        await serverData.save();

        return this;
    }

    async addUser(user: User): Promise<Server> {
        const serverData:ServerDocument = await this.getServerData();

        if (!this.leaderboards.balances.includes(user.id)) this.leaderboards.balances.push(user.id);
        if (!this.leaderboards.levels.includes(user.id)) this.leaderboards.levels.push(user.id);

        serverData.leaderboards = this.leaderboards;

        await serverData.save();

        return this;
    }

    async sortLeaderboards(): Promise<Server> {
        await this.sortBalances();
        await this.sortLevels();

        return this;
    }

    async sortBalances(): Promise<Server> {
        const serverData = await this.getServerData();

        const userBalances = await Promise.all(
            this.leaderboards.balances.map(async (userId) => {
                const { balance } = await new User(userId).getGuildData(this.id);
                return { id: userId, balance: balance };
            })
        );

        const sortedBalances = userBalances.sort((a, b) => b.balance - a.balance).map(({ id }) => id);

        this.leaderboards.balances = sortedBalances;
        serverData.leaderboards = this.leaderboards;

        await serverData.save();

        return this;
    }

    async sortLevels(): Promise<Server> {
        const serverData = await this.getServerData();

        const userLevels = await Promise.all(
            this.leaderboards.levels.map(async (userId) => {
                const { level } = await new User(userId).getGuildData(this.id);
                return { id: userId, level: level };
            })
        );

        const sortedLevels = userLevels.sort((a, b) => b.level - a.level).map(({ id }) => id);

        this.leaderboards.levels = sortedLevels;
        serverData.leaderboards = this.leaderboards;

        await serverData.save();

        return this;
    }
}

export { Server, ServerInterface, Leaderboards };