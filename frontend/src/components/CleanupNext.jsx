import React from 'react';
function CleanupNext({ phase }) {
  const handleCleanup = async () => {
  const response = await fetch(`http://localhost:5000/api/cleanup`, {
          method: 'POST'
    });

    const result = await response.json();
    console.log(result);
};
  const displayCleanup = (phase) => {
    if (phase  == 3){
      return "Clear boards and player stats"
    }
    else if (phase == 4){
      return "Draw cards"
    }
    else if (phase == 5) {
      return "Cycle Market"
    }
    else{
      return "Start next round"
    }
  };
  return (
    phase >= 3 && 
  (<button onClick={() =>  handleCleanup()}>{displayCleanup(phase)}</button>)
)
  
}
export default CleanupNext;
