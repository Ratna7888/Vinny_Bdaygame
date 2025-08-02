import React, { useState, useEffect, useRef } from 'react';
import './TreasureHunt.css';
import { useBackgroundMusic } from '../hooks/useBackgroundMusic';

const treasures = {
  outfit: { clue: "Use a key to reveal the location of the outfit you created.", pos: { top: '40%', left: '25%' } },
  cheesecake: { clue: "Excellent! Now find the cheesecake you baked.", pos: { top: '60%', left: '50%' } },
  sword: { clue: "One left! Find the symbol of your inner strength.", pos: { top: '35%', right: '15%' } },
};

const finaleContainerStyle = {
  backgroundImage: `url("/images/treasure-background.png")`,
  backgroundSize: "cover",
  backgroundPosition: "center",
};

function TreasureHunt() {
  useBackgroundMusic('/sounds/music-treasure.mp3', true, 0.5);

  const [keys, setKeys] = useState(3);
  const [revealed, setRevealed] = useState({});
  const [foundItems, setFoundItems] = useState({});
  const [clue, setClue] = useState(treasures.outfit.clue);
  const [isComplete, setIsComplete] = useState(false);

  const [finalOutfit, setFinalOutfit] = useState(null);

  const buttonSoundRef = useRef(null);
  const foundSoundRef = useRef(null);

  useEffect(() => {
    const savedOutfit = sessionStorage.getItem('finalOutfit');
    if (savedOutfit) {
      setFinalOutfit(JSON.parse(savedOutfit));
    }
  }, []);

  useEffect(() => {
    const allFound = Object.keys(treasures).length === Object.keys(foundItems).length;
    if (allFound) {
      setTimeout(() => setIsComplete(true), 1000);
    }
  }, [foundItems]);

  const handleUseKey = (itemName) => {
    if (keys > 0 && !revealed[itemName]) {
      buttonSoundRef.current?.play(); // Play button sound
      setKeys(prev => prev - 1);
      setRevealed(prev => ({ ...prev, [itemName]: true }));
    }
  };

  const handleFindItem = (itemName) => {
    if (!revealed[itemName] || foundItems[itemName]) return;
    foundSoundRef.current?.play(); // Play found-item sound
    setFoundItems(prev => ({ ...prev, [itemName]: true }));

    if (itemName === 'outfit') setClue(treasures.cheesecake.clue);
    else if (itemName === 'cheesecake') setClue(treasures.sword.clue);
    else if (itemName === 'sword') setClue("You found everything!");
  };

  return (
    <div className="finale-container" style={finaleContainerStyle}>
      <audio ref={buttonSoundRef} src="/sounds/button-click.mp3" preload="auto" />
      <audio ref={foundSoundRef} src="/sounds/found-item.mp3" preload="auto" />

      <div className="clue-box">{clue}</div>
      <div className="key-hud">KEYS: {'🔑'.repeat(keys)}</div>

      <div className="keyhole-container">
        {Object.keys(treasures).map(key => (
          <button key={key} className="keyhole-button" onClick={() => handleUseKey(key)} disabled={revealed[key] || keys === 0}>
            {revealed[key] ? '✅' : '❓'}
          </button>
        ))}
      </div>

      {Object.entries(treasures).map(([key, treasure]) => (
        <div
          key={key}
          className={`treasure-zone ${revealed[key] ? 'glowing' : ''}`}
          style={{ top: treasure.pos.top, left: treasure.pos.left, right: treasure.pos.right, width: '150px', height: '150px' }}
          onClick={() => handleFindItem(key)}
        ></div>
      ))}

      {foundItems.outfit && finalOutfit && (
        <div className="found-item outfit-group" style={treasures.outfit.pos}>
          {finalOutfit.dress && <img src={finalOutfit.dress} alt="dress" className="treasure-item dress-item" />}
          {finalOutfit.top && <img src={finalOutfit.top} alt="top" className="treasure-item top-item" />}
          {finalOutfit.pants && <img src={finalOutfit.pants} alt="pants" className="treasure-item pants-item" />}
          {finalOutfit.footwear && <img src={finalOutfit.footwear} alt="footwear" className="treasure-item footwear-item" />}
        </div>
      )}

      {foundItems.cheesecake && <img src="/images/cheesecake/cheesecake-baked.png" alt="cheesecake" className="found-item" style={treasures.cheesecake.pos} />}
      {foundItems.sword && <img src="/images/character-sword.png" alt="sword" className="found-item" style={treasures.sword.pos} />}

      {isComplete && (
        <div className="birthday-overlay">
          <div className="birthday-card">
            <h1>Happy Birthday, Vinny </h1>
            <p>You are an amazing person and I'm so lucky to have you. I hope you enjoyed this little adventure!</p>
            <p>With all my love,</p>
            <p>[Kanna]</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default TreasureHunt;
