import { GatewayIntentBits } from "discord.js"

const ClientIntents = [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
];

const EmbedColor = {
    Success: 0x00fa9a,
    Error: 0xff2a16,
    Warning: 0xffd700,
    Info: 0x00bfaf,
};

export { ClientIntents, EmbedColor }