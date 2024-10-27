import { GatewayIntentBits } from "discord.js"

const ClientIntents = [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
];

const EmbedColor = {
    Success: 0x00fa9a,
    Error: 0xff2a16,
    Warning: 0xffd700,
    Info: 0x0099FF,
    Defailt: 0x2b2d31,
};

const Suffixes = ["", "K", "M", "B", "T", "Q"];

const CurrencySymbol = '<:Coin:1300204157306798181>';

const WebsiteLink = "https://wall-y.ca/"

export { ClientIntents, EmbedColor, WebsiteLink, Suffixes, CurrencySymbol }