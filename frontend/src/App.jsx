import { useEffect, useState } from 'react';

function App() {
  const [gameState, setGameState] = useState(null);
  const [zoomedCardIndex, setZoomedCardIndex] = useState(null);
  const [popupText, setPopupText] = useState(null);


  const displaySpeculate = (spec) => {
    if (spec ==-2){
      return "Not speculated yet"
    }
    else if (spec == 8){
      return "Refused to speculate"
    }
    else{
      return `${gameState.market[spec]} (Position ${spec})`
    }
  };


  
  const displayPhase = (phase) => {
    if (phase ==0){
      return "Speculate"
    }
    else if (phase == 1){
      return "Play"
    }
    else if (phase == 2){
      return "Action"
    }
    else{
      return "Cleanup"
    }
  };

  const fetchState = async () => {
    const res = await fetch("http://localhost:5000/api/state");
    const data = await res.json();
    setGameState(data);
  };


  const handlePlayCard = async (player, index) => {
    if (handleButtonError(2) == 0){
      const response = await fetch(`http://localhost:5000/api/play/${player}/${index}`);
      console.log(response)
    }
  }
  const handleTap = async (player, index) =>{
    if (gameState.phase == 0){
      setPopupText("You cannot tap your talisman in the speculate phase")
    }
    else if (gameState.phase == 2 && gameState.current_turn !== player){
      setPopupText("It is not your turn")
    }
    else if (gameState.players[player - 1]["coins"] < 1){
      setPopupText("You do not have enough coins to tap")
    }
    else {
      const response = await fetch(`http://localhost:5000/api/tap/${player}/${index}`); // 0 = damage, 1 = health, 2 = insight, 3 = might
      const result = await response.json();
      console.log(result);
    }
    
    
  }
    

  useEffect(() => {
    fetchState();
    const interval = setInterval(fetchState, 500); // Polling every 2 seconds
    return () => clearInterval(interval);
  }, []);

  


const gameContainer = document.getElementById('game-container');

const handleRightClick = (e, cardIndex) => {
    e.preventDefault(); 
    setZoomedCardIndex(cardIndex); 
  };



const handleButtonError = (buttonType) => { //0 = speculate, 1 = purchase, 2 = playerCard, 3 = token, 4 = talisman
    if (buttonType == 1 && gameState.phase !=2){
      setPopupText("You can only buy during the action phase")
      return 1;
    }
    if (buttonType == 2 && gameState.phase !== 1){
      setPopupText("You can only play during the play phase")
      return 1;
    }
    if (buttonType == 3 && (gameState.phase !== 1 && gameState.phase !== 2)){
      setPopupText("You can only flip your token during the play or action phase")
      return 1;
    }
    
    return 0;
}


const handleButtonPress = (buttonType, index) => { //0 = speculate, 1 = purchase, 2 = playerCard, 3 = token
  if (handleButtonError(buttonType) == 0){
    if (buttonType == 0){
      handleSpeculate(index)
    }
    if (buttonType == 1){
      handlePurchase(index)
    }
  }
  
}

const handleSpeculate = async (card) => {
  const response = await fetch(`http://localhost:5000/api/speculate/${card}`);

  const result = await response.json();
  console.log(result);
};


const handlePurchase = async (card) => {
  let cost = 3 //will change
  if (gameState.players[gameState.current_turn - 1].speculate == card) cost -=1 

  if (gameState.players[gameState.current_turn - 1]["coins"] < cost){
    setPopupText("You do not have enough coins to buy this")
  }
  else{
    const response = await fetch(`http://localhost:5000/api/purchase/${card}/${cost}`);

    const result = await response.json();
    console.log(result);
  }
  
};




function Market({ market }) {
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
        {market.slice(0, 4).map((card, index) => ( 
          <div className='market-card-wrapper' key={index}>
            <img
              key={index}
              className="card"
              src={`assets/cards/${card}.jpg`}
              alt={`Card ${card}`}
              onContextMenu={(e) => handleRightClick(e, card)} 
            />
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
        {market.slice(4, 8).map((card, index) => (  // Next 4 cards
          <div className='market-card-wrapper' key ={index+4}>
            <img
              key={index}
              className="card"
              src={`assets/cards/${card}.jpg`}
              alt={`Card ${card}`}
              onContextMenu={(e) => handleRightClick(e, card)} 
            />
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
      <div className='market-row'>
            <button onClick={() => handleButtonPress(0, 8)}>Decline to Speculate</button>
      </div>
    </div>
  );
}
function Token ( {player} ){
  const [t, setT] = useState(95);
  useEffect(() => {
    if (player.token === 0) {
      setT(96); 
    } else if (player.token === 1) {
      setT(95); 
    }
  }, [player.token]); 


  const handleFlipError = (player) => {
    if (gameState.phase == 1) return 0
    if (gameState.current_turn == player.id) return 0
    setPopupText("You cannot flip when it is not your turn")
    return 1
  }
  const Flip = async (player) => {

    if (handleButtonError(3) == 0 && handleFlipError(player) == 0){
      await fetch(`http://localhost:5000/api/${player.id}/flip`);
      for (let i = 0; i < 4; ++i){
        console.log(`Player ${i+1}: ${gameState.players[i].token}`)
      }
    }
  };
  
  return (
    <img 
    className='token'
    src={`assets/cards/${t}.jpg`}
    onClick={() => Flip(player.id)}
    ></img>
  )
}

function PlayerBoard({ player }) {
  return (
    <div className="player-board-container" id={`player-board-${player["id"]}`}>
      <div className="player-board-wrapper">
        
        <div className="player-board">
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
                src={`assets/cards/51.jpg`}
                alt={`Card back}`}
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
          <div className="stat-item">Speculate: {displaySpeculate(player["speculate"])}</div>

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
      <Token key={player.id} player={player}></Token>
    </div>
  );
}

  //code to run
  if (!gameState) return <p>Loading...</p>;


 return (
  <>
  <div className='state-header'>
    <div>Phase: {displayPhase(gameState.phase)}</div>
    {gameState.phase != 1 && (<div>Turn: Player {gameState.current_turn}</div>)}
  </div>
  <div className="game-container" id="game-container">

    <PlayerBoard key="1" player={gameState.players[0]}/>
    <PlayerBoard key="2" player={gameState.players[1]}/>
    <div className="market-container" id = "market-container">
      <Market market={gameState.market} />
    </div>
    <PlayerBoard key="3" player={gameState.players[3]}/>
    <PlayerBoard key="4" player={gameState.players[2]}/>




  </div>
  
    {popupText !== null && ( //error popup
      <div
        onClick={() => setPopupText(null)} // click anywhere to close zoom

        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.8)', // semi-transparent black
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          cursor: 'zoom-out'
        }}
      >
        <div className='popup-box'> {popupText}</div>'
      </div>
    )}

    {zoomedCardIndex !== null && ( //card zoom
      <div
        onClick={() => setZoomedCardIndex(null)} // click anywhere to close zoom

        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.8)', // semi-transparent black
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          cursor: 'zoom-out'
        }}
      >
        <img
          src={`assets/cards/${zoomedCardIndex}.jpg`} // big card image
          alt={`Card ${zoomedCardIndex}`}
          style={{
            maxWidth: '90vw',
            maxHeight: '90vh',
            boxShadow: '0 0 20px white',
            borderRadius: 8,
          }}
        />
      </div>
    )}



    

  </>
);

  
  




    



}


export default App;
