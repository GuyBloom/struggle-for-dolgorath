from .deck import Deck

class Game:
    def __init__(self, num_players=4):
        self.deck = Deck()
        self.players = {i: [] for i in range(num_players)}  # player hands
        self.current_turn = 0
        self.num_players = num_players
        self.initialize_hands()  # Deal 4 cards to each player

    def initialize_hands(self):
        """Deal 4 cards to each player at the start of the game."""
        for player_id in self.players:
            for _ in range(4):
                card = self.deck.draw()
                if card:
                    self.players[player_id].append(card)

    def play_card(self, player_id, card_index):
        """Play a card from the player's hand."""
        if player_id != self.current_turn:
            return {"error": "Not your turn"}
        
        if card_index < 0 or card_index >= len(self.players[player_id]):
            return {"error": "Invalid card index"}

        # Play the card
        card = self.players[player_id].pop(card_index)

        # After playing, draw a new card to replenish hand
        new_card = self.deck.draw()
        if new_card:
            self.players[player_id].append(new_card)

        # End the turn and pass it to the next player
        self.current_turn = (self.current_turn + 1) % self.num_players

        return {
            "played_card": card.to_dict(),
            "new_card": new_card.to_dict() if new_card else None,
            "player_id": player_id,
            "next_turn": self.current_turn,
            "hands": {pid: [c.to_dict() for c in hand] for pid, hand in self.players.items()}
        }

    def get_state(self):
        """Get the current game state (whose turn, hands)."""
        return {
            "current_turn": self.current_turn,
            "hands": {pid: [c.to_dict() for c in hand] for pid, hand in self.players.items()}
        }
