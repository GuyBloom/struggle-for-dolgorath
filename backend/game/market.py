class Market:
    def __init__(self, market_deck): 
        self.market_deck = market_deck
        self.row1 = []
        self.row2 = []
        for _ in range(4):
            self.row1.append(self.draw())
            self.row2.append(self.draw())
    def draw(self):
        card = MarketCard(self.market_deck.draw())
        return card
    def indexToCard(self, index):
        if (index < 4):
            return self.row1[index]
        else:
            return self.row2[index-4]
        
    def speculate(self, player, index):
        if (index < 8):
            self.indexToCard(index).spec(player)


    def purchase(self, index):
        row = self.row1 if index < 4 else self.row2
        i = index if index < 4 else index-4
        card = row[i]
        for c in range(i, 0, -1):
            row[c] = row[c-1]
        row[0] = self.draw()
        return card.card
    def cleanup(self):
        i1 = 3
        i2 = 3
        while (i1 > -1 and len(self.row1[i1].specs) > 0):
            i1 -= 1
        while (i2 > -1 and len(self.row2[i2].specs) > 0):
            i2 -= 1
        if (i1 >= 0):
            for c in range(i1, 0, -1):
                self.row1[c] = self.row1[c-1]
            self.row1[0] = self.draw()
        if (i2 >= 0):
            for c in range(i2, 0, -1):
                self.row2[c] = self.row2[c-1]
            self.row2[0] = self.draw()
        
        
        
    def to_dict(self):
        displayCards1 = []
        displayCards2 = []

        for c in self.row1:
            displayCards1.append(c.card)
        for c in self.row2:
            displayCards2.append(c.card)
        specs1 = []
        specs2 = []
        for c in self.row1:
            specs1.append(c.specs)
        for c in self.row2:
            specs2.append(c.specs)
        return {
            "cards1": displayCards1,
            "specs1": specs1,
            "cards2": displayCards2,
            "specs2": specs2
        }
    
class MarketCard:
    def __init__(self, card):
        self.card = card
        self.specs = []
    def spec(self, player):
        self.specs.append(player)
    