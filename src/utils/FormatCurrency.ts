import { Suffix } from "./Suffix";

import { getMaxBalance } from "./Constants";

const Currencies = {
    balance: '<:Currency:1300204157306798181>',
    crypto: '<:bitcoin:1300519754972397629>',
    bank: '<:bank:1300519780578758808>'
};

const FormatBalance = (amount: number) => `**${Currencies.balance}${Suffix(amount)}**`;

const FormatCrypto = (amount: number) => `**${Currencies.crypto}${Suffix(amount)}**`;

const FormatBank = (balance: number, level: number) => `**${Currencies.bank}${Suffix(balance)} / ${Suffix(getMaxBalance(level))}**`;

export { Currencies, FormatBalance, FormatCrypto, FormatBank };