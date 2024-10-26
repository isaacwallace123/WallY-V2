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
};

const websiteLink = "https://wall-y.ca/"

const CardFaces = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

export { ClientIntents, EmbedColor, websiteLink, CardFaces }