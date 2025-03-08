import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from './components/pages/home';
import RandomForestQuestionnaire from './components/pages/RandomForestQuestionnaire';
import LinearRegressionQuestionnaire from './components/pages/LinearRegressionQuestionnaire';

function App() {
  return (
    <Routes>
      {/* Home page where user picks the model */}
      <Route path="/" element={<Home />} />

      {/* Routes for each model’s questionnaire */}
      <Route path="/random-forest" element={<RandomForestQuestionnaire />} />
      <Route path="/linear-regression" element={<LinearRegressionQuestionnaire />} />
    </Routes>
  );
}

export default App;
