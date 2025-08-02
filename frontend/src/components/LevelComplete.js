import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './LevelComplete.css';
import { useBackgroundMusic } from '../hooks/useBackgroundMusic';


const walkFrames = [
  '/images/character-walk1.png',
  '/images/character-walk2.png',
  '/images/character-walk3.png',
  '/images/character-walk4.png',
];

function LevelComplete() {
  useBackgroundMusic('/sounds/music-complete.mp3', false, 0.2);
  const navigate = useNavigate();
  const location = useLocation();
  const [isWalking, setIsWalking] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);

  useEffect(() => {
    const animInterval = setInterval(() => {
      setCurrentFrame(prev => (prev + 1) % walkFrames.length);
    }, 200);
    return () => clearInterval(animInterval);
  }, []);

  useEffect(() => {
    // Determine the next level based on the previous page
    let nextPath = '/'; // Default to home

    if (location.pathname.startsWith('/level1')) {
      nextPath = '/level2';
    } else if (location.pathname.startsWith('/level2')) {
      nextPath = '/level3';
    } else if (location.pathname.startsWith('/level3')) {
      nextPath = '/finale';
    }
    
    const walkTimer = setTimeout(() => setIsWalking(true), 500);

    const navigateTimer = setTimeout(() => {
      navigate(nextPath);
    }, 4500);

    return () => {
      clearTimeout(walkTimer);
      clearTimeout(navigateTimer);
    };
  }, [navigate, location]);

  return (
    <div className="level-complete-container">
      <h2>Level Complete!</h2>
      <div className={`walkway ${isWalking ? 'walking' : ''}`}>
        <div className="walkway-fill"></div>
        <img
          className={`walking-character ${isWalking ? 'walking' : ''}`}
          src={walkFrames[currentFrame]}
          alt="walking character"
        />
      </div>
    </div>
  );
}

export default LevelComplete;