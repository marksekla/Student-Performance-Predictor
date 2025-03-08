// src/pages/LinearRegressionQuestionnaire.jsx
import React, { useState } from 'react';
import Questionnaire from '../questionnaire/rf_questionnaire';
import ChartsTest from '../charts/ChartsTest';

function LinearRegressionQuestionnaire() {
  const [predictionResult, setPredictionResult] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handlePrediction = (result) => {
    setPredictionResult(result);
    setIsSubmitted(true);
  };

  return (
    <div style={{ margin: '20px' }}>
      <h2>Linear Regression Questionnaire</h2>
      <Questionnaire onPrediction={handlePrediction} modelType="linearRegression" />

      {/* Only show charts if the user has submitted */}
      {isSubmitted && (
        <div style={{ marginTop: '20px' }}>
          <h3>Results</h3>
          <ChartsTest results={predictionResult} />
        </div>
      )}
    </div>
  );
}

export default LinearRegressionQuestionnaire;
