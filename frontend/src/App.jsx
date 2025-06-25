import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client'; 

import ChoiceComp from './components/ChoiceComp';
import PlayerBoard from './components/PlayerBoard';
import Market from './components/Market';
// import Token from './components/Token';
import CleanupNext from './components/CleanupNext';
// const [choices, setChoices] = useState([]); // Choices to display

// const useChoice = () => {
  
  // const [selectedChoice, setSelectedChoice] = useState(null); // Track the selected choice
  // const [isChoiceMade, setIsChoiceMade] = useState(false)
  // Function to set the choices and reset the state
  // const setChoiceOptions = (options) => {
  //   setChoices(options);
  //   setSelectedChoice(null); // Reset choice
  //   setIsChoiceMade(false);  // Reset waiting state
  // };

  // Function to handle user selection
  // const handleChoice = (index) => {
  //   setSelectedChoice(index); // Set the selected index (1-based index)
  //   setIsChoiceMade(true); // Mark the choice as made
  //   setChoices([])
  // };

  // // Return functions and state for use in your components
  // return {handleChoice, setChoices, isChoiceMade, choices, selectedChoice };
// };



// function ChoiceComp( {choicesSet, onSelectChoice}) {
//  return (
//   choicesSet.length > 0 && ( //choices
//       <div

//         style={{
//           position: 'fixed',
//           top: 0, left: 0,
//           width: '100vw',
//           height: '100vh',
//           backgroundColor: 'rgba(0, 0, 0, 0.8)', 
//           display: 'flex',
//           justifyContent: 'center',
//           alignItems: 'center',
//           zIndex: 1000,
//           cursor: 'zoom-out'
//         }}
//       >
//         {choicesSet.map((choice, index) =>
//             <button key={index} onClick={() => onSelectChoice(index)}>{choice}</button>
            
//         )}
//       </div>
//     )
//  )
// }

