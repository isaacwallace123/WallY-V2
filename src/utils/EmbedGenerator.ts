import { EmbedBuilder, UserResolvable } from 'discord.js';
import { ClientHook } from '../hooks/ClientHook';

import { EmbedColor } from './Constants';

type EmbedInit = ConstructorParameters<typeof EmbedBuilder>[0];

export class EmbedGenerator extends EmbedBuilder {
    public static Error(data?: EmbedInit) {
        return EmbedGenerator.create(data).setColor(EmbedColor.Error);
    }

    public static Success(data?: EmbedInit) {
        return EmbedGenerator.create(data).setColor(EmbedColor.Success);
    }

    public static Warning(data?: EmbedInit) {
        return EmbedGenerator.create(data).setColor(EmbedColor.Warning);
    }

    public static Info(data?: EmbedInit) {
        return EmbedGenerator.create(data).setColor(EmbedColor.Info);
    }

    public static default(data?: EmbedInit) {
        return EmbedGenerator.create(data).setColor(EmbedColor.Defailt);
    }

    public static create(data?: EmbedInit) {
        const client = ClientHook()
        return new EmbedGenerator(data).setClient(client);
    }

    public client: ReturnType<typeof ClientHook> | null = null;

    public setClient(client: ReturnType<typeof ClientHook>) {
        this.client = client;
        return this;
    }

    public withAuthor(user: UserResolvable) {
        if (!this.client) return this;

        const author = this.client.users.resolve(user);
        
        if (!author) return this;

        return this.setAuthor({
            name: author.username,
            iconURL: author.displayAvatarURL(),
        });
    }
}