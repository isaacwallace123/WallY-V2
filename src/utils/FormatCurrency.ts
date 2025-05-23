import { Suffix } from "./Suffix";

import { getMaxBalance } from "./Constants";

const Currencies = {
    balance: '<:currency:1364986029022384209>',
    crypto: '<:crypto:1364986000610300157>',
    shells: `<:terminal:1364986213378953398>`,
    bank: '<:bank:1300519780578758808>',
};

const FormatBalance = (amount: number) => `**${Currencies.balance} ${Suffix(amount)}**`;

const FormatCrypto = (amount: number) => `**${Currencies.crypto} ${Suffix(amount)}**`;

const FormatShells = (amount: number) => `**${Currencies.shells} ${Suffix(amount)}**`;

const FormatBank = (balance: number, level: number) => `**${Currencies.bank} ${Suffix(balance)} / ${Suffix(getMaxBalance(level))}**`;

const FormatBankWithoutLimit = (balance: number) => `**${Currencies.bank} ${Suffix(balance)}**`;

export { Currencies, FormatBalance, FormatCrypto, FormatShells, FormatBank, FormatBankWithoutLimit };