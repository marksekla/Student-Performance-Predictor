import React, { useState, useEffect } from 'react';
import RandomForestCharts from './RandomForestCharts';

//mapping objects
const genderMap = { 0: 'Male', 1: 'Female' };
const ethnicityMap = { 0: 'Caucasian', 1: 'African American', 2: 'Asian', 3: 'Other' };
const parentalEducationMap = { 0: 'None', 1: 'High School', 2: 'Some College', 3: "Bachelor's", 4: 'Higher' };
const parentalSupportMap = { 0: 'None', 1: 'Low', 2: 'Moderate', 3: 'High', 4: 'Very High' };

function mapUserInput(rawUserInput) {
    return {
        // Numeric fields (parse from string to number):
        age: parseFloat(rawUserInput[1]),          // "18" -> 18
        studyTimeWeekly: parseFloat(rawUserInput[5]),  // "15" -> 15
        absences: parseInt(rawUserInput[6], 10),       // "2"  -> 2
        gpa: parseFloat(rawUserInput[9]),             // "3.5"-> 3.5

        // Categorical fields (map codes to strings):
        // e.g. userInput[2] === 0 => 'Male'
        gender: genderMap[rawUserInput[2]],
        ethnicity: ethnicityMap[rawUserInput[3]],
        parentalEducation: parentalEducationMap[rawUserInput[4]],
        parentalSupport: parentalSupportMap[rawUserInput[7]],

        // Multi-select booleans (check if array includes the string):
        tutoring: rawUserInput[8]?.includes('tutoring'),
        extracurricular: rawUserInput[8]?.includes('extracurricular'),
        sports: rawUserInput[8]?.includes('sports'),
        music: rawUserInput[8]?.includes('music'),
        volunteering: rawUserInput[8]?.includes('volunteering')
    };
}

function RandomForestDashboard({ userInput, predictionResult }) {
    const [datasetStats, setDatasetStats] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch the dataset statistics from your backend endpoint
    useEffect(() => {
        fetch('http://localhost:5000/Mitch_dataset_stats') // Replace with your actual endpoint URL
        .then((res) => res.json())
        .then((data) => {
            setDatasetStats(data);
            setLoading(false);
        })
        .catch((err) => {
            console.error('Error fetching dataset stats:', err);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return <div>Loading stats...</div>;
    }
    console.log('Raw userInput before mapping:', userInput);

    const mappedUserInput = mapUserInput(userInput);

    console.log('Mapped userInput:', mappedUserInput); // Verify the mapping

    // Merge feature importance from the prediction result into datasetStats.
    // predictionResult is now an object with { prediction, featureImportance }
    const mergedDatasetStats = {
        ...datasetStats,
        featureImportance: predictionResult?.featureImportance || datasetStats.featureImportance,
    };

    return (
        <div>
            <h1>Random Forest Dashboard</h1>
            <RandomForestCharts
                datasetStats={mergedDatasetStats}
                sampleUserInput={mappedUserInput} // Pass actual user input here
                predictionResult={predictionResult?.prediction} // Use the prediction value
            />
        </div>
    );
}

export default RandomForestDashboard;
