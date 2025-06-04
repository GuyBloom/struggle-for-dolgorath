from .deck import Deck
from .player import Player
from .market import Market
#turn order: 1 ->2 -> 3 -> 4 -> 1
costs = {3} #placeholder; will be dictionary from card indices to card costs
plusOneCoin = {67, 69, 70, 71, 72, 73}
plusOneCard = {}
plusOneMight = {68}
plusOneInsight = {68}
plusOneDamage = {73}

versus = {
    1: 2,
    2: 3,
    3: 0,
    4: 1
}

class Game:
    def __init__(self):
        self.team12 = [1, 2]
        self.team34 = [3, 4]
        self.market_deck = Deck()
        self.hasSpeculated = []
        self.firstPlayer = 1
        self.market_deck.market_init()
        self.market = Market(self.market_deck)
        self.players = [Player(1), Player(2), Player(3), Player(4)] # 1 & 2 vs 3 & 4; 1 vs 3, 2 vs 4
        self.current_turn = 1 #0 is play phase, 1-4 correspond to player turns for morning and action
        self.phase = 0 #0 = morning, 1 = play, 2 = action, 3 = cleanup
        for p in self.players: print(f"Player {p.id}: Token: {p.token}")


    def morning(self):
        starter = self.firstPlayer

    def damage(self, player):
        dmg = self.players[player -1].damage
        self.players[player -1].damage = 0
        if player in self.team12:
            if len(self.team34) == 2:
                self.players[versus[player]].hp -= dmg
            else:                
                self.players[self.team34[0]-1].hp -= dmg
        if player in self.team34:
            if len(self.team12) == 2:
                self.players[versus[player]].hp -= dmg
            else:                
                self.players[self.team12[0]-1].hp -= dmg
        self.next_turn()

    def cleanup1(self):
        self.current_turn = 0

        print(f'Attempting to clean up' )
        for p in self.players:
            p.cleanup1()
        self.phase = 4
    def cleanup2(self):
        for p in self.players:
            p.cleanup2()
        self.phase = 5
    def cleanup3(self):
        self.market.cleanup()

        self.current_turn = self.firstPlayer
        print("Successfully cleaned up")
        self.phase = 6
    def cleanup4(self):
        self.phase = 0



    def next_turn(self): #assumes turn isn't 0
        if (self.current_turn == 4):
            self.current_turn = 1
        
        else:
            self.current_turn += 1


        if (self.phase == 2):
            if self.action_over():
                print("Action phase over, cleaning up")
                self.phase = 3
            elif self.players[self.current_turn - 1].token == 0:
                self.next_turn()

            
        
    def speculate_over(self):
        for p in self.players:
            if (p.speculate == -2):
                return False
        return True
    def play_over(self):
        print("Checking if play is over:")
        for p in self.players: print(f"Player {p.id}: Token: {p.token}")

        for p in self.players:
            if (p.token == 0):
                print("It's not over")
                return False
        print("It's over")
        return True
    
    def action_over(self):
        for p in self.players:
            if (p.token == 1):
                print("It's not over")
                return False
        print("It's over")
        return True


    def purchase(self, card, player, cost): #card is given as index into market
        self.players[player-1].coins -= cost
        self.players[player-1].discard.addOnTop(self.market.purchase(card))
        self.next_turn()
    def tap(self, index, player):
        self.players[player-1].coins -= 1
        match index:
            case 0:
                self.players[player-1].damage += 3
                self.players[player-1].tapped[0] = 1
            case 1:
                self.players[player-1].hp += 4
                self.players[player-1].tapped[1] = 1

            case 2:
                self.players[player-1].insight += 1
                self.players[player-1].tapped[2] = 1
            case 3:
                self.players[player-1].might += 1
                self.players[player-1].tapped[3] = 1
        if (self.phase == 2):
            self.next_turn()
        
        
            
            
        

    
    def play_card(self, card, player):
        if (card in plusOneCoin):
            player.coins += 1
        if (card in plusOneDamage):
            player.damage += 1
        if (card in plusOneMight):
            player.might += 1
        if (card in plusOneInsight):
            player.insight += 1
        if (card in plusOneCard):
            player.hand.append(player.deck.draw())

    def firstPass(self):
        for p in self.players:
            if p.token == 0: return False
        return True
    def flip(self, player):
        if (self.phase == 2 and self.firstPlayer != player and self.firstPass()):
            self.firstPlayer = player
        if (self.players[player-1].token == 0):
            self.players[player-1].token = 1
    
        elif (self.players[player-1].token == 1):
            self.players[player-1].token = 0



        

        

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
            "phase": self.phase,
            "current_turn": self.current_turn,
            "first_player": self.firstPlayer,
            "market_deck": self.market_deck.cards,
            "market": self.market.to_dict(),
            "players": [player.to_dict() for player in self.players]
        }
    


