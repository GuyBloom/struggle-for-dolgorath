from flask import Flask, request, jsonify
from flask_cors import CORS
from game.game_engine import Game
import time


app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})  # Allow only your frontend
game = Game()

@app.route('/api/speculate', methods=['POST'])
def speculate_move():
    # Get data from the frontend
    data = request.get_json()

    # Process the request (simulate waiting for input from frontend)
    if data.get('index') >-1:
        card = data.get('index')
        print(f"Current turn: {game.current_turn}")

        game.players[game.current_turn-1].speculate = card
        game.next_turn()
        # Respond back with the result
        return jsonify({"status": "success", "message": "Successfully speculated "})
    elif data.get('index') == -1:
        game.current_turn = game.next_turn(game.current_turn)
        return jsonify({"status": "success", "message": "Successfully declined speculation "})
    else:
        return jsonify({"status": "error", "message": "Invalid action!"})
    

@app.route("/api/play/<int:player_id>/<int:card_index>")
def play(player_id, card_index):
    result = game.play_card(player_id, card_index)
    return jsonify(result)

@app.route("/api/state")
def state():
    return jsonify(game.get_state())

if __name__ == "__main__":
    app.run(debug=True)
