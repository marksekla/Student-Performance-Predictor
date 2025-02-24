import React, { useState, useEffect } from 'react';
import ExamChart from './ExamChart';
import NumericalCharts from './NumericalCharts';
import CategoricalCharts from './CategoricalCharts';


const ChartsTest = () => {
    const [datasetStats, setDatasetStats] = useState(null);
    const [predictionResult, setPredictionResult] = useState(null);
    
    // Sample user input data (matching your model's features)
    const sampleUserInput = {
        hoursStudied: 25,
        previousScores: 85,
        physicalActivity: 5,
        attendance: 90,
        tutoringSessions: 4,
        extracurricularActivities: "No",
        internetAccess: "Yes",
        learningDisabilities: "No",
        gender: "Male",
        distanceFromHome: "Near",
        parentalInvolvement: "Low",
        accessToResources: "High",
        motivationLevel: "Medium",
        familyIncome: "Medium",
        teacherQuality: "Medium",
        peerInfluence: "Neutral",
        parentalEducationLevel: "Postgraduate"
    };
    
    // Fetch dataset statistics
    useEffect(() => {
        fetch('http://localhost:5000/Salman_dataset_stats')
        .then(response => response.json())
        .then(data => setDatasetStats(data))
        .catch(error => console.error('Error fetching dataset stats:', error));
        
        // For testing without a form, also fetch a prediction
        fetch('http://localhost:5000/linear_regression', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(sampleUserInput)
        })
        .then(response => response.json())
        .then(data => setPredictionResult(data.prediction))
        .catch(error => console.error('Error fetching prediction:', error));
    }, []);
    

    // Wait for data to load
    if (!datasetStats || !predictionResult) return <div>Loading charts...</div>;

    
    return (
        <div className="p-4">
            <ExamChart datasetStats={datasetStats} predictionResult={predictionResult} />

            <hr />

            <h2 className="text-lg font-bold mb-4">Your Inputs vs Dataset Distributions</h2>
            <NumericalCharts datasetStats={datasetStats} sampleUserInput={sampleUserInput} />
            <hr />
            <CategoricalCharts datasetStats={datasetStats} sampleUserInput={sampleUserInput} />
        </div>
    );
};

export default ChartsTest;