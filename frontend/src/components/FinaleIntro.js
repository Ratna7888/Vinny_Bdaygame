import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './FinaleIntro.css';
import { useBackgroundMusic } from '../hooks/useBackgroundMusic';

const walkRightFrames = ['/images/character-walk1.png', '/images/character-walk2.png', '/images/character-walk3.png', '/images/character-walk4.png'];
const walkLeftFrames = ['/images/character-left1.png', '/images/character-left2.png', '/images/character-left3.png', '/images/character-left4.png'];

const MOVEMENT_SPEED = 5;
const GRAVITY = 0.8;
const JUMP_STRENGTH = -16;
const gameAreaStyle = { backgroundImage: `url("/images/spy-hq-background.png")` };

const platforms = [
  { x: 0, y: 450, width: 300 },
  { x: 450, y: 450, width: 1000 },
];

const lights = [
  { id: 0, x: 250, y: 420 },
  { id: 1, x: 600, y: 420 },
  { id: 2, x: 850, y: 420 },
];

const initialCharacterPos = { x: 50, y: 390 };

function SpyQuiz() {
  useBackgroundMusic('/sounds/music-spy.mp3', true, 0.05);
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [characterPos, setCharacterPos] = useState(initialCharacterPos);
  const [direction, setDirection] = useState('right');
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isOnGround, setIsOnGround] = useState(true);
  const [showQuestion, setShowQuestion] = useState(false);
  const [activeLight, setActiveLight] = useState(null);
  const [answeredLights, setAnsweredLights] = useState([]);
  const [keysEarned, setKeysEarned] = useState(0);
  const [feedback, setFeedback] = useState('Reach the blinking light!');

  const keysDown = useRef({});
  const playerState = useRef({
    pos: { ...initialCharacterPos },
    vel: { x: 0, y: 0 }
  });
  const gameLoopId = useRef(null);

  const buttonSound = useRef(null);
  const walkSound = useRef(null);
  const isWalking = useRef(false);

  useEffect(() => {
    buttonSound.current = new Audio('/sounds/button-click.mp3');
    walkSound.current = new Audio('/sounds/walk.mp3');
    walkSound.current.loop = true;
    walkSound.current.volume = 0.4;
  }, []);

  const playButtonSound = () => {
    if (buttonSound.current) {
      buttonSound.current.currentTime = 0;
      buttonSound.current.play();
    }
  };

  const startWalkSound = () => {
    if (walkSound.current && !isWalking.current) {
      walkSound.current.play();
      isWalking.current = true;
    }
  };

  const stopWalkSound = () => {
    if (walkSound.current && isWalking.current) {
      walkSound.current.pause();
      walkSound.current.currentTime = 0;
      isWalking.current = false;
    }
  };

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/spy-questions`)
      .then(res => res.json())
      .then(data => setQuestions(data));
  }, []);

  useEffect(() => {
    const animInterval = setInterval(() => {
      if (keysDown.current['ArrowLeft'] || keysDown.current['ArrowRight']) {
        setCurrentFrame(prev => (prev + 1) % 4);
      }
    }, 150);
    return () => clearInterval(animInterval);
  }, []);

  useEffect(() => {
    const gameLoop = () => {
      if (showQuestion) {
        gameLoopId.current = requestAnimationFrame(gameLoop);
        stopWalkSound();
        return;
      }

      const state = playerState.current;
      const charSize = { width: 40, height: 60 };
      const movingLeft = keysDown.current['ArrowLeft'];
      const movingRight = keysDown.current['ArrowRight'];
      const moving = movingLeft || movingRight;

      if (moving) startWalkSound();
      else stopWalkSound();

      const nextX = state.pos.x + (movingLeft ? -MOVEMENT_SPEED : 0) + (movingRight ? MOVEMENT_SPEED : 0);
      state.pos.x = Math.max(0, Math.min(nextX, 1000 - charSize.width));

      state.vel.y += GRAVITY;
      state.pos.y += state.vel.y;

      let onTheGround = false;
      for (const platform of platforms) {
        if (
          state.pos.x + charSize.width > platform.x &&
          state.pos.x < platform.x + platform.width &&
          state.pos.y + charSize.height >= platform.y &&
          state.pos.y < platform.y
        ) {
          if (state.vel.y >= 0) {
            state.pos.y = platform.y - charSize.height;
            state.vel.y = 0;
            onTheGround = true;
          }
        }
      }
      setIsOnGround(onTheGround);

      if (state.pos.y > 600) {
        state.pos = { ...initialCharacterPos };
        state.vel = { x: 0, y: 0 };
      }

      setCharacterPos({ ...state.pos });

      const nextLight = lights.find(l => !answeredLights.includes(l.id));
      if (nextLight) {
        const dist = Math.sqrt((state.pos.x - nextLight.x) ** 2 + (state.pos.y - nextLight.y) ** 2);
        if (dist < 40) {
          setActiveLight(nextLight);
          setShowQuestion(true);
        }
      }

      gameLoopId.current = requestAnimationFrame(gameLoop);
    };

    gameLoopId.current = requestAnimationFrame(gameLoop);
    return () => {
      cancelAnimationFrame(gameLoopId.current);
      stopWalkSound();
    };
  }, [showQuestion, answeredLights]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      keysDown.current[e.key] = true;
      if (e.key === 'ArrowLeft') setDirection('left');
      if (e.key === 'ArrowRight') setDirection('right');
      if (e.code === 'Space' && isOnGround) {
        playerState.current.vel.y = JUMP_STRENGTH;
        setIsOnGround(false);
      }
    };
    const handleKeyUp = (e) => {
      keysDown.current[e.key] = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isOnGround]);

  const handleAnswerClick = (selectedIndex) => {
    playButtonSound();
    if (selectedIndex === questions[activeLight.id].correct) {
      setKeysEarned(prev => prev + 1);
      setAnsweredLights(prev => [...prev, activeLight.id]);
      setFeedback('Key acquired! Find the next blinking light.');
    } else {
      setFeedback('Incorrect credentials. The system is still locked.');
    }
    setShowQuestion(false);
  };

  useEffect(() => {
    if (questions.length > 0 && keysEarned === questions.length) {
      setFeedback('All keys acquired! Mission successful.');
      setTimeout(() => navigate('/treasure-hunt'), 2000);
    }
  }, [keysEarned, questions, navigate]);

  const characterImage = (keysDown.current['ArrowLeft'] || keysDown.current['ArrowRight'])
    ? (direction === 'right' ? walkRightFrames[currentFrame] : walkLeftFrames[currentFrame])
    : (direction === 'right' ? walkRightFrames[0] : walkLeftFrames[0]);

  const lightToFind = lights.find(l => !answeredLights.includes(l.id));
  const currentQuestion = activeLight ? questions[activeLight.id] : null;

  return (
    <div className="spy-quiz-container" style={gameAreaStyle}>
      <div className="mission-objective">{feedback}</div>
      <div className="key-display-spy">KEYS: {'🔑'.repeat(keysEarned)}</div>

      <img
        src={characterImage}
        alt="character"
        className="game-character-spy"
        style={{ left: characterPos.x, top: characterPos.y }}
      />

      {lights.map(light => (
        <div key={light.id} className="light-zone" style={{ left: light.x, top: light.y }}>
          {lightToFind && lightToFind.id === light.id && <div className="blinking-light"></div>}
          {answeredLights.includes(light.id) && <div className="checkmark">✅</div>}
        </div>
      ))}

      {showQuestion && currentQuestion && (
        <div className="holographic-display">
          <h2>{currentQuestion.question}</h2>
          <div className="holo-answers">
            {currentQuestion.answers.map((answer, index) => (
              <button key={index} onClick={() => handleAnswerClick(index)}>{answer}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SpyQuiz;
