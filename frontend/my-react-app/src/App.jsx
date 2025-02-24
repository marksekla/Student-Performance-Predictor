import React, { useState } from 'react';
import PredictionForm from './components/PredictionForm';
import Results from './components/Results';
import ChartsTest from './components/charts/ChartsTest';

function App() {
  // Manage prediction results in state
  const [predictionResult, setPredictionResult] = useState(null);

  // Callback to update the prediction result
  const handlePrediction = (result) => {
    setPredictionResult(result);
  };

  return (
    <>
      <div className="App">
        <h1>Student Performance Predictor</h1>
        <PredictionForm onPrediction={handlePrediction} />
        <Results result={predictionResult} />
      </div>

      <div className="min-h-screen bg-gray-100">
        <ChartsTest />
      </div>
    </>
  );
}

export default App;
