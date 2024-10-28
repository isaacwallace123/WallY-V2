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

const Currencies = {
    main: '<:Currency:1300204157306798181>',
    crypto: '<:bitcoin:1300519754972397629>',
    bank: '<:bank:1300519780578758808>'
};

const WebsiteLink = "https://wall-y.ca/";

const getRandomXP = () => Math.floor(Math.random() * 5) + 1;
const calculateLevelXP = (level: number) => 100 * level || 1;

export { ClientIntents, EmbedColor, WebsiteLink, Suffixes, Currencies, getRandomXP, calculateLevelXP }