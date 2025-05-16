import { useEffect, useState } from 'react';

function App() {
  const [gameState, setGameState] = useState(null);
  const [zoomedCardIndex, setZoomedCardIndex] = useState(null);

  const fetchState = async () => {
    const res = await fetch("http://localhost:5000/api/state");
    const data = await res.json();
    setGameState(data);
  };


  useEffect(() => {
    fetchState();
    const interval = setInterval(fetchState, 2000); // Polling every 2 seconds
    return () => clearInterval(interval);
  }, []);

  


const gameContainer = document.getElementById('game-container');

const handleRightClick = (e, cardIndex) => {
    e.preventDefault(); 
    setZoomedCardIndex(cardIndex); 
  };

function Market({ market }){
  return (
    <div className="market-container" id="market">
      <div className="market-row" id="market-row-1">
          <img
            className="card"
            src={`assets/cards/${market[0]}.jpg`}
            alt={`Card ${market[0]}`}
            onContextMenu={(e) => handleRightClick(e, market[0])} 
          />
          <img
            className="card"
            src={`assets/cards/${market[1]}.jpg`}
            alt={`Card ${market[1]}`}
            onContextMenu={(e) => handleRightClick(e, market[1])} 
          />
          <img
            className="card"
            src={`assets/cards/${market[2]}.jpg`}
            alt={`Card ${market[2]}`}
            onContextMenu={(e) => handleRightClick(e, market[2])} 
          />
          <img
            className="card"
            src={`assets/cards/${market[3]}.jpg`}
            alt={`Card ${market[3]}`}
            onContextMenu={(e) => handleRightClick(e, market[3])} 
          />
      </div>
      <div className="market-row" id="market-row-2">
          <img
            className="card"
            src={`assets/cards/${market[4]}.jpg`}
            alt={`Card ${market[4]}`}
            onContextMenu={(e) => handleRightClick(e, market[4])} 
          />
          <img
            className="card"
            src={`assets/cards/${market[5]}.jpg`}
            alt={`Card ${market[5]}`}
            onContextMenu={(e) => handleRightClick(e, market[5])} 
          />
          <img
            className="card"
            src={`assets/cards/${market[6]}.jpg`}
            alt={`Card ${market[6]}`}
            onContextMenu={(e) => handleRightClick(e, market[6])} 
          />
          <img
            className="card"
            src={`assets/cards/${market[7]}.jpg`}
            alt={`Card ${market[7]}`}
            onContextMenu={(e) => handleRightClick(e, market[7])} 
          />
      </div>


      
    </div>
  )
}

function PlayerBoard({ player }) {
  return (
    <div className="player-board-container" id={`player-board-${player["id"]}`}>
      <div className="player-board-wrapper">
        <div className="player-board">
          <img
            className={`player-mat ${player["id"] === 1 || player["id"] === 2 ? 'upside-down' : ''}`}

            src={player["board"]}
            alt={`Player ${player["id"]} board`}
          />
        </div>

        <div className={`stats-list ${player["id"] === 1 || player["id"] === 3 ? 'left-side' : ''}`}>
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
          />
        ))}
      </div>
    </div>
  );
}

  //code to run
  if (!gameState) return <p>Loading...</p>;

console.log(gameState.players[0]["hand"])

 return (
  <>
  <div className="game-container" id="game-container">

    <PlayerBoard key="1" player={gameState.players[0]}/>
    <PlayerBoard key="2" player={gameState.players[1]}/>
    <div className="market-container" id = "market-container">
      <Market market={gameState.market} />
    </div>
    <PlayerBoard key="3" player={gameState.players[2]}/>
    <PlayerBoard key="4" player={gameState.players[3]}/>




  </div>
  
 

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
