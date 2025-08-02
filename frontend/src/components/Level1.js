import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Level1.css';
import { useBackgroundMusic } from '../hooks/useBackgroundMusic';

// Sound Effects
const walkSound = new Audio('/sounds/walk.mp3');
const clickSound = new Audio('/sounds/button-click.mp3');

const walkRightFrames = [
  '/images/character-walk1.png', '/images/character-walk2.png',
  '/images/character-walk3.png', '/images/character-walk4.png',
];

const walkLeftFrames = [
  '/images/character-left1.png', '/images/character-left2.png',
  '/images/character-left3.png', '/images/character-left4.png',
];

const MOVEMENT_SPEED = 15;

const gameAreaStyle = {
  backgroundImage: `url("/images/shop-background.jpg")`,
  backgroundSize: "cover",
  backgroundPosition: "center",
};

function Level1() {
  useBackgroundMusic('/sounds/music-level1.mp3', true, 0.10);
  const navigate = useNavigate();

  const [gameStarted, setGameStarted] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);

  const introScreenStyle = {
    backgroundImage: `url("/images/shop-intro-background.png")`,
  };
  const messageCloudStyle = {
    backgroundImage: `url("/images/message-cloud.png")`,
  };

  const dogMessages = [
    "Hey Mini V, This is Leoooo, Welcome to the boutique! woof",
    "Your mission is to create the perfect outfit. Let's go!"
  ];

  const [characterPos, setCharacterPos] = useState({ x: 50, y: 150 });
  const [direction, setDirection] = useState('right');
  const [currentFrame, setCurrentFrame] = useState(0);
  const [wardrobe, setWardrobe] = useState([]);
  const [activeSection, setActiveSection] = useState(null);
  const [mannequinOutfit, setMannequinOutfit] = useState({
    dress: null, top: null, pants: null, footwear: null,
  });

  const gameAreaRef = useRef(null);
  const dressesRef = useRef(null);
  const footwearRef = useRef(null);
  const pantsRef = useRef(null);

  useEffect(() => {
    const allFrames = [...walkRightFrames, ...walkLeftFrames];
    allFrames.forEach(frameSrc => {
      const img = new Image();
      img.src = frameSrc;
    });
  }, []);

  useEffect(() => {
    fetch('http://localhost:5000/api/clothes')
      .then(res => res.json())
      .then(data => setWardrobe(data));
  }, []);

  useEffect(() => {
    const animInterval = setInterval(() => {
      setCurrentFrame(prev => (prev + 1) % 4);
    }, 200);
    return () => clearInterval(animInterval);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return;
      e.preventDefault();

      walkSound.currentTime = 0;
      walkSound.play();

      if (e.key === 'ArrowLeft') setDirection('left');
      if (e.key === 'ArrowRight') setDirection('right');

      setCharacterPos(prevPos => {
        let newPos = { ...prevPos };
        if (e.key === 'ArrowUp') newPos.y -= MOVEMENT_SPEED;
        if (e.key === 'ArrowDown') newPos.y += MOVEMENT_SPEED;
        if (e.key === 'ArrowLeft') newPos.x -= MOVEMENT_SPEED;
        if (e.key === 'ArrowRight') newPos.x += MOVEMENT_SPEED;

        const gameRect = gameAreaRef.current.getBoundingClientRect();
        const charSize = 40;
        newPos.x = Math.max(0, Math.min(newPos.x, gameRect.width - charSize));
        newPos.y = Math.max(0, Math.min(newPos.y, gameRect.height - charSize));

        return newPos;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const checkCollision = (sectionRef) => {
      if (!sectionRef.current || !gameAreaRef.current) return false;
      const gameRect = gameAreaRef.current.getBoundingClientRect();
      const sectionRect = sectionRef.current.getBoundingClientRect();
      const charRect = {
        left: characterPos.x + gameRect.left,
        right: characterPos.x + 40 + gameRect.left,
        top: characterPos.y + gameRect.top,
        bottom: characterPos.y + 60 + gameRect.top,
      };
      return !(charRect.right < sectionRect.left || charRect.left > sectionRect.right || charRect.bottom < sectionRect.top || charRect.top > sectionRect.bottom);
    };

    if (checkCollision(dressesRef)) setActiveSection('dress');
    else if (checkCollision(footwearRef)) setActiveSection('footwear');
    else if (checkCollision(pantsRef)) setActiveSection('pants');
    else setActiveSection(null);
  }, [characterPos]);

  const handleItemClick = (item) => {
    clickSound.currentTime = 0;
    clickSound.play();

    setMannequinOutfit(prev => {
      let newOutfit = { ...prev };
      if (item.type === 'dress') {
        newOutfit.dress = item.imageUrl;
        newOutfit.top = null;
        newOutfit.pants = null;
      } else if (item.type === 'top') {
        newOutfit.top = item.imageUrl;
        newOutfit.dress = null;
      } else if (item.type === 'pants') {
        newOutfit.pants = item.imageUrl;
        newOutfit.dress = null;
      } else if (item.type === 'footwear') {
        newOutfit.footwear = item.imageUrl;
      }
      return newOutfit;
    });
  };

  const handleFinishShopping = () => {
    clickSound.currentTime = 0;
    clickSound.play();

    sessionStorage.setItem('finalOutfit', JSON.stringify(mannequinOutfit));
    navigate('/level-complete');
  };

  const characterImage = direction === 'right' ? walkRightFrames[currentFrame] : walkLeftFrames[currentFrame];

  if (!gameStarted) {
    return (
      <div className="intro-screen-l1" style={introScreenStyle}>
        <img src="/images/dog-character.png" alt="Dog" className="dog-character" />
        <div className="message-cloud-l1" style={messageCloudStyle}>
          <p>{dogMessages[messageIndex]}</p>
        </div>
        {messageIndex < dogMessages.length - 1 ? (
          <button className="start-level-button" onClick={() => {
            clickSound.currentTime = 0;
            clickSound.play();
            setMessageIndex(messageIndex + 1);
          }}>
            Next
          </button>
        ) : (
          <button className="start-level-button" onClick={() => {
            clickSound.currentTime = 0;
            clickSound.play();
            setGameStarted(true);
          }}>
            Start Shopping!
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="level1-container">
      <div className="game-area" ref={gameAreaRef} style={gameAreaStyle}>
        <div className="instructions">Use Arrow Keys to Move</div>
        <img src={characterImage} alt="character" className="game-character" style={{ left: characterPos.x, top: characterPos.y }} />

        <div className="shop-section dresses-section" ref={dressesRef}>DRESSES & TOPS</div>
        <div className="shop-section footwear-section" ref={footwearRef}>FOOTWEAR</div>
        <div className="shop-section pants-section" ref={pantsRef}>PANTS</div>

        {activeSection && (
          <div className="selection-panel">
            <h4>{activeSection.toUpperCase()}</h4>
            <div className="panel-items-grid">
              {wardrobe.filter(item => item.type === activeSection || (activeSection === 'dress' && item.type === 'top')).map(item => (
                <div key={item.id} className="panel-item-card" onClick={() => handleItemClick(item)}>
                  <img src={item.imageUrl} alt={item.name} />
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mannequin-area">
        <h2>Your Outfit</h2>
        <div className="mannequin">
          {mannequinOutfit.dress && <img src={mannequinOutfit.dress} alt="dress" className="mannequin-layer dress-item" />}
          {mannequinOutfit.top && <img src={mannequinOutfit.top} alt="top" className="mannequin-layer top-item" />}
          {mannequinOutfit.pants && <img src={mannequinOutfit.pants} alt="pants" className="mannequin-layer pants-item" />}
          {mannequinOutfit.footwear && <img src={mannequinOutfit.footwear} alt="footwear" className="mannequin-layer footwear-item" />}
        </div>
        <button className="verify-button" onClick={handleFinishShopping}>Looks Good!</button>
      </div>
    </div>
  );
}

export default Level1;
