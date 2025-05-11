
class Card:
    def __init__(self, suit, value):
        self.suit = suit
        self.value = value

   
    def to_dict(self):
        name_map = {
            1: "ace", 11: "jack", 12: "queen", 13: "king"
        }
        value_name = name_map.get(self.value, str(self.value))
        suit_map = {
            "♠": "spades",
            "♥": "hearts",
            "♦": "diamonds",
            "♣": "clubs"
        }
        suit_name = suit_map[self.suit]
        filename = f"{value_name}_of_{suit_name}.png"
        return {
            "suit": self.suit,
            "value": self.value,
            "image": f"/cards/{filename}"
        }
