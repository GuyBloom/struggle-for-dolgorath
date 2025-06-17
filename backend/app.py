from flask import Flask, request, jsonify
from flask_cors import CORS
from game.game_engine import Game
from flask_socketio import SocketIO, emit

import time




app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})  
socketio = SocketIO(app, cors_allowed_origins="http://localhost:5173")  
game = Game()



@socketio.on('connect')
def on_connect():
    emit('game_update', game.get_state())  # Send initial game state to the new client



@app.route('/api/speculate/<int:index>', methods=['POST'])
def speculate_move(index):
    if index >= 0:
        card = index
        print(f"Current turn: {game.current_turn}")
        game.players[game.current_turn-1].hasSpec = 1 
        for p in range(4):
            print(f"Player {p+1} hasSpec: {game.players[p].hasSpec}")

        game.market.speculate(game.current_turn-1, index)
        while (game.players[game.current_turn-1].hasSpec == 1 and not game.speculate_over()):
            game.next_turn()
        if (game.phase == 0 and game.speculate_over()):
            game.phase = 1
            game.current_turn = 0
            socketio.emit('game_update', game.get_state())  
            return jsonify({"status": "success", "message": "Successfully speculated, moving to play phase "})
        socketio.emit('game_update', game.get_state())  

        return jsonify({"status": "success", "message": "Successfully speculated "})
    else:
        return jsonify({"status": "error", "message": "Invalid action!"})

@app.route('/api/removespec/<int:speculated_card>/<int:speculate_pos>', methods=['POST'])
def remove_spec(speculated_card, speculate_pos):
    specs = game.market.indexToCard(speculated_card).specs
    game.players[specs[speculate_pos]].hasSpec = 0
    for i in range(speculate_pos, len(specs)-1):
        specs[i] = specs[i+1]
    specs.pop()
    socketio.emit('game_update', game.get_state()) 
    return jsonify({"status": "success", "message": "Successfully removed speculate token "})


@app.route('/api/purchase/<int:player>/<int:index>/<int:cost>', methods=['POST'])
def purchase_move(player, index, cost):
    if index >=0:
        card = index
        print(f"Current turn: {game.current_turn}")
        game.purchase(index, player, cost)
        socketio.emit('game_update', game.get_state()) 
        return jsonify({"status": "success", "message": "Successfully purchased "})
    else:
        return jsonify({"status": "error", "message": "Invalid action!"})
    

@app.route('/api/damage/<int:player>', methods=['POST'])
def damage_move(player):
    game.damage(player)
    socketio.emit('game_update', game.get_state()) 
    return jsonify({"status": "error", "message": "Invalid action!"})

@app.route('/api/tap/<int:player>/<int:index>', methods=['POST'])
def tap_move(index, player):
    if index >=0:
        game.tap(index, player)
        socketio.emit('game_update', game.get_state()) 
        return jsonify({"status": "success", "message": "Successfully tapped"})
    else:
        return jsonify({"status": "error", "message": "Invalid action!"})


@app.route("/api/play/<int:player>/<int:card_index>", methods=['POST'])
def play(player, card_index):
    card = game.players[player-1].hand[card_index]
    game.players[player-1].hand.pop(card_index)
    game.players[player-1].played.append(card)
    result = game.play_card(card, game.players[player-1])
    socketio.emit('game_update', game.get_state()) 
    return jsonify(result)

@app.route("/api/state")
def state():
    return jsonify(game.get_state())

@app.route("/api/choice/<int:choice>", methods=['POST'])
def makeChoice(choice):
    game.choice = choice
    socketio.emit('game_update', game.get_state()) 



@app.route("/api/cleanup", methods=['POST'])
def cleanup():
    if (game.phase == 3): game.cleanup1()
    elif (game.phase == 4): game.cleanup2()
    elif (game.phase == 5): game.cleanup3()
    elif (game.phase == 6): game.cleanup4()
    else:  return jsonify({"status": "fail", "message": "Invalid phase"})
    socketio.emit('game_update', game.get_state()) 
    return jsonify({"status": "success", "message": "Successfully progressed to next cleanup phase"})

@app.route("/api/<int:player>/flip", methods=['POST'])
def flip(player):
    game.flip(player)
    if (game.phase == 1):
        if (game.play_over()):
            game.phase = 2
            game.current_turn = game.firstPlayer
    elif (game.phase == 2):            
        game.next_turn()
    socketio.emit('game_update', game.get_state()) 
    return jsonify({"status": "success", "message": "Successfully flipped token "})
    


if __name__ == '__main__':
    socketio.run(app, debug=True)