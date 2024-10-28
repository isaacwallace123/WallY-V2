const Suffixes = ["", "K", "M", "B", "T", "Q"];

function Suffix(num: number): string {
    if (num < 1000000000) return `${Commas(num)}`;
    
    const tier = Math.floor(Math.log10(num) / 3);

    return `${+(num / Math.pow(1000, tier)).toFixed(1)}${Suffixes[tier]}`;
}

function Commas(num: number): string {
    return num.toLocaleString();
}

export { Suffixes, Suffix, Commas };