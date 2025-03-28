import React, { useState, useEffect } from 'react';
import ExamChart from './specific_charts/ExamChart';
import NumericalCharts from './specific_charts/NumericalCharts';
import CategoricalCharts from './specific_charts/CategoricalCharts';
import BestPerformersChart from './specific_charts/BestPerformersChart';


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
        <div>
            <ExamChart datasetStats={datasetStats} predictionResult={predictionResult} />

            <hr style={{margin: '5vh 0' }}/>

            <h2 style={{textAlign: 'center'}}>Your Inputs vs Other Students</h2>
            <NumericalCharts datasetStats={datasetStats} userInputs={userInputs} />
            <CategoricalCharts datasetStats={datasetStats} userInputs={userInputs} />

            <hr style={{margin: '7vh 0' }}/>

            <h2 style={{textAlign: 'center'}}>Patterns of Best Performing Students</h2>
            <BestPerformersChart datasetStats={datasetStats} userInputs={userInputs} />
        </div>
    );
};

export default ChartsTest;