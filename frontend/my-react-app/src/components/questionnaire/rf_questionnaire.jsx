import React, { useState } from 'react';
import '../../styles/questionnaire/questionnaire.css';

const questions = [
    {
        id: 1,
        text: 'What is your age?',
        type: 'number',
        inputProps: { step: '1', min: '0' },
    },
    {
        id: 2,
        text: 'What is your Gender?',
        type: 'selection',
        subtype: 'button-image', // for button with image
        options: [
            { label: 'Male', value: 0, image: 'male.png' }, // replace with your image URL
            { label: 'Female', value: 1, image: 'female.png' }, // replace with your image URL
        ],
    },
    {
        id: 3,
        text: 'What is your Ethnicity?',
        type: 'selection',
        options: [
            { label: 'Caucasian', value: 0 },
            { label: 'African American', value: 1 },
            { label: 'Asian', value: 2 },
            { label: 'Other', value: 3 },
        ],
    },
    {
        id: 4,
        text: "What education did your parents complete?",
        type: 'selection',
        options: [
            { label: 'None', value: 0 },
            { label: 'High School', value: 1 },
            { label: 'Some College', value: 2 },
            { label: "Bachelor's", value: 3 },
            { label: 'Higher', value: 4 },
        ],
    },
    {
        id: 5,
        text: 'How many hours do you study per week?',
        type: 'number',
        inputProps: { step: '0.1', min: '0' },
    },
    {
        id: 6,
        text: 'How many absences did you have during your last semester?',
        type: 'number',
        inputProps: { step: '1', min: '0' },
    },
    {
        id: 7,
        text: 'How supportive are parents with your education?',
        type: 'selection',
        options: [
            { label: 'None', value: 0 },
            { label: 'Low', value: 1 },
            { label: 'Moderate', value: 2 },
            { label: 'High', value: 3 },
            { label: 'Very High', value: 4 },
        ],
    },
    {
        id: 8,
        text: 'Choose all that apply: Tutoring, Extracurricular, Sports, Music, Volunteering',
        type: 'multi',
        options: [
            { label: 'Tutoring', value: 'tutoring' },
            { label: 'Extracurricular', value: 'extracurricular' },
            { label: 'Sports', value: 'sports' },
            { label: 'Music', value: 'music' },
            { label: 'Volunteering', value: 'volunteering' },
        ],
    },
    {
        id: 9,
        text: 'What is your GPA (Grade point average)?',
        type: 'number',
        inputProps: { step: '0.1', min: '0', max: '4' },
    },
];

function Questionnaire({ onPrediction, onUserInput, modelType }) {
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

    // For single selection buttons (including image-based ones)
    const handleSelectionChange = (value) => {
        setAnswers({
            ...answers,
            [currentQuestion.id]: value,
        });
    };

    // For multi-select questions
    const handleMultiChange = (value) => {
        const currentSelections = answers[currentQuestion.id] || [];
        if (currentSelections.includes(value)) {
            setAnswers({
                ...answers,
                [currentQuestion.id]: currentSelections.filter((item) => item !== value),
            });
        } else {
            setAnswers({
                ...answers,
                [currentQuestion.id]: [...currentSelections, value],
            });
        }
    };

    // When on last question, build the payload and submit it
    const nextStep = async () => {
        if (currentStep < questions.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            // When all questions are answered, first send the user input data upward
            if (onUserInput) {
                onUserInput(answers);
            }
            // Map collected answers to the expected payload structure
            const payload = {
                Age: parseFloat(answers[1]),
                Gender: answers[2] === 0 ? 'Male' : 'Female',
                Ethnicity:
                answers[3] === 0
                ? 'Caucasian'
                : answers[3] === 1
                ? 'African American'
                : answers[3] === 2
                ? 'Asian'
                : 'Other',
                ParentalEducation:
                answers[4] === 0
                ? 'None'
                : answers[4] === 1
                ? 'High School'
                : answers[4] === 2
                ? 'Some College'
                : answers[4] === 3
                ? "Bachelor's"
                : 'Higher',
                StudyTimeWeekly: parseFloat(answers[5]),
                Absences: parseFloat(answers[6]),
                // For parental support, you could send the numeric value or map it similarly:
                ParentalSupport: answers[7],
                // Map multi-select answers to booleans:
                Tutoring: Array.isArray(answers[8]) ? answers[8].includes('tutoring') : false,
                Extracurricular: Array.isArray(answers[8]) ? answers[8].includes('extracurricular') : false,
                Sports: Array.isArray(answers[8]) ? answers[8].includes('sports') : false,
                Music: Array.isArray(answers[8]) ? answers[8].includes('music') : false,
                Volunteering: Array.isArray(answers[8]) ? answers[8].includes('volunteering') : false,
                GPA: parseFloat(answers[9]),
            };

            // Choose endpoint based on modelType prop.
            const endpoint = 'http://localhost:5000/predict_random_forest';

            try {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
                const data = await response.json();
                if (data.success) {
                    // Pass the prediction back to the parent component
                    if (onPrediction) {
                        onPrediction(data.prediction);
                    }
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

    // Render question based on type
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
                                {currentQuestion.subtype === 'button-image' && option.image ? (
                                    <img
                                        src={option.image}
                                        alt={option.label}
                                        style={{ width: '50px', height: '50px' }}
                                    />
                                ) : (
                                    option.label
                                )}
                            </button>
                        ))}
                    </div>
                );
            case 'multi':
                return (
                    <div className="options-grid">
                        {currentQuestion.options.map((option) => (
                            <label
                                key={option.value}
                                className={`option-button multi-option ${
                                    (answers[currentQuestion.id] || []).includes(option.value)
                                        ? 'selected'
                                        : ''
                                }`}
                            >
                                <input
                                    type="checkbox"
                                    className="multi-checkbox"
                                    checked={(answers[currentQuestion.id] || []).includes(option.value)}
                                    onChange={() => handleMultiChange(option.value)}
                                />
                                {option.label}
                            </label>
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

export default Questionnaire;
