import React, { useState } from 'react';
import Questionnaire from '../questionnaire/rf_questionnaire';
import RandomForestDashboard from '../charts/RandomForestDashboard';



function RandomForestQuestionnaire() {
    const [predictionResult, setPredictionResult] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [userInput, setUserInput] = useState({}); // New state for user input
    
    const handlePrediction = (result) => {
        setPredictionResult(result);
        setIsSubmitted(true);
    };
    
    return (
        <div style={{ margin: '20px' }}>
            <h2>Questionnaire 1</h2>
            <Questionnaire
            onPrediction={handlePrediction}
            onUserInput={setUserInput}
            modelType="randomForest"
            />
            
            {/* Only show charts if the user has submitted */}
            {isSubmitted && (
                <div style={{ marginTop: '20px' }}>
                    <h3>Results</h3>
                    <RandomForestDashboard userInput={userInput} predictionResult={predictionResult} />
                </div>
            )}
        </div>
    );
}

export default RandomForestQuestionnaire;
