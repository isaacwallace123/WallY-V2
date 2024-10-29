import { Suffix } from "./Suffix";

import { getMaxBalance } from "./Constants";

const Currencies = {
    balance: '<:Currency:1300204157306798181>',
    crypto: '<:bitcoin:1300519754972397629>',
    shells: `<:terminal:1300894673153560657>`,
    bank: '<:bank:1300519780578758808>',
};

const FormatBalance = (amount: number) => `**${Currencies.balance} ${Suffix(amount)}**`;

const FormatCrypto = (amount: number) => `**${Currencies.crypto} ${Suffix(amount)}**`;

const FormatShells = (amount: number) => `**${Currencies.shells}** ${Suffix(amount)}`;

const FormatBank = (balance: number, level: number) => `**${Currencies.bank} ${Suffix(balance)} / ${Suffix(getMaxBalance(level))}**`;

const FormatBankWithoutLimit = (balance: number) => `**${Currencies.bank} ${Suffix(balance)}**`;

export { Currencies, FormatBalance, FormatCrypto, FormatShells, FormatBank, FormatBankWithoutLimit };