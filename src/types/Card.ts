enum Suits {
    Hearts = '<:hearts:1300184761083494491>',
    Diamonds = '<:diamonds:1300184750786347061>',
    Clubs = '<:clubs:1300184740439130112>',
    Spades = '<:spades:1300184771296628786>',
}

console.log(Suits)

interface FaceType {
    Red: string;
    Black: string;
}

const Faces: Record<string, FaceType> = {
    Aces: { Red: '<:rA:1300184687079063615>', Black: '<:bA:1300184539901202512>' },
    '2': { Red: '<:r2:1300184582691229838>', Black: '<:b2:1300184396363464784>' },
    '3': { Red: '<:r3:1300184594435280896>', Black: '<:b3:1300184412549414943>' },
    '4': { Red: '<:r4:1300184606343168000>', Black: '<:b4:1300184424461107241>' },
    '5': { Red: '<:r5:1300184617545896087>', Black: '<:b5:1300184450004422787>' },
    '6': { Red: '<:r6:1300184630120415302>', Black: '<:b6:1300184462717354034>' },
    '7': { Red: '<:r7:1300184640237207594>', Black: '<:b7:1300184472419045536>' },
    '8': { Red: '<:r8:1300184651041869874>', Black: '<:b8:1300184502324428941>' },
    '9': { Red: '<:r9:1300184660017414215>', Black: '<:b9:1300184514232057956>' },
    '10': { Red: '<:r10:1300184673003245661>', Black: '<:b10:1300184525648826460>' },
    Jack: { Red: '<:rJ:1300184699813232831>', Black: '<:bJ:1300184550051283055>' },
    Queen: { Red: '<:rQ:1300184723683020932>', Black: '<:bQ:1300184572247412767>' },
    King: { Red: '<:rK:1300184712332968008>', Black: '<:bK:1300184562252386424>' },
}

enum UnknownCard {
    Left = "<:randomL:1300184356467245156>",
    Right = "<:randomR:1300184377485037669>"
}

interface Card {
    value: number;
    suit: Suits;
    face: string,
    icon: string,
}

export { Card, Suits, Faces, FaceType, UnknownCard };