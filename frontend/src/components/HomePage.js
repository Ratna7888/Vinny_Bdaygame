// frontend/src/components/HomePage.js

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './HomePage.css';
import { useBackgroundMusic } from '../hooks/useBackgroundMusic';

// Force base path to root of public folder
const ASSET_BASE = '';

const walkRightFrames = [
  `${ASSET_BASE}/images/character-walk1.png`,
  `${ASSET_BASE}/images/character-walk2.png`,
  `${ASSET_BASE}/images/character-walk3.png`,
  `${ASSET_BASE}/images/character-walk4.png`
];
const walkLeftFrames = [
  `${ASSET_BASE}/images/character-left1.png`,
  `${ASSET_BASE}/images/character-left2.png`,
  `${ASSET_BASE}/images/character-left3.png`,
  `${ASSET_BASE}/images/character-left4.png`
];

const locations = {
  start: { x: 750, y: 595, name: "Vinny's Bday Adventure" },
  level1: { x: 1450, y: 595, name: 'Level 1: The Stylist' },
  level2: { x: 2550, y: 595, name: 'Level 2: The Chef' },
  level3: { x: 3650, y: 595, name: 'Level 3: The Champion' },
  finale: { x: 4700, y: 595, name: 'Finale: The Finale' },
};

const titleLocation = { x: 350, y: 150 };

const worldMapStyle = {
  backgroundImage: `url("${ASSET_BASE}/images/city/city-background.jpg")`,
  backgroundRepeat: 'repeat-x',
  backgroundSize: 'auto 100%',
};

function HomePage() {
  useBackgroundMusic(`${ASSET_BASE}/sounds/music-home.mp3`, true, 0.15);

  const navigate = useNavigate();
  const location = useLocation();

  const buttonClickSound = useRef(new Audio(`${ASSET_BASE}/sounds/button-click.mp3`));
  const walkingSound = useRef(new Audio(`${ASSET_BASE}/sounds/walk.mp3`));
  walkingSound.current.loop = true;

  const [currentLocation, setCurrentLocation] = useState(sessionStorage.getItem('characterLocation') || 'start');
  const [characterPos, setCharacterPos] = useState(locations[currentLocation]);
  const [worldScrollX, setWorldScrollX] = useState(0);
  const [direction, setDirection] = useState('right');
  const [isWalking, setIsWalking] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [uiVisible, setUiVisible] = useState(true);
  const [showIntro, setShowIntro] = useState(!sessionStorage.getItem('introShown'));

  // Debug log for animation
  useEffect(() => {
    console.log(`Frame: ${currentFrame}, Walking: ${isWalking}, Image: ${direction === 'right' ? walkRightFrames[currentFrame] : walkLeftFrames[currentFrame]}`);
  }, [currentFrame, isWalking, direction]);

  useEffect(() => {
    const savedLocation = sessionStorage.getItem('characterLocation') || 'start';
    const initialPos = locations[savedLocation];
    setCurrentLocation(savedLocation);
    setCharacterPos(initialPos);
    // Debug: Disable scrolling transform
    setWorldScrollX(0);
    setUiVisible(true);
  }, [location]);

  useEffect(() => {
    let animInterval;
    if (isWalking) {
      animInterval = setInterval(() => setCurrentFrame(prev => (prev + 1) % 4), 150);
    }
    return () => clearInterval(animInterval);
  }, [isWalking]);

  useEffect(() => {
    const sound = walkingSound.current;
    if (isWalking) {
      sound.currentTime = 0;
      sound.play().catch(() => {});
    } else {
      sound.pause();
      sound.currentTime = 0;
    }
  }, [isWalking]);

  const handleLevelSelect = (targetLocationKey, path) => {
    if (isWalking) return;

    buttonClickSound.current.currentTime = 0;
    buttonClickSound.current.play();

    const endPos = locations[targetLocationKey];
    setDirection(endPos.x < characterPos.x ? 'left' : 'right');
    setUiVisible(false);

    setTimeout(() => {
      setIsWalking(true);
      setCharacterPos(endPos);
      // Debug: Keep map fixed
      setWorldScrollX(0);
    }, 500);

    setTimeout(() => {
      setIsWalking(false);
      sessionStorage.setItem('characterLocation', targetLocationKey);
      navigate(path);
    }, 3500);
  };

  const handleIntroDismiss = () => {
    sessionStorage.setItem('introShown', 'true');
    setShowIntro(false);
  };

  const characterImage = isWalking
    ? (direction === 'right' ? walkRightFrames[currentFrame] : walkLeftFrames[currentFrame])
    : (direction === 'right' ? walkRightFrames[0] : walkLeftFrames[0]);

  return (
    <div className="homepage-container">
      {showIntro && (
        <div className="intro-overlay">
          <div className="intro-content">
            <img src={`${ASSET_BASE}/images/character-walk1.png`} alt="Mini V" className="mini-v" />
            <div className="intro-text">
              <h2>Heyy Vinny,</h2>
              <p>Meet <strong>Mini Vinny</strong> who is called <strong>Mini V </strong>❤️</p>
              <p>She’s going on a birthday adventure today🎉</p>
              <p>Fasten your seatbelts for the adventure!!</p>
              <button onClick={handleIntroDismiss}>Start</button>
            </div>
          </div>
        </div>
      )}

      <div className="world-map" style={{ 
        transform: `translateX(${worldScrollX}px)`,
        ...worldMapStyle 
      }}>
        <div className="world-object title-image" style={{ left: `${titleLocation.x}px`, top: `${titleLocation.y}px` }}>
          <img src={`${ASSET_BASE}/images/city/text.png`} alt="Vinny's Bday Adventure" />
        </div>

        <div className="world-object shop" style={{ left: `${locations.level1.x}px` }}>
          <img src={`${ASSET_BASE}/images/city/shop-dress.png`} alt="Dress Shop" />
        </div>
        <div className="world-object shop" style={{ left: `${locations.level2.x}px` }}>
          <img src={`${ASSET_BASE}/images/city/shop-bakery.png`} alt="Bakery" />
        </div>
        <div className="world-object shop" style={{ left: `${locations.level3.x}px` }}>
          <img src={`${ASSET_BASE}/images/city/shop-battlefield.png`} alt="Battlefield" />
        </div>
        <div className="world-object shop" style={{ left: `${locations.finale.x}px` }}>
          <img src={`${ASSET_BASE}/images/city/shop-spy-hq.png`} alt="Spy HQ" />
        </div>

        <img 
          src={characterImage} 
          alt="character" 
          className="map-character" 
          style={{ 
            left: `${characterPos.x}px`, 
            top: `${characterPos.y}px`,
            transition: isWalking ? 'left 3s linear' : 'none'
          }} 
        />
      </div>

      <div className={`world-navigation ${!uiVisible ? 'hidden' : ''}`}>
        <h1>{locations[currentLocation].name}</h1>
        <div className="map-buttons">
          <button onClick={() => handleLevelSelect('level1', '/level1')}>Level 1</button>
          <button onClick={() => handleLevelSelect('level2', '/level2')}>Level 2</button>
          <button onClick={() => handleLevelSelect('level3', '/level3')}>Level 3</button>
          <button onClick={() => handleLevelSelect('finale', '/finale')}>Finale</button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;

