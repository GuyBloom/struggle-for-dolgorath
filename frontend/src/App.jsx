import { useEffect, useState } from 'react';

function App() {
  const [gameState, setGameState] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);  // State to track the selected card

  const fetchState = async () => {
    const res = await fetch("http://localhost:5000/api/state");
    const data = await res.json();
    setGameState(data);
  };

  const drawCard = async (playerId) => {
    await fetch(`http://localhost:5000/api/draw/${playerId}`);
    fetchState();
  };

  const playCard = async (playerId, cardIndex) => {
    await fetch(`http://localhost:5000/api/play/${playerId}/${cardIndex}`);
    fetchState();
    setSelectedCard(null); // Reset selection after play
  };

  useEffect(() => {
    fetchState();
    const interval = setInterval(fetchState, 2000); // Polling every 2 seconds
    return () => clearInterval(interval);
  }, []);

  if (!gameState) return <p>Loading...</p>;

  return (
    <div className="p-4 text-center">
      <h1 className="text-xl font-bold mb-4">Turn-Based Card Game</h1>
      <p>Current Turn: Player {gameState.current_turn + 1}</p>
      <div className="grid grid-cols-2 gap-4 mt-4">
        {Object.entries(gameState.hands).map(([pid, hand]) => (
          <div key={pid} className="border p-2">
            <h2>Player {+pid + 1}</h2>
            {+pid === gameState.current_turn ? (
              <>
                <p>Your Turn!</p>
               
                <div className="mt-2 flex flex-row space-x-2 justify-center overflow-x-auto">
                  {/* Flex container for horizontal layout */}
                  {hand.map((card, i) => (
                    <div
                      key={i}
                      className={`m-1 p-1 ${
                        selectedCard === i ? 'bg-green-200' : ''
                      }`} // Highlight selected card
                      onClick={() => playCard(+pid, i)}
                      onMouseEnter={() => setSelectedCard(i)} // Hover to select
                      onMouseLeave={() => setSelectedCard(null)} // Remove selection on hover out
                    >
                      <img
                        src={card.image}
                        className="w-20 h-28 cursor-pointer"
                        alt={`${card.value} of ${card.suit}`}
                      />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p>Waiting for Player {gameState.current_turn + 1}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
