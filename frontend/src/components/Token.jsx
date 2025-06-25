import React, { useState, useEffect } from 'react';


function Token ( {player, functions, gameState} ){
  const { getSpecFromPlayer, setPopupText, handleButtonError, promptPlayerToRemoveSpec, specsFromIndex} = functions;
  const [t, setT] = useState(`${player.id}-passed`);
  useEffect(() => {
    if (player.token === 0) {
      setT(`${player.id}-passed`); 
    } else if (player.token === 1) {
      setT(`${player.id}-ready`); 
    }
  }, [player.token]); 

  
  const handleFlipError = (player) => {

    if (gameState.phase == 1) return 0
    if (gameState.current_turn == player) return 0
      
    setPopupText("You cannot flip when it is not your turn")
    return 1
  }
  const Flip = async (player) => {

    let spec = getSpecFromPlayer(player)
    
    
    if (handleButtonError(3) == 0 && handleFlipError(player) == 0){
      if (gameState.phase == 2 && spec[0] != -1){
      console.log(`Player ${player} is speculating on position ${spec}. Asking to remove`)
      let unspec = await promptPlayerToRemoveSpec(player)
        if (unspec == 0){
          console.log(`Specs before remove: ${specsFromIndex(spec[0])}`)

          await fetch(`http://localhost:5000/api/removespec/${spec[0]}/${spec[1]}`, {
            method: 'POST'});
          console.log(`Specs after remove: ${specsFromIndex(spec[0])}`)

        }
      
    }



      await fetch(`http://localhost:5000/api/${player}/flip`, {
            method: 'POST'

      });
      for (let i = 0; i < 4; ++i){
        console.log(`Player ${i+1}: ${gameState.players[i].token}`)
        
      }
    }
  };
  
  return (
    <img 
    className='token'
    src={`assets/player-tokens/${t}.jpg`}
    onClick={() => Flip(player.id)}
    ></img>
  )
}
export default Token;
