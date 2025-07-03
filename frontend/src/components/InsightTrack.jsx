function InsightTrack ({player, insightFunctions}){
    return (
        <img
                key={index}
                src={`assets/tracks/Insight Track.png`}
                alt={`Talisman ${card}`}
                onContextMenu={(e) => handleRightClick(e, card)}
              />
        
    )
}
export default InsightTrack;