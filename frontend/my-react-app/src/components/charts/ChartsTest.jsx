import React, { useState, useEffect } from 'react';
import ExamChart from './ExamChart';
import NumericalCharts from './NumericalCharts';
import CategoricalCharts from './CategoricalCharts';


const ChartsTest = ({userInputs, predictionResult}) => {
    const [datasetStats, setDatasetStats] = useState(null);
    
    // Fetch dataset statistics on first render
    useEffect(() => {
        fetch('http://localhost:5000/Salman_dataset_stats')
        .then(response => response.json())
        .then(data => setDatasetStats(data))
        .catch(error => console.error('Error fetching dataset stats:', error));
    }, []);
    

    // Wait for data to load
    if (!datasetStats || !predictionResult) return <div>Loading results...</div>;

    
    return (
        <div className="p-4">
            <ExamChart datasetStats={datasetStats} predictionResult={predictionResult} />

            <hr />

            <h2 className="text-lg font-bold mb-4">Your Inputs vs Dataset Distributions</h2>
            <NumericalCharts datasetStats={datasetStats} userInputs={userInputs} />
            <hr />
            <CategoricalCharts datasetStats={datasetStats} userInputs={userInputs} />
        </div>
    );
};

export default ChartsTest;