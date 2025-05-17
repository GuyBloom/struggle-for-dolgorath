from flask import Flask, request, jsonify
from flask_cors import CORS
from game.game_engine import Game
import time


app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})  # Allow only your frontend
game = Game()

@app.route('/api/speculate', methods=['POST'])
def speculate_move():
    data = request.get_json()

    if data.get('index') >=-1:
        card = data.get('index')
        print(f"Current turn: {game.current_turn}")

        game.players[game.current_turn-1].speculate = card
        if (game.speculate_over()):
            game.phase = 1
            game.current_turn = 0
            return jsonify({"status": "success", "message": "Successfully speculated, moving to play phase "})
        game.next_turn()
        return jsonify({"status": "success", "message": "Successfully speculated "})
    else:
        return jsonify({"status": "error", "message": "Invalid action!"})
    

@app.route("/api/play/<int:player>/<int:card_index>")
def play(player, card_index):
    card = game.players[player-1].hand[card_index]
    game.players[player-1].hand.pop(card_index)
    result = game.play_card(card, game.players[player-1])
    return jsonify(result)

@app.route("/api/state")
def state():
    return jsonify(game.get_state())

if __name__ == "__main__":
    app.run(debug=True)
