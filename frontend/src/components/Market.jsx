import React from 'react';
function Market({ market, functions, gameState }) {
  const {handleRightClick, handleButtonPress} = functions
  return (
    <div className="market-container" id="market">
      <div className='deck-container'>

      </div>
      <div className='deck-container'>
              <div className='deck-header'>
                {gameState.market_deck.length}
              </div>
              {market.length > 0 && (
                <img
                className="card"
                src={`assets/cards/51.jpg`}
                alt={`Card back}`}
              />
              )}
            
            </div>
      <div className="market-row">
        {market.cards1.map((card, index) => ( 
          <div className='market-card-wrapper' key={index}>
            <div className='market-card-container' key={index}>
            <img
              key={index}
              className="card"
              src={`assets/cards/${card}.jpg`}
              alt={`Card ${card}`}
              onContextMenu={(e) => handleRightClick(e, card)} 
            />
             {/* Token 1 - Top Left */}
            {market.specs1[index].length > 0 && <img
              className="token-overlay token-top-left"
              src={`assets/player-tokens/${market.specs1[index][0] + 1}-spec.png`}
              alt="Token 1"
            />}

            {/* Token 2 - Top Right */}
            {market.specs1[index].length > 1 && <img
              className="token-overlay token-top-right"
              src={`assets/player-tokens/${market.specs1[index][1] + 1}-spec.png`}
              alt="Token 2"
            />}

            {/* Token 3 - Bottom Left */}
            {market.specs1[index].length > 2 && <img
              className="token-overlay token-bottom-left"
              src={`assets/player-tokens/${market.specs1[index][2] + 1}-spec.png`}
              alt="Token 3"
            />}

            {/* Token 4 - Bottom Right */}
            {market.specs1[index].length > 3 && <img
              className="token-overlay token-bottom-right"
              src={`assets/player-tokens/${market.specs1[index][3] + 1}-spec.png`}
              alt="Token 4"
            />}
            </div>
            <div className='market-buttons'>
              {card !== 97 && (
                <>
                  <button onClick={() => handleButtonPress(0, index)}>Speculate</button>
                  <button onClick={() => handleButtonPress(1, index)}>Purchase</button>
                </>
              )}
            </div>
            
          </div>
        ))}
      </div>

      <div className="market-row">
        {market.cards2.map((card, index) => (  // Next 4 cards
          <div className='market-card-wrapper' key ={index+4}>
                        <div className='market-card-container' key={index}>
            <img
              key={index}
              className="card"
              src={`assets/cards/${card}.jpg`}
              alt={`Card ${card}`}
              onContextMenu={(e) => handleRightClick(e, card)} 
            />
             {/* Token 1 - Top Left */}
            {market.specs2[index].length > 0 && <img
              className="token-overlay token-top-left"
              src={`assets/player-tokens/${market.specs2[index][0] + 1}-spec.png`}
              alt="Token 1"
            />}

            {/* Token 2 - Top Right */}
            {market.specs2[index].length > 1 && <img
              className="token-overlay token-top-right"
              src={`assets/player-tokens/${market.specs2[index][1] + 1}-spec.png`}
              alt="Token 2"
            />}

            {/* Token 3 - Bottom Left */}
            {market.specs2[index].length > 2 && <img
              className="token-overlay token-bottom-left"
              src={`assets/player-tokens/${market.specs2[index][2] + 1}-spec.png`}
              alt="Token 3"
            />}

            {/* Token 4 - Bottom Right */}
            {market.specs2[index].length > 3 && <img
              className="token-overlay token-bottom-right"
              src={`assets/player-tokens/${market.specs2[index][3] + 1}-spec.png`}
              alt="Token 4"
            />}
            </div>
            <div className='market-buttons'>
              {card !== 97 && (
                <>
                  <button onClick={() => handleButtonPress(0, index+4)}>Speculate</button>
                  <button onClick={() => handleButtonPress(1, index+4)}>Purchase</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className='market-row'>
            <button onClick={() => handleButtonPress(0, 8)}>Decline to Speculate</button>
      </div>
    </div>
  );
}
export default Market;