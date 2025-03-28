import React, { useEffect, useState } from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer } from 'recharts';

const BestPerformersChart = ({ datasetStats, userInputs }) => {
    const [topCategoricalFeatures, setTopCategoricalFeatures] = useState([]);
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
            // Numerical features - normalized to 0-100%
            { 
                feature: 'Study Hours', 
                'Top Students': (datasetStats.top_students_avg.hours_studied / 80) * 100,
                'Average Students': (datasetStats.hours_studied_avg / 80) * 100,
                'Your Profile': (userInputs.hoursStudied / 80) * 100
            },
            {
                feature: 'Attendance',
                'Top Students': datasetStats.top_students_avg.attendance,
                'Average Students': datasetStats.attendance_avg,
                'Your Profile': userInputs.attendance
            },
            {
                feature: 'Prior Performance',
                'Top Students': datasetStats.top_students_avg.previous_scores,
                'Average Students': datasetStats.previous_scores_avg,
                'Your Profile': userInputs.previousScores
            },
            {
                feature: 'Tutoring',
                'Top Students': (datasetStats.top_students_avg.tutoring_sessions / 30) * 100,
                'Average Students': (datasetStats.tutoring_sessions_avg / 30) * 100,
                'Your Profile': (userInputs.tutoringSessions / 30) * 100
            }
        ];

        // FINDING MOST IMPACTFUL CATEGORICAL FEATURES
        // Calculates the difference between top students and average for each categorical feature
        const categoricalDifferences = {};
        Object.keys(datasetStats.top_students_categorical).forEach(key => {
            const topValue = datasetStats.top_students_categorical[key];
            const avgValue = datasetStats.avg_categorical[key];
            categoricalDifferences[key] = Math.abs(topValue - avgValue);
        });

        // Sort and get top 3 features
        const topCategoricalFeatures = Object.entries(categoricalDifferences)
        .sort((a, b) => b[1] - a[1])  // Sort by difference (descending)
        .slice(0, 3)                  // Take top 3
        .map(entry => entry[0]);      // Get just the feature names
        
        setTopCategoricalFeatures(topCategoricalFeatures);

        console.log("Most impactful categorical features:", topCategoricalFeatures);

        // Add categorical features if they exist - normalize from 1-3 to 0-100%
        // 1 = 0%, 2 = 50%, 3 = 100%
        topCategoricalFeatures.forEach(featureKey => {
            // Format the display name (convert snake_case to Title Case)
            const displayName = featureKey.split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
            
            // Add to radar data
            data.push({
                feature: displayName,
                'Top Students': ((datasetStats.top_students_categorical[featureKey] - 1) / 2) * 100,
                'Average Students': ((datasetStats.avg_categorical[featureKey] - 1) / 2) * 100,
                'Your Profile': getCategoryPercentage(featureKey)
            });
        });
        

        setRadarData(data);
    }, [datasetStats, userInputs]);
    

    // Helper function to get category values as percentages (0-100%)
    function getCategoryPercentage(category) {
        // Convert backend key format (snake_case) to frontend format (camelCase)
        const camelCase = category.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
        
        // Map of categories that use High/Medium/Low scale
        const highMediumLowCategories = [
            'parental_involvement', 
            'access_to_resources', 
            'motivation_level',
            'family_income',
            'teacher_quality'
        ];
        
        // Map of categories that use Yes/No scale
        const yesNoCategories = [
            'extracurricular_activities',
            'internet_access',
            'learning_disabilities'
        ];


        // Handle High/Medium/Low categories
        if (highMediumLowCategories.includes(category)) {
            const value = userInputs[camelCase];
            return value === 'High' ? 100 : 
                   value === 'Medium' ? 50 : 0;
        }
        
        // Handle Yes/No categories
        if (yesNoCategories.includes(category)) {
            return userInputs[camelCase] === 'Yes' ? 100 : 0;
        }
        
        // Special case for peer influence
        if (category === 'peer_influence') {
            const value = userInputs[camelCase];
            return value === 'Positive' ? 100 : 
                   value === 'Neutral' ? 50 : 0;
        }
        
        // Special case for parental education level
        if (category === 'parental_education_level') {
            const value = userInputs[camelCase];
            return value === 'Postgraduate' ? 100 : 
                   value === 'College' ? 50 : 0;
        }

        // Could add more special cases for other categories if needed
        
        // Default case
        return 0;
    }
    
    // Find the most significant differences between top students and average
    const findKeyInsights = () => {
        const insights = [];
        
        // Add numerical insights
        const topHrs = datasetStats.top_students_avg.hours_studied
        const avgHrs = datasetStats.hours_studied_avg
        const studyHoursDiff = Math.round(topHrs - avgHrs);
        if (studyHoursDiff > 0) {
            insights.push(`Top-performing students spend <strong>${Math.round(topHrs)} hours/week (~${Math.round(topHrs/7)} hours/day)</strong> studying, ${studyHoursDiff} hours more than average students (who spend <strong>~${Math.round(avgHrs/7)} hours/day</strong> studying)`);
        }
        
        const attendanceDiff = Math.round(datasetStats.top_students_avg.attendance - datasetStats.attendance_avg);
        if (attendanceDiff > 0) {
            insights.push(`Attendance rates for top students average <strong>${Math.round(datasetStats.top_students_avg.attendance)}%</strong>, ${attendanceDiff}% higher than average.`);
        }

        // Add insights for previous scores
        const prevScoresDiff = Math.round(datasetStats.top_students_avg.previous_scores - datasetStats.previous_scores_avg);
        if (prevScoresDiff > 0) {
            insights.push(`Top-performing students typically had <strong>previous scores of ${Math.round(datasetStats.top_students_avg.previous_scores)}%</strong>, ${prevScoresDiff}% higher than average students.`);
        }

        // Add insights for tutoring sessions
        const tutoringDiff = Math.round(datasetStats.top_students_avg.tutoring_sessions - datasetStats.tutoring_sessions_avg);
        if (tutoringDiff > 0) {
            insights.push(`Top students attend <strong>${Math.round(datasetStats.top_students_avg.tutoring_sessions)} tutoring sessions per month</strong> on average, ${tutoringDiff} more than the typical student.`);
        }
        
        
        // Add categorical insights if they show meaningful differences
        topCategoricalFeatures.forEach(feature => {
            const diff = (datasetStats.top_students_categorical[feature] - 
                        datasetStats.avg_categorical[feature]).toFixed(2);
            
            if (diff > 0.1) {
                // Format the feature name for display
                const displayName = feature.split('_')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
                
                // Create appropriate insight text based on the feature
                let insightText = '';
                
                if (feature === 'parental_education_level') {
                    insightText = `Higher parental education level is associated with better student performance <strong>(+${diff} points from average)</strong>`;
                } 
                else if (feature === 'family_income') {
                    insightText = `Students from higher income families tend to perform better academically <strong>(+${diff} points from average)</strong>`;
                }
                else if (feature === 'teacher_quality') {
                    insightText = `Higher teacher quality correlates with improved student outcomes <strong>(+${diff} points from average)</strong>`;
                }
                else {
                    // Generic message for other features if I want to add more
                    insightText = `Higher ${displayName} is associated with better academic performance <strong>(+${diff} points from average)</strong>`;
                }
                
                insights.push(insightText);
            }
        });
        
        return insights;
    };

    const insights = findKeyInsights();

    return (
        <div>
            <p style={{ textAlign: 'center' }}>This radar chart shows how your profile compares to both average students and top performers</p>
            
            <div style={{ width: '80vw', height: '50vh' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart outerRadius="87%" data={radarData} >
                        <PolarGrid />
                        <PolarAngleAxis dataKey="feature" tick={{ fill: '#b2b5b8', fontWeight: 'bold' }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} />
                        
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
                        <li key={index} dangerouslySetInnerHTML={{ __html: insight }} style={{margin: '1.5vh 0'}}/>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default BestPerformersChart;