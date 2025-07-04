
import random
class Deck:
    def __init__(self, dependency=None): 
        self.cards = []
        self.type = -1 #0 = market, 1 = player
        self.dependency = dependency

        
    
    def market_init(self):
        self.cards = [1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 5, 5, 6, 
                6, 7, 7, 7, 8, 8, 9, 9, 10, 10, 10, 11, 11, 12, 12, 
                13, 13, 14, 14, 14, 15, 15, 15, 16, 16, 16, 17, 17, 
                18, 18, 19, 19, 19, 20, 20, 20, 21, 21, 22, 22, 23, 
                23, 23, 24, 24, 25, 25, 25, 26, 26, 27, 27, 28, 28, 
                28, 29, 29, 29, 30, 30, 30, 31, 31, 32, 32, 32, 33, 
                33, 34, 34, 35, 35, 36, 36, 37, 37, 37, 38, 38, 39,
                39, 40, 40, 40, 41, 41, 41, 42, 42, 43, 43, 43, 44, 
                44, 45, 45]
        self.shuffle()
        self.type = 0
    def player_init(self):
        self.cards = [67, 68, 69, 70, 71, 72, 73, 73, 73, 73]
        self.shuffle()
        self.type = 1

    def addOnTop(self, card):
        self.cards.append(card)
    

    def clear(self):
        self.cards = []

    def shuffle(self):
        random.shuffle(self.cards)


    def draw(self):
        if (self.cards):
            return self.cards.pop()
        elif self.dependency:
            self.dependency.shuffle()
            self.cards = self.dependency.cards
            self.dependency.clear()
            return self.cards.pop()
        else:
            return None  
        
    