function App() {
  const [gameState, setGameState] = useState(null);
  const [zoomedCardIndex, setZoomedCardIndex] = useState(null);
  const [popupText, setPopupText] = useState(null);
  const [choices, setChoices] = useState([]); // Choices to display
  // const [selectedChoice, setSelectedChoice] = useState(null); // Track the selected choice
  // const [isChoiceMade, setIsChoiceMade] = useState(false)
  const resolvePromiseRef = useRef(null); // Use a ref to store the resolve function




  // const { setChoiceOptions, setChoices, setSelectedChoice, handleChoice, isChoiceMade, choices, getChoice } = useChoice();





  const socket = io('http://localhost:5000', {
    transports: ['websocket'],  
  });

const resolveChoice = (choice) => {
  setChoices([])
  // setSelectedChoice(choice)
  resolvePromiseRef.current(choice);
  console.log(`Choice successfully selected: ${choice}`)
}


  const promptPlayerToBuy = (player) => {
    setChoices([
      `Player ${player + 1} buy`,
      `Player ${player + 1} do not buy`
    ])
    return new Promise((resolve) => {
      resolvePromiseRef.current = resolve; 

    });
  };
  const promptPlayerToRemoveSpec = (player) => {
    setChoices([
      `Player ${player} remove speculate token`,
      `Player ${player} do not remove speculate token`
    ])
    return new Promise((resolve) => {
      resolvePromiseRef.current = resolve; 

    });
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

  


  const handlePlayCard = async (player, index) => {
    if (gameState.players[player-1].token == 1 && gameState.phase == 1){
      setPopupText("You have already flipped your token")
    }
    else if (handleButtonError(2) == 0){
      const response = await fetch(`http://localhost:5000/api/play/${player}/${index}`, {
            method: 'POST'

      });
      console.log(response)
    }
    
  }
  
  const handleDamage = async (player) =>{
    if (gameState.phase !== 2){
      setPopupText("You can only do damage in the action phase")
    }
    else if(gameState.current_turn != player){
      setPopupText("You can only do damage during your turn")
    }
    else if (gameState.players[gameState.current_turn -1].damage == 0){
      setPopupText("You have no damage")
    }
    else {
      const response = await fetch(`http://localhost:5000/api/damage/${player}`, {
          method: 'POST'
      });
      const result = await response.json();
      console.log(result);
    }
  }
  const handleTap = async (player, index) =>{
    if (gameState.players[player-1].token == 1 && gameState.phase == 1){
      setPopupText("You have already flipped your token")
    }
    else if (gameState.players[player-1].tapped[index] == 1){
      setPopupText("You cannot tap your talisman twice in the same turn")
    }
    else if (gameState.phase == 0){
      setPopupText("You cannot tap your talisman in the speculate phase")
    }
    else if (gameState.phase == 2 && gameState.current_turn !== player){
      setPopupText("It is not your turn")
    }
    else if (gameState.players[player - 1]["coins"] < 1){
      setPopupText("You do not have enough coins to tap")
    }
    else {
      const response = await fetch(`http://localhost:5000/api/tap/${player}/${index}`, {
          method: 'POST'
      }); // 0 = damage, 1 = health, 2 = insight, 3 = might
      const result = await response.json();
      console.log(result);
    }
    
    
    
  }
    

  useEffect(() => {
    socket.on('connect', () => {
    console.log('Connected to WebSocket server');
  });
    socket.on('game_update', (newGameState) => {
      setGameState(newGameState);  // Update the game state on the frontend
    });

    return () => {
      socket.off('game_update');  // Clean up on unmount
    };
  }, []);

  


const gameContainer = document.getElementById('game-container');

const handleRightClick = (e, cardIndex) => {
    e.preventDefault(); 
    setZoomedCardIndex(cardIndex); 
  };



const handleButtonError = (buttonType) => { //0 = speculate, 1 = purchase, 2 = playerCard, 3 = token, 4 = talisman
  if (buttonType == 0 && gameState.phase == 1){
      setPopupText("You cannot speculate during the play phase")
      return 1;
    }  
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
const vsFromPlayer = (player) =>{
  if (player == 1 || player == 2){
    return [3, 4]
  }
  else{
    return [1, 2]
  }
}
const blockedSpec = (playerSpeculating) =>{
  let ps = gameState.players[playerSpeculating-1]
  let otherTeam = vsFromPlayer(playerSpeculating)
  for (let i = 0; i < otherTeam.length; ++i){
    let player = gameState.players[otherTeam[i]-1]
    if (player.insight >= ps.insight && player.token == 0){
      return true
    }
  }
  return false
  
}
const handleSpeculate = async (card) => {
  let currSpec = getSpecFromPlayer(gameState.current_turn)
  if (currSpec[0] != -1){
    setPopupText("You are already speculating")
  }
  else if (gameState.phase == 2 && blockedSpec(gameState.current_turn)){
    setPopupText("A player with equal or higher insight has already flipped")
  }
  else{
      
      const response = await fetch(`http://localhost:5000/api/speculate/${card}`, {
      method: 'POST',  
  });
  const result = await response.json();
  console.log(result);
  for (let i = 0; i < 4; ++i){
        console.log(`Player ${i + 1} hasSpec: ${gameState.players[i].hasSpec}`)
      }
  }
  

  
};
const specsFromIndex = (index) => {
  if (index < 4){
    return gameState.market.specs1[index]
  }
  else{
    return gameState.market.specs2[index-4]
  }
}
const isSpeculating = (player, card) => {
  let specs = specsFromIndex(card)
  for (let i = 0; i < specs.length; ++i){
    if (specs[i] == player-1) return 1
  }
  return 0

  // if (card < 3){
  //   for (let i = 0; i < gameState.market.specs1[card].length; ++i){
  //     if (gameState.market.specs1[card][i] == player-1) return 1
  //   }
  //   return 0
  // }
  //   for (let i = 0; i < gameState.market.specs2[card-4].length; ++i){
  //     if (gameState.market.specs2[card-4][i] == player-1) return 1
  //   }
  //   return 0
}




const handlePurchase = async (card) => {
  let cost = 3 //will change
  let specs = specsFromIndex(card)
  let canBuy = true
  console.log(specs)

  if (gameState.players[gameState.current_turn - 1]["coins"] < cost){
    setPopupText("You do not have enough coins to buy this")
  }
  else {
    for (let i = 0; i < specs.length; i++) {
      console.log(`Checking player ${specs[i] + 1}`)
      if (specs[i] + 1 == gameState.current_turn) break;
      if (gameState.players[specs[i]].coins >= cost -1){
          conxsole.log(`Prompting player ${specs[i] + 1} to buy`)

        let currChoice = await promptPlayerToBuy(specs[i]);
        console.log(`handlePurchase recieves: selected choice: ${currChoice}`)
        if (currChoice === 0) { // see if any player wants to buy
          console.log(`Player ${specs[i] + 1} decides to buy`);
          const response = await fetch(`http://localhost:5000/api/purchase/${specs[i]+1}/${card}/${cost}`, {
            method: 'POST'
          });
          canBuy = false
          break;
        }
      }
    }
  }
  

  
  if (canBuy){
    const response = await fetch(`http://localhost:5000/api/purchase/${gameState.current_turn}/${card}/${cost}`, {
          method: 'POST'
    });

    const result = await response.json();
    console.log(result);
  }
  
};







// function CleanupNext({ phase }) {
//   const handleCleanup = async () => {
//   const response = await fetch(`http://localhost:5000/api/cleanup`, {
//           method: 'POST'
//     });

//     const result = await response.json();
//     console.log(result);
// };
//   const displayCleanup = (phase) => {
//     if (phase  == 3){
//       return "Clear boards and player stats"
//     }
//     else if (phase == 4){
//       return "Draw cards"
//     }
//     else if (phase == 5) {
//       return "Cycle Market"
//     }
//     else{
//       return "Start next round"
//     }
//   };
//   return (
//     phase >= 3 && 
//   (<button onClick={() =>  handleCleanup()}>{displayCleanup(phase)}</button>)
// )
  
// }

// function Market({ market }) {
//   return (
//     <div className="market-container" id="market">
//       <div className='deck-container'>

//       </div>
//       <div className='deck-container'>
//               <div className='deck-header'>
//                 {gameState.market_deck.length}
//               </div>
//               {market.length > 0 && (
//                 <img
//                 className="card"
//                 src={`assets/cards/51.jpg`}
//                 alt={`Card back}`}
//               />
//               )}
            
//             </div>
//       <div className="market-row">
//         {market.cards1.map((card, index) => ( 
//           <div className='market-card-wrapper' key={index}>
//             <div className='market-card-container' key={index}>
//             <img
//               key={index}
//               className="card"
//               src={`assets/cards/${card}.jpg`}
//               alt={`Card ${card}`}
//               onContextMenu={(e) => handleRightClick(e, card)} 
//             />
//              {/* Token 1 - Top Left */}
//             {market.specs1[index].length > 0 && <img
//               className="token-overlay token-top-left"
//               src={`assets/player-tokens/${market.specs1[index][0] + 1}-spec.png`}
//               alt="Token 1"
//             />}

//             {/* Token 2 - Top Right */}
//             {market.specs1[index].length > 1 && <img
//               className="token-overlay token-top-right"
//               src={`assets/player-tokens/${market.specs1[index][1] + 1}-spec.png`}
//               alt="Token 2"
//             />}

//             {/* Token 3 - Bottom Left */}
//             {market.specs1[index].length > 2 && <img
//               className="token-overlay token-bottom-left"
//               src={`assets/player-tokens/${market.specs1[index][2] + 1}-spec.png`}
//               alt="Token 3"
//             />}

//             {/* Token 4 - Bottom Right */}
//             {market.specs1[index].length > 3 && <img
//               className="token-overlay token-bottom-right"
//               src={`assets/player-tokens/${market.specs1[index][3] + 1}-spec.png`}
//               alt="Token 4"
//             />}
//             </div>
//             <div className='market-buttons'>
//               {card !== 97 && (
//                 <>
//                   <button onClick={() => handleButtonPress(0, index)}>Speculate</button>
//                   <button onClick={() => handleButtonPress(1, index)}>Purchase</button>
//                 </>
//               )}
//             </div>
            
//           </div>
//         ))}
//       </div>

//       <div className="market-row">
//         {market.cards2.map((card, index) => (  // Next 4 cards
//           <div className='market-card-wrapper' key ={index+4}>
//                         <div className='market-card-container' key={index}>
//             <img
//               key={index}
//               className="card"
//               src={`assets/cards/${card}.jpg`}
//               alt={`Card ${card}`}
//               onContextMenu={(e) => handleRightClick(e, card)} 
//             />
//              {/* Token 1 - Top Left */}
//             {market.specs2[index].length > 0 && <img
//               className="token-overlay token-top-left"
//               src={`assets/player-tokens/${market.specs2[index][0] + 1}-spec.png`}
//               alt="Token 1"
//             />}

//             {/* Token 2 - Top Right */}
//             {market.specs2[index].length > 1 && <img
//               className="token-overlay token-top-right"
//               src={`assets/player-tokens/${market.specs2[index][1] + 1}-spec.png`}
//               alt="Token 2"
//             />}

//             {/* Token 3 - Bottom Left */}
//             {market.specs2[index].length > 2 && <img
//               className="token-overlay token-bottom-left"
//               src={`assets/player-tokens/${market.specs2[index][2] + 1}-spec.png`}
//               alt="Token 3"
//             />}

//             {/* Token 4 - Bottom Right */}
//             {market.specs2[index].length > 3 && <img
//               className="token-overlay token-bottom-right"
//               src={`assets/player-tokens/${market.specs2[index][3] + 1}-spec.png`}
//               alt="Token 4"
//             />}
//             </div>
//             <div className='market-buttons'>
//               {card !== 97 && (
//                 <>
//                   <button onClick={() => handleButtonPress(0, index+4)}>Speculate</button>
//                   <button onClick={() => handleButtonPress(1, index+4)}>Purchase</button>
//                 </>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
//       <div className='market-row'>
//             <button onClick={() => handleButtonPress(0, 8)}>Decline to Speculate</button>
//       </div>
//     </div>
//   );
// }
const getSpecFromPlayer = (player) => {
    for (let i = 0; i < 8; ++i){
      let specs = specsFromIndex(i)
      for (let j = 0; j < specs.length; ++j){
        if (specs[j] + 1 == player)
          return [i, j]
      }
    }
    return [-1, -1]
  }





// function Token ( {player} ){
//   const [t, setT] = useState(`${player.id}-passed`);
//   useEffect(() => {
//     if (player.token === 0) {
//       setT(`${player.id}-passed`); 
//     } else if (player.token === 1) {
//       setT(`${player.id}-ready`); 
//     }
//   }, [player.token]); 

  
//   const handleFlipError = (player) => {

//     if (gameState.phase == 1) return 0
//     if (gameState.current_turn == player) return 0
      
//     setPopupText("You cannot flip when it is not your turn")
//     return 1
//   }
//   const Flip = async (player) => {

//     let spec = getSpecFromPlayer(player)
    
    
//     if (handleButtonError(3) == 0 && handleFlipError(player) == 0){
//       if (gameState.phase == 2 && spec[0] != -1){
//       console.log(`Player ${player} is speculating on position ${spec}. Asking to remove`)
//       let unspec = await promptPlayerToRemoveSpec(player)
//         if (unspec == 0){
//           console.log(`Specs before remove: ${specsFromIndex(spec[0])}`)

//           await fetch(`http://localhost:5000/api/removespec/${spec[0]}/${spec[1]}`, {
//             method: 'POST'});
//           console.log(`Specs after remove: ${specsFromIndex(spec[0])}`)

//         }
      
//     }



//       await fetch(`http://localhost:5000/api/${player}/flip`, {
//             method: 'POST'

//       });
//       for (let i = 0; i < 4; ++i){
//         console.log(`Player ${i+1}: ${gameState.players[i].token}`)
        
//       }
//     }
//   };
  
//   return (
//     <img 
//     className='token'
//     src={`assets/player-tokens/${t}.jpg`}
//     onClick={() => Flip(player.id)}
//     ></img>
//   )
// }

// function PlayerBoard({ player }) {
//   return (
//     <div className="player-board-container" id={`player-board-${player["id"]}`}>
//       <div className="player-board-wrapper">
        
//         <div className="player-board">
//           <div className='talisman-container'>
//               {player.talismans.map((card, index) => (
                
//               <img
//                 key={index}
//                 className="card"
//                 src={`assets/cards/${card}.jpg`}
//                 alt={`Talisman ${card}`}
//                 onContextMenu={(e) => handleRightClick(e, card)}
//                 onClick={() => handleTap(player.id, index)}
//               />
//             ))}
//         </div>
//           {/* <img
//             className={`player-mat ${player["id"] === 1 || player["id"] === 2 ? 'upside-down' : ''}`}

//             src={player["board"]}
//             alt={`Player ${player["id"]} board`}
//           /> */}


          
//           <div className='discard-deck-row'>
//             <div className='deck-container'>
//               <div className='deck-header'>
//                 {player.discard.length}
//               </div>
//               {player.discard.length > 0 && (
//                 <img
//                 className="card"
//                 src={`assets/cards/${player.discard[player.discard.length-1]}.jpg`}
//                 alt={`Card back}`}
//                 onContextMenu={(e) => handleRightClick(e, player.discard[player.discard.length-1])}

//               />
//               )}
//               {player.discard.length == 0 && (
//                 <img
//                 className="card"
//                 src={`assets/cards/92.jpg`}
//                 alt={`Card back}`}
//               />
//               )}
//             </div>
//             <div className='token first-turn'>
//               {}
//             </div>
//             <div className='deck-container'>
//               <div className='deck-header'>
//                 {player.deck.length}
//               </div>
//               {player.deck.length > 0 && (
//                 <img
//                 className="card"
//                 src={`assets/cards/51.jpg`}
//                 alt={`Card back}`}
//               />
//               )}
//               {player.deck.length == 0 && (
//                 <img
//                 className="card"
//                 src={`assets/cards/93.jpg`}
//                 alt={`Card back}`}
//               />
//               )}
//             </div>
//           </div>
//         </div>
        
//         <div className='play-container'>
//             {player.played.map((card, index) => (
//               <img
//                 key={index}
//                 className="card"
//                 src={`assets/cards/${card}.jpg`}
//                 alt={`Card ${card}`}
//                 onContextMenu={(e) => handleRightClick(e, card)}
//               />
//             ))}
//           </div>
//         <div className={`stats-list ${player["id"] === 1 || player["id"] === 4 ? 'left-side' : ''}`}>
//           <div className="stat-item">Player {player["id"]}</div>
//           <div className="stat-item">Coins: {player["coins"]}</div>
//           <div className="stat-item">HP: {player["hp"]}</div>
//           <div className="stat-item">Shield: {player["shield"]}</div>
//           <div className="stat-item">Might: {player["might"]}</div>
//           <div className="stat-item">Insight: {player["insight"]}</div>
//           <div className="stat-item">DMG: {player["damage"]}</div>

//         </div>
//       </div>

//       <div className="hand-container">
//         {player.hand.map((card, index) => (
//           <img
//             key={index}
//             className="card"
//             src={`assets/cards/${card}.jpg`}
//             alt={`Card ${card}`}
//             onContextMenu={(e) => handleRightClick(e, card)}
//             onClick={() => handlePlayCard(player.id, index)} 
//           />
//         ))}
//       </div>
//       <Token key={player.id} player={player}></Token>
//       <button onClick={() => handleDamage(player.id)}>Damage</button>

//       <button></button>
//     </div>
//   );
// }

  //code to run
  if (!gameState) return <p>Loading...</p>;




const PlayerBoardFunctions = {
  handleRightClick,
  handlePlayCard,
  handleDamage,
  handleTap,
}


const TokenFunctions = {
  getSpecFromPlayer,
  setPopupText,
  handleButtonError,
  promptPlayerToRemoveSpec,
  specsFromIndex
}

const MarketFunctions = {
  handleRightClick,
  handleButtonPress
}
 return (
  <>
  <div className='state-header'>
    <div>Phase: {displayPhase(gameState.phase)}</div>
    {(gameState.phase != 1 && gameState.phase != 3) && (<div>Turn: Player {gameState.current_turn}</div>)}
  </div>
  <div className="game-container" id="game-container">

    <div className="player-row top-player-row">
    <PlayerBoard key="1" player={gameState.players[0]} Pfunctions={PlayerBoardFunctions} Tfunctions={TokenFunctions} gameState={gameState} />
    <PlayerBoard key="2" player={gameState.players[1]} Pfunctions={PlayerBoardFunctions} Tfunctions={TokenFunctions} gameState={gameState}/>
  </div>

  <Market market={gameState.market} functions={MarketFunctions} gameState={gameState}/>
  <CleanupNext key="CleanupButton" phase ={gameState.phase}/>

  <div className="player-row bottom-player-row">
    <PlayerBoard key="3" player={gameState.players[3]} Pfunctions={PlayerBoardFunctions} Tfunctions={TokenFunctions} gameState={gameState}/>
    <PlayerBoard key="4" player={gameState.players[2]} Pfunctions={PlayerBoardFunctions} Tfunctions={TokenFunctions} gameState={gameState}/>
  </div>





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
    {choices.length > 0 && <ChoiceComp choicesSet={choices} onSelectChoice={resolveChoice} />}
    {zoomedCardIndex !== null && (
      <div
        onClick={() => setZoomedCardIndex(null)} 
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.8)', 
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
