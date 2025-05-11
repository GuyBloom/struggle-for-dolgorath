from flask import Flask, jsonify
from flask_cors import CORS
from game.game_engine import Game

app = Flask(__name__)
CORS(app)
game = Game()

@app.route("/api/draw/<int:player_id>")
def draw(player_id):
    result = game.play_card(player_id, -1)  # -1 indicates no card played yet
    return jsonify(result)

@app.route("/api/play/<int:player_id>/<int:card_index>")
def play(player_id, card_index):
    result = game.play_card(player_id, card_index)
    return jsonify(result)

@app.route("/api/state")
def state():
    return jsonify(game.get_state())

if __name__ == "__main__":
    app.run(debug=True)
