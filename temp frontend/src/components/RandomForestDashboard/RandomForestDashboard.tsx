import React, { useState, useEffect } from 'react';
import RandomForestCharts from './RandomForestCharts';

// Mapping objects
const genderMap: Record<number, string> = { 0: 'Male', 1: 'Female' };
const ethnicityMap: Record<number, string> = {
  0: 'Caucasian',
  1: 'African American',
  2: 'Asian',
  3: 'Other'
};
const parentalEducationMap: Record<number, string> = {
  0: 'None',
  1: 'High School',
  2: 'Some College',
  3: "Bachelor's",
  4: 'Higher'
};
const parentalSupportMap: Record<number, string> = {
  0: 'None',
  1: 'Low',
  2: 'Moderate',
  3: 'High',
  4: 'Very High'
};

type RawUserInput = Record<number, any>;

type PredictionResult = {
  prediction: number;
  featureImportance?: { name: string; importance: number }[];
};

interface RandomForestDashboardProps {
  userInput: RawUserInput;
  predictionResult: PredictionResult;
}

function mapUserInput(rawUserInput: RawUserInput) {
  return {
    age: parseFloat(rawUserInput[1]),
    studyTimeWeekly: parseFloat(rawUserInput[5]),
    absences: parseInt(rawUserInput[6], 10),
    gpa: parseFloat(rawUserInput[9]),
    gender: genderMap[rawUserInput[2]],
    ethnicity: ethnicityMap[rawUserInput[3]],
    parentalEducation: parentalEducationMap[rawUserInput[4]],
    parentalSupport: parentalSupportMap[rawUserInput[7]],
    tutoring: rawUserInput[8]?.includes('tutoring'),
    extracurricular: rawUserInput[8]?.includes('extracurricular'),
    sports: rawUserInput[8]?.includes('sports'),
    music: rawUserInput[8]?.includes('music'),
    volunteering: rawUserInput[8]?.includes('volunteering')
  };
}

export default function RandomForestDashboard({ userInput, predictionResult }: RandomForestDashboardProps) {
  const [datasetStats, setDatasetStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/Mitch_dataset_stats')
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

  if (loading) return <div>Loading stats...</div>;

  const mergedDatasetStats = {
    ...datasetStats,
    featureImportance: predictionResult?.featureImportance || datasetStats.featureImportance,
  };

  return (
    <div>
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <h1>Letter Grade Questionnaire Dashboard</h1>
    </div>
      <RandomForestCharts
        datasetStats={mergedDatasetStats}
        userInput={userInput}
        predictionResult={predictionResult?.prediction}
      />
    </div>
  );
}
