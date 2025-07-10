function TrinketSlots({team, gameState, handleRightClick}){ //team 1 = top, purple and blue. team 2 = bottom, yellow and green
    let playerA, playerB
    if (team == 1){
        playerA = gameState.players[0]
        playerB = gameState.players[1]
    }
    else if (team == 2){
        playerA = gameState.players[3]
        playerB = gameState.players[2]
    }
    return(
        <div className='trinkets-row'>
           { playerA.trinkets.length > 0 && (
             <img
              key="1"
              className="card"
              src={`assets/cards/${playerA.trinkets[0]}.jpg`}
              alt={`Trinket 1`}
              onContextMenu={(e) => handleRightClick(e, playerA.trinkets[0])} 
            />
           )}
           { playerA.trinkets.length == 0 && (
             <img
                key="2"
             className="card"
              src={`assets/cards/${98 + 6 * (team-1)}.jpg`}
              alt={`Trinket 1`}
              onContextMenu={(e) => handleRightClick(e, 98 + 6 * (team-1))} 
            />
           )}
           { playerA.trinkets.length > 1 && (
             <img
                key="3"

              className="card"
              src={`assets/cards/${playerA.trinkets[1]}.jpg`}
              alt={`Trinket 2`}
              onContextMenu={(e) => handleRightClick(e, playerA.trinkets[1])} 
            />
           )}
           { playerA.trinkets.length <= 1 && (
             <img
              key="4"
              className="card"
              src={`assets/cards/${99 + 6 * (team-1)}.jpg`}
              alt={`Trinket 2`}
              onContextMenu={(e) => handleRightClick(e, 99 + 6 * (team-1))} 
            />
           )}
            { playerA.trinkets.length > 2 && (
             <img
                key="5"

              className="card"
              src={`assets/cards/${playerA.trinkets[2]}.jpg`}
              alt={`Trinket 3`}
              onContextMenu={(e) => handleRightClick(e, playerA.trinkets[2])} 
            />
           )}
           { playerA.trinkets.length <= 2 && (
             <img
              key="6"

              className="card"
              src={`assets/cards/${100 + 6 * (team-1)}.jpg`}
              alt={`Trinket 3`}
              onContextMenu={(e) => handleRightClick(e, 100 + 6 * (team-1))} 
            />
           )}


           

           { playerB.trinkets.length > 0 && ( //player B row
             <img
                key="7"

              className="card"
              src={`assets/cards/${playerB.trinkets[0]}.jpg`}
              alt={`Trinket 1`}
              onContextMenu={(e) => handleRightClick(e, playerB.trinkets[0])} 
            />
           )}
           { playerB.trinkets.length == 0 && (

             <img
                key="8"

              className="card"
              src={`assets/cards/${101 + 6 * (team-1)}.jpg`}
              alt={`Trinket 1`}
              onContextMenu={(e) => handleRightClick(e, 101 + 6 * (team-1))} 
            />
           )}
           { playerB.trinkets.length > 1 && (
             <img
                             key="9"

              className="card"
              src={`assets/cards/${playerB.trinkets[1]}.jpg`}
              alt={`Trinket 1`}
              onContextMenu={(e) => handleRightClick(e, playerB.trinkets[1])} 
            />
           )}
           { playerB.trinkets.length <= 1 && (
             <img
                             key="10"

              className="card"
              src={`assets/cards/${102 + 6 * (team-1)}.jpg`}
              alt={`Trinket 1`}
              onContextMenu={(e) => handleRightClick(e, 102 + 6 * (team-1))} 
            />
           )}
            { playerB.trinkets.length > 2 && (
             <img
                             key="11"

              className="card"
              src={`assets/cards/${playerB.trinkets[2]}.jpg`}
              alt={`Trinket 1`}
              onContextMenu={(e) => handleRightClick(e, playerB.trinkets[2])} 
            />
           )}
           { playerB.trinkets.length <= 2 && (
             <img
                             key="12"

              className="card"
              src={`assets/cards/${103 + 6 * (team-1)}.jpg`}
              alt={`Trinket 1`}
              onContextMenu={(e) => handleRightClick(e, 103 + 6 * (team-1))} 
            />
           )}
        </div>
    )
}

export default TrinketSlots;