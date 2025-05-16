from .deck import Deck
from .player import Player


class Game:
    def __init__(self):
        self.market_deck = Deck()
        self.market_deck.market_init()
        self.market = []
        for _ in range(8): self.market.append(self.market_deck.draw())
        self.players = [Player(1), Player(2), Player(3), Player(4)] # 1 & 2 vs 3 & 4; 1 vs 3, 2 vs 4
        self.current_turn = 0
        self.phase = 0 #0 = morning, 1 = play, 2 = action, 3 = cleanup

    


    # def initialize_hands(self):
    #     """Deal 4 cards to each player at the start of the game."""
    #     for player_id in self.players:
    #         for _ in range(4):
    #             card = self.deck.draw()
    #             if card:
    #                 self.players[player_id].append(card)

    # def play_card(self, player_id, card_index):
    #     """Play a card from the player's hand."""
    #     if player_id != self.current_turn:
    #         return {"error": "Not your turn"}
        
    #     if card_index < 0 or card_index >= len(self.players[player_id]):
    #         return {"error": "Invalid card index"}

    #     # Play the card
    #     card = self.players[player_id].pop(card_index)

    #     # After playing, draw a new card to replenish hand
    #     new_card = self.deck.draw()
    #     if new_card:
    #         self.players[player_id].append(new_card)

    #     # End the turn and pass it to the next player
    #     self.current_turn = (self.current_turn + 1) % self.num_players

    #     return {
    #         "played_card": card.to_dict(),
    #         "new_card": new_card.to_dict() if new_card else None,
    #         "player_id": player_id,
    #         "next_turn": self.current_turn,
    #         "hands": {pid: [c.to_dict() for c in hand] for pid, hand in self.players.items()}
    #     }

    def get_state(self):
        """Get the current game state (whose turn, hands)."""
        return {
            "current_turn": self.current_turn,
            "market_deck": self.market_deck.cards,
            "market": self.market,
            "players": [player.to_dict() for player in self.players]
        }
    


