// frontend/src/components/Level3.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import './Level3.css';

const MAX_HEALTH = 100;
const ATTACK_DAMAGE = 34;

const powerPhrases = [
  "I am strong and capable",
  "I am beautiful, inside and out",
  "I am enough, just as I am"
];

const masterMessages = [
  "The greatest opponent lies within.",
  "Use your voice as your sword. Banish all doubt!"
];

const level3ContainerStyle = {
  backgroundImage: `url("/images/battle-background.jpg")`,
  backgroundSize: "cover",
  backgroundPosition: "center",
};

const messageCloudStyle = {
  backgroundImage: `url("/images/message-cloud.png")`,
  backgroundSize: 'contain',
  backgroundRepeat: 'no-repeat'
};

function Level3() {
  const navigate = useNavigate();

  const [gameStarted, setGameStarted] = useState(false);
  const [dialogueStarted, setDialogueStarted] = useState(false);
  const [dialogueComplete, setDialogueComplete] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [prompt, setPrompt] = useState('');
  const [doubtHealth, setDoubtHealth] = useState(MAX_HEALTH);
  const [isAttacking, setIsAttacking] = useState(false);
  const [isVictory, setIsVictory] = useState(false);
  const [isDefeated, setIsDefeated] = useState(false);
  const [strengths, setStrengths] = useState([]);
  const [error, setError] = useState(null);

  const { isListening, transcript, startListening, stopListening } = useSpeechRecognition();

  const buttonClickSound = useRef(null);
  const swordSound = useRef(null);

  useEffect(() => {
    buttonClickSound.current = new Audio('/sounds/button-click.mp3');
    swordSound.current = new Audio('/sounds/sword.mp3');
  }, []);

  const playButtonSound = () => {
    buttonClickSound.current?.play().catch(() => {});
  };

  const playSwordSound = () => {
    swordSound.current?.play().catch(() => {});
  };

  useEffect(() => {
    if (!dialogueStarted || messageIndex >= masterMessages.length) return;

    const fullText = masterMessages[messageIndex];
    const words = fullText.split(' ');
    let wordCount = 1;
    setDisplayedText('');

    const wordInterval = setInterval(() => {
      if (wordCount > words.length) {
        clearInterval(wordInterval);
        if (messageIndex < masterMessages.length - 1) {
          setTimeout(() => setMessageIndex(prev => prev + 1), 3000);
        } else {
          setDialogueComplete(true);
        }
      } else {
        const nextText = words.slice(0, wordCount).join(' ');
        setDisplayedText(nextText);
        wordCount++;
      }
    }, 200);

    return () => clearInterval(wordInterval);
  }, [dialogueStarted, messageIndex]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/strengths`)
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => setStrengths(data))
      .catch(err => {
        console.error("Could not fetch strengths:", err);
        setError("Could not load strengths. Is the backend server running?");
      });
  }, []);

  const handleAttack = useCallback(() => {
    if (doubtHealth <= 0) return;

    playSwordSound();
    setIsAttacking(true);
    setTimeout(() => setIsAttacking(false), 500);

    const newHealth = doubtHealth - ATTACK_DAMAGE;
    setDoubtHealth(newHealth);

    if (newHealth <= 0) {
      setTimeout(() => setIsDefeated(true), 500);
      setTimeout(() => setIsVictory(true), 1500);
    } else {
      setTimeout(() => {
        const currIndex = powerPhrases.indexOf(prompt);
        const nextIndex = currIndex === -1 ? 0 : (currIndex + 1) % powerPhrases.length;
        setPrompt(powerPhrases[nextIndex]);
      }, 2000);
    }
  }, [doubtHealth, prompt]);

  useEffect(() => {
    if (transcript && !isListening) {
      const cleanTranscript = transcript.trim().toLowerCase().replace(/[.,!?;]/g, '');
      const cleanPrompt = prompt.toLowerCase().replace(/[.,!?;]/g, '');
      if (cleanTranscript.includes(cleanPrompt)) {
        handleAttack();
      }
    }
  }, [transcript, isListening, prompt, handleAttack]);

  if (error) {
    return <div className="level3-container" style={level3ContainerStyle}><h1>Error</h1><p>{error}</p></div>;
  }

  if (!gameStarted) {
    return (
      <div className="level3-container intro-screen-l3" style={level3ContainerStyle}>
        <img src="/images/fight-master.png" alt="Fight Master" className="fight-master-character" />

        {!dialogueStarted && (
          <button className="start-challenge-button" onClick={() => {
            playButtonSound();
            setDialogueStarted(true);
          }}>
            Speak to the Master
          </button>
        )}

        {dialogueStarted && !dialogueComplete && (
          <div className="message-cloud master-cloud" style={messageCloudStyle}>
            <p>{displayedText}</p>
          </div>
        )}

        {dialogueComplete && (
          <button className="start-challenge-button" onClick={() => {
            playButtonSound();
            setGameStarted(true);
            setPrompt(powerPhrases[0]);
          }}>
            Begin Challenge!
          </button>
        )}
      </div>
    );
  }

  const healthPercentage = (doubtHealth / MAX_HEALTH) * 100;

  return (
    <div className="level3-container" style={level3ContainerStyle}>
      <h1>Use Your Voice!</h1>
      <div className="battle-arena-l3">
        <img src="/images/character-sword.png" alt="Character" className={`player-character ${isAttacking ? 'swing' : ''}`} />
        <div className="doubt-monster-container">
          <img
            src="/images/doubt-monster-pixel.png"
            alt="Doubt Monster"
            className={`doubt-monster ${isDefeated ? 'defeated' : ''}`}
          />
          <div className="health-bar-container">
            <div className="health-bar" style={{ width: `${healthPercentage}%` }}></div>
          </div>
        </div>
      </div>

      <div className="speech-area">
        <div className="prompt-text">
          Say this phrase aloud: <strong>"{prompt}"</strong>
        </div>
        <div className="transcript-box">
          {isListening ? transcript : <em></em>}
        </div>
        <button
          className="speak-button"
          onMouseDown={() => { if (!isListening) startListening(); }}
          onMouseUp={() => { if (isListening) stopListening(); }}
          onTouchStart={() => { if (!isListening) startListening(); }}
          onTouchEnd={() => { if (isListening) stopListening(); }}
          disabled={isListening}
        >
          {isListening ? 'Listening...' : 'Hold to Speak'}
        </button>
      </div>

      {isVictory && (
        <div className="victory-screen" role="alert">
          <h2>Victory!</h2>
          <p>You banished your doubts with the power of your own voice!</p>
          <button className="next-level-button" onClick={() => navigate('/level-complete')}>
            Finish Level
          </button>
        </div>
      )}
    </div>
  );
}

export default Level3;
