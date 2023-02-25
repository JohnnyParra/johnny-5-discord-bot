const deck = [
  { number: 1, card: "2", suit: "heart", value: 2 },
  { number: 2, card: "3", suit: "heart", value: 3 },
  { number: 3, card: "4", suit: "heart", value: 4 },
  { number: 4, card: "5", suit: "heart", value: 5 },
  { number: 5, card: "6", suit: "heart", value: 6 },
  { number: 6, card: "7", suit: "heart", value: 7 },
  { number: 7, card: "8", suit: "heart", value: 8 },
  { number: 8, card: "9", suit: "heart", value: 9 },
  { number: 9, card: "10", suit: "heart", value: 10},
  { number: 10, card: "J", suit: "heart", value: 10},
  { number: 11, card: "Q", suit: "heart", value: 10},
  { number: 12, card: "K", suit: "heart", value: 10},
  { number: 13, card: "A", suit: "heart", value: { small: 1, big: 11 }},

  { number: 14, card: "2", suit: "spade", value: 2 },
  { number: 15, card: "3", suit: "spade", value: 3 },
  { number: 16, card: "4", suit: "spade", value: 4 },
  { number: 17, card: "5", suit: "spade", value: 5 },
  { number: 18, card: "6", suit: "spade", value: 6 },
  { number: 19, card: "7", suit: "spade", value: 7 },
  { number: 20, card: "8", suit: "spade", value: 8 },
  { number: 21, card: "9", suit: "spade", value: 9 },
  { number: 22, card: "10", suit: "spade", value: 10},
  { number: 23, card: "J", suit: "spade", value: 10},
  { number: 24, card: "Q", suit: "spade", value: 10},
  { number: 25, card: "K", suit: "spade", value: 10},
  { number: 26, card: "A", suit: "spade", value: { small: 1, big: 11 }},

  { number: 27, card: "2", suit: "diamond", value: 2 },
  { number: 28, card: "3", suit: "diamond", value: 3 },
  { number: 29, card: "4", suit: "diamond", value: 4 },
  { number: 30, card: "5", suit: "diamond", value: 5 },
  { number: 31, card: "6", suit: "diamond", value: 6 },
  { number: 32, card: "7", suit: "diamond", value: 7 },
  { number: 33, card: "8", suit: "diamond", value: 8 },
  { number: 34, card: "9", suit: "diamond", value: 9 },
  { number: 35, card: "10", suit: "diamond", value: 10},
  { number: 36, card: "J", suit: "diamond", value: 10},
  { number: 37, card: "Q", suit: "diamond", value: 10},
  { number: 38, card: "K", suit: "diamond", value: 10},
  { number: 39, card: "A", suit: "diamond", value: { small: 1, big: 11 }},

  { number: 40, card: "2", suit: "club", value: 2 },
  { number: 41, card: "3", suit: "club", value: 3 },
  { number: 42, card: "4", suit: "club", value: 4 },
  { number: 43, card: "5", suit: "club", value: 5 },
  { number: 44, card: "6", suit: "club", value: 6 },
  { number: 45, card: "7", suit: "club", value: 7 },
  { number: 46, card: "8", suit: "club", value: 8 },
  { number: 47, card: "9", suit: "club", value: 9 },
  { number: 48, card: "10", suit: "club", value: 10},
  { number: 49, card: "J", suit: "club", value: 10},
  { number: 50, card: "Q", suit: "club", value: 10},
  { number: 51, card: "K", suit: "club", value: 10},
  { number: 52, card: "A", suit: "club", value: { small: 1, big: 11 }},
]

const shuffle = (deck) => {
  let i = deck.length;
  let j;
  let temp;
  while(--i > 0){
    j = Math.floor(Math.random()*(i+1));
    temp = deck[j];
    deck[j] = deck[i];
    deck[i] = temp;
  }
  return deck;
}

const cardsToString= (hand) => {
  return hand.map(card => {return `${card.card}`}).join(", ");
}

const nextCard = (deck, used) => {
  const unusedDeck = deck.filter(card => !used.some(usedCard => usedCard.number === card.number))
  return unusedDeck[0]
}

const checkCardTotal = (hand) => {
  let total = 0;
  let cardsUsed = [];
  hand.forEach(card => {
    if(card.card === "A" && total <= 10){
      total += card.value.big;
      cardsUsed.push({ card: [card.card], value: card.value.big })
    } else if (card.card === "A" && total >= 11){
      total += card.value.small;
      cardsUsed.push({ card: [card.card], value: card.value.small})
    } else{
      total += card.value;
      cardsUsed.push({ card: [card.card], value: card.value})
    }
  });

  if(total > 21){
    for(let i = 0; cardsUsed.length <= i; i++){
      if(cardsUsed[i].card === "A" && cardsUsed[i].value === 11){
        total -= 10;
        if(total <= 21) break;
      }
    }
  }
  return total
}

module.exports = {
  deck: deck,
  shuffle: shuffle,
  nextCard: nextCard,
  checkCardTotal: checkCardTotal,
  cardsToString: cardsToString,
};
