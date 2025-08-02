// frontend/src/components/Level2.js
import { useState, useEffect } from 'react';  // ✅ clean
import { useNavigate } from 'react-router-dom';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import './Level2.css';
import { useBackgroundMusic } from '../hooks/useBackgroundMusic';

// --- Sound Setup ---
const buttonClickSound = new Audio('/sounds/button-click.mp3');
buttonClickSound.volume = 0.4;

// --- Draggable & Droppable Components ---
function DraggableIngredient({ id, children }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined;
  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="draggable-wrapper">
      {children}
    </div>
  );
}
function DroppableBowl({ children }) {
  const { isOver, setNodeRef } = useDroppable({ id: 'bowl-droppable-area' });
  const style = { boxShadow: isOver ? '0px 0px 20px 5px #f7797d' : 'none' };
  return ( <div ref={setNodeRef} className="bowl" style={style}>{children}</div> );
}

// --- Style Objects ---
const startScreenStyle = { backgroundImage: `url("/images/bakery-background.jpg")`, backgroundSize: "cover", backgroundPosition: "center" };
const kitchenStyle = { backgroundImage: `url("/images/table-background.jpg")`, backgroundSize: "cover", backgroundPosition: "center" };
const messageCloudStyle = { backgroundImage: `url("/images/message-cloud.png")`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat' };

// --- Grandma's Messages ---
const grandmaMessages = [
  "Heyyy Mini V",
  "I know you'll make a wonderful cheesecake, dearie!",
  "Just follow the recipe and have fun!"
];

function Level2() {
  useBackgroundMusic('/sounds/music-level2.mp3');
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [dialogueStarted, setDialogueStarted] = useState(false);
  const [dialogueComplete, setDialogueComplete] = useState(false);
  const [isTalking, setIsTalking] = useState(false);
  const [grandmaImage, setGrandmaImage] = useState('/images/grandma-closed.png');
  const [messageIndex, setMessageIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  
  const [stage, setStage] = useState('crust');
  const [stepIndex, setStepIndex] = useState(0);
  const [message, setMessage] = useState('Loading...');
  const [bowlImage, setBowlImage] = useState('/images/cheesecake/bowl-empty.png');
  const [isMixing, setIsMixing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const playClickSound = () => {
    const click = buttonClickSound.cloneNode();
    click.play();
  };
  
  const allIngredients = [
    { name: "Graham Crackers", image: "/images/cheesecake/graham-crackers.png", pos: { top: '15%', left: '10%' } },
    { name: "Sugar", image: "/images/cheesecake/sugar.png", pos: { top: '35%', left: '5%' } },
    { name: "Melted Butter", image: "/images/cheesecake/melted-butter.png", pos: { top: '55%', left: '10%' } },
    { name: "Cream Cheese", image: "/images/cheesecake/cream-cheese.png", pos: { top: '15%', right: '10%' } },
    { name: "Eggs", image: "/images/cheesecake/eggs.png", pos: { top: '35%', right: '5%' } },
    { name: "Vanilla Extract", image: "/images/cheesecake/vanilla.png", pos: { top: '55%', right: '10%' } },
  ];

  useEffect(() => {
    let talkInterval;
    if (isTalking) {
      talkInterval = setInterval(() => {
        setGrandmaImage(prev => prev === '/images/grandma-closed.png' ? '/images/grandma-open.png' : '/images/grandma-closed.png');
      }, 200);
    } else {
      setGrandmaImage('/images/grandma-closed.png');
    }
    return () => clearInterval(talkInterval);
  }, [isTalking]);

  useEffect(() => {
    if (!dialogueStarted || messageIndex >= grandmaMessages.length) return;

    setIsTalking(true);

    const fullText = grandmaMessages[messageIndex];
    const words = fullText.split(' ');
    let wordCount = 1;

    const wordInterval = setInterval(() => {
      if (wordCount > words.length) {
        clearInterval(wordInterval);
        setIsTalking(false);
        if (messageIndex < grandmaMessages.length - 1) {
          setTimeout(() => setMessageIndex(prev => prev + 1), 5000);
        } else {
          setDialogueComplete(true);
        }
      } else {
        const nextText = words.slice(0, wordCount).join(' ');
        setDisplayedText(nextText);
        wordCount++;
      }
    }, 250);

    return () => clearInterval(wordInterval);
  }, [dialogueStarted, messageIndex]);
  
  const handleStartGame = () => {
    setDialogueStarted(true);
  };

  useEffect(() => {
    fetch('`${process.env.REACT_APP_API_URL}/api/recipe/cheesecake')
      .then(res => res.json())
      .then(data => { setRecipe(data); });
  }, []);

  const advanceStep = () => {
    const nextStepIndex = stepIndex + 1;
    if (nextStepIndex < recipe[stage].length) {
      setStepIndex(nextStepIndex);
      setMessage(recipe[stage][nextStepIndex].text);
    } else {
      if (stage === 'crust') {
        setStage('filling'); setStepIndex(0); setMessage(recipe.filling[0].text);
      } else if (stage === 'filling') {
        setStage('baking'); setStepIndex(0); setMessage(recipe.baking[0].text);
      }
    }
  };

  const handleAction = (action) => {
    const currentStep = recipe[stage][stepIndex];
    if (action !== currentStep.action) return;
    if (action === 'mix') {
      setIsMixing(true);
      setTimeout(() => {
        setIsMixing(false);
        if (currentStep.bowlImage) setBowlImage(currentStep.bowlImage);
        advanceStep();
      }, 1500);
    } else if (action === 'pour') {
      setBowlImage('/images/cheesecake/cheesecake-unbaked.png');
      advanceStep();
    } else if (action === 'bake') {
      setBowlImage('/images/cheesecake/cheesecake-baked.png');
      setMessage("Perfect! The cheesecake is ready.");
      setIsComplete(true);
    }
  };

  function handleDragEnd(event) {
    if (isComplete || (event.over && event.over.id !== 'bowl-droppable-area')) return;
    const droppedIngredient = event.active.id;
    const currentStep = recipe[stage][stepIndex];
    if (currentStep.action === 'add' && droppedIngredient === currentStep.item) {
      setMessage(`Great! You added the ${droppedIngredient}.`);
      if (currentStep.bowlImage) { setBowlImage(currentStep.bowlImage); }
      advanceStep();
    } else {
      setMessage("Oops, that's not the right ingredient for this step!");
    }
  }

  if (!recipe) return <div className="level2-container">Loading...</div>;

  if (!gameStarted) {
    return (
      <div className="start-screen-l2" style={startScreenStyle}>
        <div className="start-content">
          {!dialogueStarted && !dialogueComplete && (
            <>
              <h1>The Cheesecake Challenge</h1>
              <p>Follow the recipe to create a delicious dessert!</p>
              <button className="start-button" onClick={() => {
                playClickSound();
                handleStartGame();
              }}>
                Start
              </button>
            </>
          )}
          {dialogueComplete && (
            <button className="start-button" onClick={() => {
              playClickSound();
              setGameStarted(true);
              setMessage(recipe.crust[0].text);
            }}>
              Let's Bake!
            </button>
          )}
        </div>
        <img src={grandmaImage} alt="Grandma" className="grandma-character" />
        {dialogueStarted && !dialogueComplete && (
          <div className="message-cloud" style={messageCloudStyle}>
            <p>{displayedText}</p>
          </div>
        )}
      </div>
    );
  }

  const currentStep = recipe[stage][stepIndex];
  const usedIngredientNames = new Set();
  if (recipe) {
    if (stage === 'filling' || stage === 'baking') {
      recipe.crust.forEach(step => { if (step.item) usedIngredientNames.add(step.item); });
    }
    if (stage === 'baking') {
      recipe.filling.forEach(step => { if (step.item) usedIngredientNames.add(step.item); });
    }
    recipe[stage].slice(0, stepIndex).forEach(step => { if (step.item) usedIngredientNames.add(step.item); });
  }
  const availableIngredients = allIngredients.filter(ing => !usedIngredientNames.has(ing.name));

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="kitchen-l2" style={kitchenStyle}>
        <div className="recipe-instructions-l2">{message}</div>
        {stage !== 'baking' && availableIngredients.map(ingredient => (
          <div key={ingredient.name} className="ingredient-on-table" style={ingredient.pos}>
            <DraggableIngredient id={ingredient.name}>
              <div className="ingredient-card-l2">
                <img src={ingredient.image} alt={ingredient.name} />
                <span>{ingredient.name}</span>
              </div>
            </DraggableIngredient>
          </div>
        ))}
        <div className="bowl-area">
          <DroppableBowl>
            <img src={bowlImage} alt="bowl" className={isMixing ? 'mixing-l2' : ''} />
          </DroppableBowl>
        </div>
        <div className="action-buttons-l2">
          {currentStep.action === 'mix' && (
            <button onClick={() => {
              playClickSound();
              handleAction('mix');
            }}>Mix</button>
          )}
          {currentStep.action === 'pour' && (
            <button onClick={() => {
              playClickSound();
              handleAction('pour');
            }}>Pour</button>
          )}
          {currentStep.action === 'bake' && !isComplete && (
            <button onClick={() => {
              playClickSound();
              handleAction('bake');
            }}>Bake</button>
          )}
          {isComplete && (
            <button className="next-level-button" onClick={() => {
              playClickSound();
              navigate('/level-complete');
            }}>Finish!</button>
          )}
        </div>
      </div>
    </DndContext>
  );
}

export default Level2;
