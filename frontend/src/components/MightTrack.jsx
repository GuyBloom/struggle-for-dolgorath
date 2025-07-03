function MightTrack ({player, mightFunctions}){
        const {handleRightClick} = mightFunctions;

    return (
        <div className="track-container">
            <img
                className="track"
                src={`assets/tracks/Might Track.png`}
                onContextMenu={(e) => handleRightClick(e, "Might Track")}
              />
            {player.might >= 10 &&
            <img
                className="track-overlay track-10"
                src={`assets/tracks/check.png`}
            />
            }
            {player.might >= 20 &&
            <img
                className="track-overlay track-20"
                src={`assets/tracks/check.png`}
            />
            }
            {player.might >= 30 &&
            <img
                className="track-overlay track-30"
                src={`assets/tracks/check.png`}
            />
            }
            {player.might >= 40 &&
            <img
                className="track-overlay track-40"
                src={`assets/tracks/check.png`}
            />
            }
        </div>
        
        
    )
}
export default MightTrack;