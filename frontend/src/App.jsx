import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client'; 

import ChoiceComp from './components/ChoiceComp';
import PlayerBoard from './components/PlayerBoard';
import Market from './components/Market';
import TrinketSlots from './components/TrinketSlots';
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
  const [promptQueue, setPromptQueue] = useState([]);
  const [isText, setIsText] = useState(null)
  const resolvePromiseRef = useRef(null); // Use a ref to store the resolve function









  const socket = io('http://localhost:5000', {
    transports: ['websocket'],  
  });

const resolveChoice = (choice) => {
  setChoices([])
  // setSelectedChoice(choice)
  resolvePromiseRef.current(choice);
  console.log(`Choice successfully selected: ${choice}`)
}

  const promptPlayerToChooseTrinket = (player) => {

  }
  const promptPlayerToChooseAmulet = (player) => {
    
  }
  const promptPlayerToChooseCloak = (player) => {
    setChoices([57, 58, 59, 60, 61])
    setIsText(false)
    return new Promise((resolve) => {
      resolvePromiseRef.current = resolve; 

    });
  }
  const promptPlayerToBuy = (player) => {
    setChoices([
      `Player ${player + 1} buy`,
      `Player ${player + 1} do not buy`
    ])
    setIsText(true)
    return new Promise((resolve) => {
      resolvePromiseRef.current = resolve; 

    });
  };
  const promptPlayerToRemoveSpec = (player) => {
    setChoices([
      `Player ${player} remove speculate token`,
      `Player ${player} do not remove speculate token`
    ])
    setIsText(true)
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
      if (isGameOver()){
        setPopupText("Game is over")
      }
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
      // setPromptQueue(newGameState.promptQueue)
      // console.log(`Prompt queue set. Queue: ${promptQueue}`)
      // fetch(`http://localhost:5000/api/clearpromptqueue`, {method: `POST`})
      // handlePromptQueue()

    });
  

    return () => {
      socket.off('game_update');  // Clean up on unmount
    };
  }, []);


  useEffect(() => {
    if (!gameState) return; 

    const iteratePrompt = async () =>{
      let size = gameState.promptQueue.length
      if (size > 0){
        let prompt = gameState.promptQueue[size-1]
        fetch(`http://localhost:5000/api/poppromptqueue`, {method: `POST`})
        let result = await resolvePrompt(prompt)
        
      }

    }
    iteratePrompt()
  }, [gameState?.promptQueue])

const handlePromptQueue = () =>{
  console.log (`Prompt Queue length: ${promptQueue.length}`)
  console.log("Attempting to handle prompt queue")
  while (promptQueue.length > 0){
      let prompt = popPromptQueue()
      console.log(`Handling prompt: ${prompt}`)
      resolvePrompt(prompt)
    }
}

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

const isGameOver = () =>{
  return (gameState.players[0].hp <= 0 && gameState.players[1].hp <=0) || (gameState.players[2].hp <= 0 && gameState.players[3].hp <=0)
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


const MightFunctions = {
  handleRightClick,

}
const resolvePrompt = async (prompt) =>{
  console.log(`Attempting to resolve prompt`)
  console.log(`Prompt code: ${prompt.code}`)
  console.log(`Prompt player: ${prompt.player}`)
  if (prompt.code > 100 && prompt.code < 200){
    if (prompt.code == 101 || prompt.code == 102){
      let choice = await promptPlayerToChooseCloak(prompt.player)
      handleCloak(prompt.player, choice)
    }
  }
}

const handleCloak = async (player, choice) =>{
  let cloak = 57 + choice

  const response = await fetch(`http://localhost:5000/api/cloak/${player}/${cloak}`, {
            method: 'POST'

      });
  console.log(response)
  
}

 return (
  <>
  <div className='state-header'>
    <div>Phase: {displayPhase(gameState.phase)}</div>
    {(gameState.phase != 1 && gameState.phase != 3) && (<div>Turn: Player {gameState.current_turn}</div>)}
  </div>
  <div className="game-container" id="game-container">

    <div className="player-row top-player-row">
    <PlayerBoard key="1" player={gameState.players[0]} Pfunctions={PlayerBoardFunctions} Tfunctions={TokenFunctions} gameState={gameState} MightFunctions={MightFunctions} />
    <PlayerBoard key="2" player={gameState.players[1]} Pfunctions={PlayerBoardFunctions} Tfunctions={TokenFunctions} gameState={gameState} MightFunctions={MightFunctions}/>
    <TrinketSlots key="1-trinket" team="1" gameState={gameState} handleRightClick={handleRightClick}/>

  </div>

  <Market market={gameState.market} functions={MarketFunctions} gameState={gameState}/>
  <CleanupNext key="CleanupButton" phase ={gameState.phase}/>

  <div className="player-row bottom-player-row">
    <PlayerBoard key="3" player={gameState.players[3]} Pfunctions={PlayerBoardFunctions} Tfunctions={TokenFunctions} gameState={gameState} MightFunctions={MightFunctions}/>
    <PlayerBoard key="4" player={gameState.players[2]} Pfunctions={PlayerBoardFunctions} Tfunctions={TokenFunctions} gameState={gameState} MightFunctions={MightFunctions}/>
    <TrinketSlots key="2-trinket" team="2" gameState={gameState} handleRightClick={handleRightClick}/>

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
    {choices.length > 0 && <ChoiceComp choicesSet={choices} onSelectChoice={resolveChoice} isText={isText} handleRightClick={handleRightClick} />}
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
