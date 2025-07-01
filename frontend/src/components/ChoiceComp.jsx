import React from 'react';
function ChoiceComp( {choicesSet, onSelectChoice, isText, handleRightClick}) {
 return (
  choicesSet.length > 0 && ( //choices
      <div

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
        {isText && choicesSet.map((choice, index) =>
            <button key={index} onClick={() => onSelectChoice(index)}>{choice}</button>
            
        )}
        {!isText && choicesSet.map((choice, index) =>
            <img className="card-choice" 
            src={`assets/cards/${choice}.jpg`}
            key={index} 
            onClick={() => onSelectChoice(index)}
            onContextMenu={(e) => handleRightClick(e, card)}

            >
            
            </img>

        )}
      </div>
    )
 )
}
export default ChoiceComp;

