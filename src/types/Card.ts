enum Suits {
    Hearts = '<:blackjack_hearts:1364978047643553885>',
    Diamonds = '<:blackjack_diamonds:1364978030874988625>',
    Clubs = '<:blackjack_clubs:1364978016492589056>',
    Spades = '<:blackjack_spades:1364978059178151966>',
}

interface FaceType {
    Red: string;
    Black: string;
}

const Faces: Record<string, FaceType> = {
    Aces: { Red: '<:rA:1364978405057106053>', Black: '<:bA:1364978219547099137>' },
    '2': { Red: '<:r2:1364978278493978705>', Black: '<:b2:1364978094594588783>' },
    '3': { Red: '<:r3:1364978291903172608>', Black: '<:b3:1364978106871320701>' },
    '4': { Red: '<:r4:1364978309531828336>', Black: '<:b4:1364978118300930058>' },
    '5': { Red: '<:r5:1364978323146674207>', Black: '<:b5:1364978128681959474>' },
    '6': { Red: '<:r6:1364978336832425985>', Black: '<:b6:1364978141533310977>' },
    '7': { Red: '<:r7:1364978351160426567>', Black: '<:b7:1364978154615345182>' },
    '8': { Red: '<:r8:1364978367631331440>', Black: '<:b8:1364978170456969297>' },
    '9': { Red: '<:r9:1364978379241033859>', Black: '<:b9:1364978187133653002>' },
    '10': { Red: '<:r10:1364978391803105350>', Black: '<:b10:1364978200261689345>' },
    Jack: { Red: '<:rJ:1364978418948771911>', Black: '<:bJ:1364978235200245912>' },
    Queen: { Red: '<:rQ:1364978445398053016>', Black: '<:bQ:1364978263570645089>' },
    King: { Red: '<:rK:1364978431091282072>', Black: '<:bK:1364978251486724217>' },
}

enum UnknownCard {
    Left = "<:randomL:1364977944325521440>",
    Right = "<:randomR:1364977966253215834>"
}

interface Card {
    value: number;
    suit: Suits;
    face: string,
    icon: string,
}

export { Card, Suits, Faces, FaceType, UnknownCard };