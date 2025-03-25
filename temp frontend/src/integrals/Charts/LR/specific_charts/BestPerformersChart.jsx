import React, { useEffect, useState } from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer } from 'recharts';

const BestPerformersChart = ({ datasetStats, userInputs }) => {
    const [radarData, setRadarData] = useState([]);
    
    // Check if required data exists
    if (!datasetStats || !datasetStats.top_students_avg || !datasetStats.top_students_categorical) {
        console.log("Missing required data for BestPerformersChart:", datasetStats);
        return <div>Loading success patterns data...</div>;
    }
    
    // Debug logs to see what's actually in the data
    useEffect(() => {
        // Create normalized radar data
        const data = [
            // Numerical features - normalized to approximate same scale as categorical (1-3)
            { 
                feature: 'Study Hours', 
                'Top Students': normalizeValue(datasetStats.top_students_avg.hours_studied, 0, 80, 1, 3),
                'Average Students': normalizeValue(datasetStats.hours_studied_avg, 0, 80, 1, 3),
                'Your Profile': normalizeValue(userInputs.hoursStudied, 0, 80, 1, 3)
            },
            {
                feature: 'Attendance',
                'Top Students': normalizeValue(datasetStats.top_students_avg.attendance, 0, 100, 1, 3),
                'Average Students': normalizeValue(datasetStats.attendance_avg, 0, 100, 1, 3),
                'Your Profile': normalizeValue(userInputs.attendance, 0, 100, 1, 3)
            },
            {
                feature: 'Prior Performance',
                'Top Students': normalizeValue(datasetStats.top_students_avg.previous_scores, 0, 100, 1, 3),
                'Average Students': normalizeValue(datasetStats.previous_scores_avg, 0, 100, 1, 3),
                'Your Profile': normalizeValue(userInputs.previousScores, 0, 100, 1, 3)
            },
            {
                feature: 'Tutoring',
                'Top Students': normalizeValue(datasetStats.top_students_avg.tutoring_sessions, 0, 30, 1, 3),
                'Average Students': normalizeValue(datasetStats.tutoring_sessions_avg, 0, 30, 1, 3),
                'Your Profile': normalizeValue(userInputs.tutoringSessions, 0, 30, 1, 3)
            }
        ];
        
        // Add categorical features if they exist
        if (datasetStats.top_students_categorical.parental_involvement) {
            data.push({
                feature: 'Parental Involvement',
                'Top Students': datasetStats.top_students_categorical.parental_involvement,
                'Average Students': datasetStats.avg_categorical.parental_involvement,
                'Your Profile': getCategoryValue('parentalInvolvement')
            });
        }
        
        if (datasetStats.top_students_categorical.motivation_level) {
            data.push({
                feature: 'Motivation Level',
                'Top Students': datasetStats.top_students_categorical.motivation_level,
                'Average Students': datasetStats.avg_categorical.motivation_level,
                'Your Profile': getCategoryValue('motivationLevel')
            });
        }
        
        if (datasetStats.top_students_categorical.access_to_resources) {
            data.push({
                feature: 'Resource Access',
                'Top Students': datasetStats.top_students_categorical.access_to_resources,
                'Average Students': datasetStats.avg_categorical.access_to_resources,
                'Your Profile': getCategoryValue('accessToResources')
            });
        }
        
        setRadarData(data);
    }, [datasetStats, userInputs]);
    
    // Helper function to normalize values to a given range
    function normalizeValue(value, minInput, maxInput, minOutput, maxOutput) {
        return ((value - minInput) / (maxInput - minInput)) * (maxOutput - minOutput) + minOutput;
    }
    
    // Helper function to get category values with proper case handling
    function getCategoryValue(category) {
        switch(category) {
            case 'parentalInvolvement':
                return userInputs.parentalInvolvement === 'High' ? 3 : 
                      userInputs.parentalInvolvement === 'Medium' ? 2 : 1;
            case 'accessToResources':
                return userInputs.accessToResources === 'High' ? 3 : 
                      userInputs.accessToResources === 'Medium' ? 2 : 1;
            case 'motivationLevel':
                return userInputs.motivationLevel === 'High' ? 3 : 
                      userInputs.motivationLevel === 'Medium' ? 2 : 1;
            default:
                return 1;
        }
    }
    
    // Find the most significant differences between top students and average
    const findKeyInsights = () => {
        const insights = [];
        
        // Add numerical insights
        const studyHoursDiff = Math.round(datasetStats.top_students_avg.hours_studied - datasetStats.hours_studied_avg);
        if (studyHoursDiff > 0) {
            insights.push(`Top-performing students spend <strong>${Math.round(datasetStats.top_students_avg.hours_studied)} hours/week</strong> studying, ${studyHoursDiff} hours more than average students.`);
        }
        
        const attendanceDiff = Math.round(datasetStats.top_students_avg.attendance - datasetStats.attendance_avg);
        if (attendanceDiff > 0) {
            insights.push(`Attendance rates for top students average <strong>${Math.round(datasetStats.top_students_avg.attendance)}%</strong>, ${attendanceDiff}% higher than average.`);
        }
        
        // Add categorical insights if they show meaningful differences
        const motivDiff = (datasetStats.top_students_categorical.motivation_level - 
                          datasetStats.avg_categorical.motivation_level).toFixed(2);
        
        const parentalDiff = (datasetStats.top_students_categorical.parental_involvement - 
                             datasetStats.avg_categorical.parental_involvement).toFixed(2);
        
        if (parseFloat(motivDiff) > 0.05) {
            insights.push(`High motivation level is strongly associated with top performance (+${motivDiff} points).`);
        }
        
        if (parseFloat(parentalDiff) > 0.05) {
            insights.push(`Higher parental involvement correlates with better academic outcomes (+${parentalDiff} points).`);
        }
        
        return insights;
    };
    
    const insights = findKeyInsights();

    return (
        <div>
            <h3 style={{ textAlign: 'center' }}>Success Patterns</h3>
            <p style={{ textAlign: 'center' }}>Key factors that differentiate top-performing students</p>
            
            <div style={{ width: '80vw', height: '50vh' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart outerRadius="80%" data={radarData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="feature" />
                        <PolarRadiusAxis angle={30} domain={[1, 3]} />
                        
                        <Radar name="Top Students" dataKey="Top Students" 
                               stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                               
                        <Radar name="Average Students" dataKey="Average Students" 
                               stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                               
                        <Radar name="Your Profile" dataKey="Your Profile" 
                               stroke="#ff6b6b" fill="#ff6b6b" fillOpacity={0.6} />
                               
                        <Legend />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
            
            <div style={{ padding: '20px' }}>
                <h4>Key Insights:</h4>
                <ul>
                    {insights.map((insight, index) => (
                        <li key={index} dangerouslySetInnerHTML={{ __html: insight }} />
                    ))}
                    <li>The radar chart shows how your profile compares to both average students and top performers.</li>
                </ul>
            </div>
        </div>
    );
};

export default BestPerformersChart;