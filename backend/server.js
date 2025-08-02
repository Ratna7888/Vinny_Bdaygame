const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// API Endpoint for Level 1 Shopping Data
// backend/server.js

// backend/server.js

// backend/server.js

app.get('/api/clothes', (req, res) => {
  const clothes = [
    // Dresses
    { id: 'drs1', name: 'Bodycon', imageUrl: '/images/bodycon.png', type: 'dress' },
    { id: 'drs2', name: 'Maxi', imageUrl: '/images/maxi.png', type: 'dress' },

    // Tops
    { id: 'top1', name: 'Crop Top', imageUrl: '/images/croptop.png', type: 'top' },

    // Pants - UPDATED
    { id: 'pnt1', name: 'Jeans', imageUrl: '/images/jeans.png', type: 'pants' },
    { id: 'pnt2', name: 'Baggy Pants', imageUrl: '/images/baggy-pants.png', type: 'pants' }, // NEW

    // Footwear
    { id: 'shoe1', name: 'Sneakers', imageUrl: '/images/sneakers.png', type: 'footwear' },
    { id: 'shoe2', name: 'Flats', imageUrl: '/images/flats.png', type: 'footwear' }, // Assuming flats image is named heels.png, or you can change
  ];
  res.json(clothes);
});

// backend/server.js

// Add this entire block to your server file

// backend/server.js
// backend/server.js
// backend/server.js
app.get('/api/recipe/cheesecake', (req, res) => {
  const recipe = {
    crust: [
      { id: 'c1', text: 'Add graham crackers to the bowl.', action: 'add', item: 'Graham Crackers', bowlImage: '/images/cheesecake/bowl-crackers.png' },
      { id: 'c2', text: 'Add sugar.', action: 'add', item: 'Sugar', bowlImage: '/images/cheesecake/bowl-crackers-sugar.png' },
      { id: 'c3', text: 'Pour in melted butter.', action: 'add', item: 'Melted Butter', bowlImage: '/images/cheesecake/bowl-with-crust-unmixed.png' },
      { id: 'c4', text: 'Mix the ingredients to form the crust.', action: 'mix', bowlImage: '/images/cheesecake/bowl-with-crust.png' }
    ],
    filling: [
      { id: 'f1', text: 'Time for the filling! Start with cream cheese.', action: 'add', item: 'Cream Cheese', bowlImage: '/images/cheesecake/bowl-crust-cream-cheese.png' },
      { id: 'f2', text: 'Add the eggs.', action: 'add', item: 'Eggs', bowlImage: '/images/cheesecake/bowl-crust-cheese-eggs.png' },
      // CORRECTED THIS LINE to use the new image you just created
      { id: 'f3', text: 'Add a little vanilla extract.', action: 'add', item: 'Vanilla Extract', bowlImage: '/images/cheesecake/bowl-with-filling-unmixed.png' },
      { id: 'f4', text: 'Mix everything together until smooth.', action: 'mix', bowlImage: '/images/cheesecake/bowl-with-filling.png' }
    ],
    baking: [
      { id: 'b1', text: 'Pour the filling into the crust.', action: 'pour' },
      { id: 'b2', text: 'Bake in the oven!', action: 'bake' },
      { id: 'b3', text: 'Perfect! The cheesecake is ready.', action: 'finish' }
    ]
  };
  res.json(recipe);
});

// backend/server.js

app.get('/api/strengths', (req, res) => {
  const strengths = [
    { id: 's1', name: 'Your Creativity' },
    { id: 's2', name: 'Your Resilience' },
    { id: 's3', name: 'Your Kindness' },
    { id: 's4', name: 'Your Sense of Humor' },
    { id: 's5', name: 'Your Intelligence' },
    { id: 's6', name: 'Your Determination' },
  ];
  res.json(strengths);
});

// backend/server.js

app.get('/api/spy-questions', (req, res) => {
  const questions = [
    {
      question: "What is your secret agent codename (i.e., your favorite coffee order)?",
      answers: ["Caramel Macchiato", "Javachip Frappuchino", "Black Americano"],
      correct: 1 // The index of the correct answer (Javachip Frappuchino)
    },
    {
      question: "Your mission is to relax. What is your go-to method?",
      answers: ["Adding items to cart(Shopping)", "cooking", "Going for a long walk"],
      correct: 0 // Adding items to cart
    },
    {
      question: "Which of these is your superpower?",
      answers: ["Amazing fashion sense", "Baking delicious treats", "Annoying people"],
      correct: 0 // Unshakeable confidence
    }
  ];
  res.json(questions);
});

app.listen(port, () => {
  console.log(`🎉 Backend server is running on http://localhost:${port}`);
});