from .deck import Deck

boards = ["assets/player-boards/p1.jpg", "assets/player-boards/p2.jpg", "assets/player-boards/p3.jpg", "assets/player-boards/p4.jpg"];


class Player:
    def __init__(self, player_num):
        self.id = player_num
    
        self.board = boards[player_num-1]
        self.hp = 60
        self.shield = 0
        self.coins = 0
        self.damage = 0
        self.might = 0
        self.insight = 0
        self.forest = 0
        self.hand = []
        self.trinkets = []
        self.discard = Deck()
        self.deck = Deck(self.discard)
        self.deck.player_init()
        self.token = 0 #0 = passed, 1 = ready
        self.played = []
        self.talismans = [63, 64, 65, 66]
        self.tapped = [0, 0, 0, 0] #0 indicates untapped, 1 indicates tapped
        self.speculate = -2 #0-7 indicates market placement, -1 indicates refused, -2 indicates not speculated yet
        self.hasSpec = 0 #0 means not given option to speculate, 1 means given option to speculate
        for _ in range(5): self.hand.append(self.deck.draw())
    

    def cleanup1(self):
        print(f"Attempting to clean player {self.id}")
        self.damage = 0
        self.coins = 0
        self.shield = 0
        self.tapped = [0, 0, 0, 0] #0 indicates untapped, 1 indicates tapped
        while len(self.played) > 0:
            self.discard.addOnTop(self.played.pop())
        while len(self.hand) > 0:
            self.discard.addOnTop(self.hand.pop())
    def cleanup2(self):
        for _ in range(5): self.hand.append(self.deck.draw())

    def to_dict(self):
        return {
            "trinkets": self.trinkets,
            "tapped": self.tapped,
            "token": self.token, #0 is passed, 1 is ready
            "speculate": self.speculate,
            "hasSpec": self.hasSpec,
            "board": self.board,
            "might": self.might,
            "insight": self.insight,
            "id": self.id,
            "deck": self.deck.cards,
            "hp": self.hp,
            "damage": self.damage,
            "shield": self.shield,
            "coins": self.coins,
            "forest": self.forest,
            "hand": self.hand,
            "played": self.played,
            "discard": self.discard.cards,
            "talismans": self.talismans,
        }

