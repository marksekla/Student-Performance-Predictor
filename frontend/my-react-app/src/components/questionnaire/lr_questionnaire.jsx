import React, { useState } from 'react';
import '../../styles/questionnaire/questionnaire.css';


// Questions specific to the Linear Regression model based on your project summary
const questions = [
    {
        id: 1,
        text: 'How many hours do you study per week?',
        type: 'number',
        inputProps: { step: '1', min: '0', max: '80' },
        key: 'hoursStudied'
    },
    {
        id: 2,
        text: 'What were your previous scores (out of 100)?',
        type: 'number',
        inputProps: { step: '1', min: '0', max: '100' },
        key: 'previousScores'
    },
    {
        id: 3,
        text: 'How many hours of physical activity do you do per week?',
        type: 'number',
        inputProps: { step: '1', min: '0', max: '40' },
        key: 'physicalActivity'
    },
    {
        id: 4,
        text: 'What is your typical attendance percentage?',
        type: 'number',
        inputProps: { step: '1', min: '0', max: '100' },
        key: 'attendance'
    },
    {
        id: 5,
        text: 'How many tutoring sessions have you attended last month?',
        type: 'number',
        inputProps: { step: '1', min: '0', max: '30' },
        key: 'tutoringSessions'
    },
    {
        id: 6,
        text: 'Do you participate in extracurricular activities?',
        type: 'selection',
        options: [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' }
        ],
        key: 'extracurricularActivities'
    },
    {
        id: 7,
        text: 'Do you have internet access at home?',
        type: 'selection',
        options: [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' }
        ],
        key: 'internetAccess'
    },
    {
        id: 8,
        text: 'Do you have any learning disabilities?',
        type: 'selection',
        options: [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' }
        ],
        key: 'learningDisabilities'
    },
    {
        id: 9,
        text: 'What is your gender?',
        type: 'selection',
        options: [
            { label: 'Male', value: 'Male' },
            { label: 'Female', value: 'Female' }
        ],
        key: 'gender'
    },
    {
        id: 10,
        text: 'How far do you live from school?',
        type: 'selection',
        options: [
            { label: 'Near', value: 'Near' },
            { label: 'Moderate', value: 'Moderate' },
            { label: 'Far', value: 'Far' }
        ],
        key: 'distanceFromHome'
    },
    {
        id: 11,
        text: 'How involved are your parents in your academics?',
        type: 'selection',
        options: [
            { label: 'Low', value: 'Low' },
            { label: 'Medium', value: 'Medium' },
            { label: 'High', value: 'High' }
        ],
        key: 'parentalInvolvement'
    },
    {
        id: 12,
        text: 'What is your access to learning resources?',
        type: 'selection',
        options: [
            { label: 'Low', value: 'Low' },
            { label: 'Medium', value: 'Medium' },
            { label: 'High', value: 'High' }
        ],
        key: 'accessToResources'
    },
    {
        id: 13,
        text: 'What is your motivation level?',
        type: 'selection',
        options: [
            { label: 'Low', value: 'Low' },
            { label: 'Medium', value: 'Medium' },
            { label: 'High', value: 'High' }
        ],
        key: 'motivationLevel'
    },
    {
        id: 14,
        text: "How is your family's income?",
        type: 'selection',
        options: [
            { label: 'Low', value: 'Low' },
            { label: 'Medium', value: 'Medium' },
            { label: 'High', value: 'High' }
        ],
        key: 'familyIncome'
    },
    {
        id: 15,
        text: "What is your teacher's quality?",
        type: 'selection',
        options: [
            { label: 'Low', value: 'Low' },
            { label: 'Medium', value: 'Medium' },
            { label: 'High', value: 'High' }
        ],
        key: 'teacherQuality'
    },
    {
        id: 16,
        text: "How much do your peers influence you on your academic performance?",
        type: 'selection',
        options: [
            { label: 'Positive', value: 'Positive' },
            { label: 'Neutral', value: 'Neutral' },
            { label: 'Negative', value: 'Negative' }
        ],
        key: 'peerInfluence'
    },
    {
        id: 17,
        text: "What was the highest education level any of your parents achieved?",
        type: 'selection',
        options: [
            { label: 'High School', value: 'High School' },
            { label: 'College', value: 'College' },
            { label: 'Postgraduate', value: 'Postgraduate' }
        ],
        key: 'parentalEducationLevel'
    }
];

function LRQuestionnaire({ onUserSubmit, onPrediction }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState({});
    
    const currentQuestion = questions[currentStep];
    
    // For number inputs
    const handleNumberChange = (e) => {
        setAnswers({
            ...answers,
            [currentQuestion.id]: e.target.value,
        });
    };
    
    // For single selection buttons
    const handleSelectionChange = (value) => {
        setAnswers({
            ...answers,
            [currentQuestion.id]: value,
        });
    };
    
    // When on last question, build the payload and submit it
    const nextStep = async () => {
        if (currentStep < questions.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {            
            // Map collected answers to the expected payload structure for Linear Regression
            const payload = {};
            
            // Build the payload using the question keys for proper mapping
            questions.forEach(question => {
                const answer = answers[question.id];
                question.type === 'number' ? payload[question.key] = parseFloat(answer) : payload[question.key] = answer;
            });

            onUserSubmit(payload);
            
            try {
                const response = await fetch('http://localhost:5000/predict_linear_regression', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
                const data = await response.json();
                if (data.success) {
                    // Pass the prediction back to the parent component
                    onPrediction(data.prediction);
                } else {
                    console.error('Prediction Error:', data.error);
                }
            } catch (error) {
                console.error('Error fetching prediction:', error);
            }
        }
    };
    
    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };
    
    const progressPercentage = ((currentStep + 1) / questions.length) * 100;

    const renderQuestion = () => {
        switch (currentQuestion.type) {
            case 'number':
                return (
                    <input
                        type="number"
                        className="question-input"
                        {...currentQuestion.inputProps}
                        value={answers[currentQuestion.id] || ''}
                        onChange={handleNumberChange}
                    />
                );
            case 'selection':
                return (
                    <div className="options-grid">
                        {currentQuestion.options.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => handleSelectionChange(option.value)}
                                className={`option-button ${
                                    option.value === answers[currentQuestion.id] 
                                        ? 'selected' 
                                        : ''
                                }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                );
            default:
                return null;
        }
    };
    
    return (
        <div className="questionnaire-container">
            {/* Progress Bar */}
            <div className="progress-container">
                <div 
                    className="progress-bar"
                    style={{ width: `${progressPercentage}%` }}
                ></div>
            </div>
            
            {/* Question Card */}
            <div className="question-card">
                <h2 className="question-number">
                    Question {currentStep + 1} of {questions.length}
                </h2>
                <p className="question-text">{currentQuestion.text}</p>
                {renderQuestion()}
            </div>
            
            {/* Navigation Buttons */}
            <div className="navigation-buttons">
                <button 
                    onClick={prevStep}
                    className={`nav-button prev-button ${
                        currentStep > 0 ? '' : 'disabled'
                    }`}
                    disabled={currentStep === 0}
                >
                    Previous
                </button>
                
                <button 
                    onClick={nextStep}
                    className="nav-button next-button"
                >
                    {currentStep === questions.length - 1 ? 'Submit' : 'Next'}
                </button>
            </div>
        </div>
    );
    
}

export default LRQuestionnaire;