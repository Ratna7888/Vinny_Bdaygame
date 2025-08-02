import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import Level1 from './components/Level1';
import Level2 from './components/Level2';
import FinaleIntro from './components/FinaleIntro';
import TreasureHunt from './components/TreasureHunt';
import LevelComplete from './components/LevelComplete';
import Level3 from './components/Level3';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/level1" element={<Level1 />} />
          <Route path="/level2" element={<Level2 />} />
          <Route path="/level3" element={<Level3 />} />
          <Route path="/finale" element={<FinaleIntro />} />
          <Route path="/treasure-hunt" element={<TreasureHunt />} />
          <Route path="/level-complete" element={<LevelComplete />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;