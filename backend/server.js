const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// ✅ Configure CORS once
app.use(cors({
  origin: [
    "https://vinny-bdaygame-frontend.onrender.com", // your frontend on Render
    "http://localhost:3000" // local development
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// ---------------------- API Endpoints ----------------------

// Level 1 Shopping Data
app.get('/api/clothes', (req, res) => {
  const clothes = [
    { id: 'drs1', name: 'Bodycon', imageUrl: '/images/bodycon.png', type: 'dress' },
    { id: 'drs2', name: 'Maxi', imageUrl: '/images/maxi.png', type: 'dress' },
    { id: 'top1', name: 'Crop Top', imageUrl: '/images/croptop.png', type: 'top' },
    { id: 'pnt1', name: 'Jeans', imageUrl: '/images/jeans.png', type: 'pants' },
    { id: 'pnt2', name: 'Baggy Pants', imageUrl: '/images/baggy-pants.png', type: 'pants' },
    { id: 'shoe1', name: 'Sneakers', imageUrl: '/images/sneakers.png', type: 'footwear' },
    { id: 'shoe2', name: 'Flats', imageUrl: '/images/flats.png', type: 'footwear' },
  ];
  res.json(clothes);
});

// Cheesecake Recipe
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

// Strengths List
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

// Spy Questions
app.get('/api/spy-questions', (req, res) => {
  const questions = [
    {
      question: "What is your secret agent codename (i.e., your favorite coffee order)?",
      answers: ["Caramel Macchiato", "Javachip Frappuchino", "Black Americano"],
      correct: 1
    },
    {
      question: "Your mission is to relax. What is your go-to method?",
      answers: ["Adding items to cart(Shopping)", "cooking", "Going for a long walk"],
      correct: 0
    },
    {
      question: "Which of these is your superpower?",
      answers: ["Amazing fashion sense", "Baking delicious treats", "Annoying people"],
      correct: 0
    }
  ];
  res.json(questions);
});

// ---------------------- Start Server ----------------------
app.listen(port, () => {
  console.log(`🎉 Backend server is running on http://localhost:${port}`);
});
