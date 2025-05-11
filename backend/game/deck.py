
import random
from .card import Card

class Deck:
    def __init__(self):
        self.cards = [Card(suit, value) for suit in ["♠", "♥", "♦", "♣"]
                                         for value in range(1, 14)]

    def shuffle(self):
        random.shuffle(self.cards)

    def draw(self):
        return self.cards.pop() if self.cards else None
