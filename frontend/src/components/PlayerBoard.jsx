import React from 'react';
import Token from './Token';
import MightTrack from './MightTrack';
function PlayerBoard({ player, Pfunctions, Tfunctions, gameState, MightFunctions, InsightFunctions }) {
    const { handleRightClick, handlePlayCard, handleDamage, handleTap } = Pfunctions;
    const {setPopupText, handleButtonError, promptPlayerToRemoveSpec, specsFromIndex} = Tfunctions


  return (
    <div className="player-board-container" id={`player-board-${player["id"]}`}>
      <div className="player-board-wrapper">
        
        <div className="player-board">
          <MightTrack player={player} mightFunctions={MightFunctions}></MightTrack>
          <div className='talisman-container'>
              {player.talismans.map((card, index) => (
                
              <img
                key={index}
                className="card"
                src={`assets/cards/${card}.jpg`}
                alt={`Talisman ${card}`}
                onContextMenu={(e) => handleRightClick(e, card)}
                onClick={() => handleTap(player.id, index)}
              />
            ))}
        </div>
          {/* <img
            className={`player-mat ${player["id"] === 1 || player["id"] === 2 ? 'upside-down' : ''}`}

            src={player["board"]}
            alt={`Player ${player["id"]} board`}
          /> */}


          
          <div className='discard-deck-row'>
            <div className='deck-container'>
              <div className='deck-header'>
                {player.discard.length}
              </div>
              {player.discard.length > 0 && (
                <img
                className="card"
                src={`assets/cards/${player.discard[player.discard.length-1]}.jpg`}
                alt={`Card back}`}
                onContextMenu={(e) => handleRightClick(e, player.discard[player.discard.length-1])}

              />
              )}
              {player.discard.length == 0 && (
                <img
                className="card"
                src={`assets/cards/92.jpg`}
                alt={`Card back}`}
              />
              )}
            </div>
            <div className='token first-turn'>
              {}
            </div>
            <div className='deck-container'>
              <div className='deck-header'>
                {player.deck.length}
              </div>
              {player.deck.length > 0 && (
                <img
                className="card"
                src={`assets/cards/51.jpg`}
                alt={`Card back}`}
              />
              )}
              {player.deck.length == 0 && (
                <img
                className="card"
                src={`assets/cards/93.jpg`}
                alt={`Card back}`}
              />
              )}
            </div>
          </div>
        </div>
        
        <div className='play-container'>
            {player.played.map((card, index) => (
              <img
                key={index}
                className="card"
                src={`assets/cards/${card}.jpg`}
                alt={`Card ${card}`}
                onContextMenu={(e) => handleRightClick(e, card)}
              />
            ))}
          </div>
        <div className={`stats-list ${player["id"] === 1 || player["id"] === 4 ? 'left-side' : ''}`}>
          <div className="stat-item">Player {player["id"]}</div>
          <div className="stat-item">Coins: {player["coins"]}</div>
          <div className="stat-item">HP: {player["hp"]}</div>
          <div className="stat-item">Shield: {player["shield"]}</div>
          <div className="stat-item">Might: {player["might"]}</div>
          <div className="stat-item">Insight: {player["insight"]}</div>
          <div className="stat-item">DMG: {player["damage"]}</div>

        </div>
      </div>

      <div className="hand-container">
        {player.hand.map((card, index) => (
          <img
            key={index}
            className="card"
            src={`assets/cards/${card}.jpg`}
            alt={`Card ${card}`}
            onContextMenu={(e) => handleRightClick(e, card)}
            onClick={() => handlePlayCard(player.id, index)} 
          />
        ))}
      </div>
      <Token key={player.id} player={player} functions={Tfunctions} gameState={gameState}></Token>
      {gameState.firstPlayer == player.id &&

      <img 
      className='token'
      src={`assets/first-tokens/${gameState.firstTokenFace}.png`}
    ></img>
      }
      <button onClick={() => handleDamage(player.id)}>Damage</button>

      <button></button>
    </div>
  );
}
export default PlayerBoard;