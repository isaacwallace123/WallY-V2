enum Suits {
    Hearts = '<:hearts:1300184761083494491>',
    Diamonds = '<:diamonds:1300184750786347061>',
    Clubs = '<:clubs:1300184740439130112>',
    Spades = '<:spades:1300184771296628786>',
}

console.log(Suits)

enum Faces {
    Aces = 'A',
    Two = '2',
    Three = '3',
    Four = '4',
    Five = '5',
    Six = '6',
    Seven = '7',
    Eight = '8',
    Nine = '9',
    Ten = '10',
    Jack = 'J',
    Queen = 'Q',
    King = 'K',
}

enum UnknownCard {
    Left = "<:randomL:1300184356467245156>",
    Right = "<:randomR:1300184377485037669>"
}

interface Card {
    value: number;
    suit: Suits;
    face: Faces
}

export { Card, Suits, Faces, UnknownCard };