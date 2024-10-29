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

const WebsiteLink = "https://wall-y.ca/";

const getRandomXP = ():number => Math.floor(Math.random() * 5) + 1;
const calculateLevelXP = (level: number):number => 100 * level || 1;

const getMaxBalance = (level: number):number => 5000 * level;
const getUpgradePrice = (level: number):number => level <= 3 ? 5000 : 1000 * Math.pow(2, level - 1);

export { ClientIntents, EmbedColor, WebsiteLink, getRandomXP, calculateLevelXP, getMaxBalance, getUpgradePrice }