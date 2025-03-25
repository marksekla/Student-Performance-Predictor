import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, Legend, LabelList } from 'recharts';

const CategoricalCharts = ({ datasetStats, userInputs }) => {
    // Binary features data preparation
    const binaryFeatures = [
        {
            title: 'Extra Curricular Activities',
            key: 'extra_curricular_dist',
            userInput: 'extracurricularActivities'
        },
        {
            title: 'Internet Access',
            key: 'internet_access_dist',
            userInput: 'internetAccess'
        },
        {
            title: 'Learning Disabilities',
            key: 'learning_disabilities_dist',
            userInput: 'learningDisabilities'
        },
        {
            title: 'Gender',
            key: 'gender_dist',
            userInput: 'gender'
        }
    ];

    // Multi-category features data preparation
    const multiFeatures = [
        {
            title: 'Distance from Home',
            key: 'distance_from_home_dist',
            userInput: 'distanceFromHome'
        },
        {
            title: 'Parental Involvement',
            key: 'parental_involvement_dist',
            userInput: 'parentalInvolvement'
        },
        {
            title: 'Access to Resources',
            key: 'access_to_resources_dist',
            userInput: 'accessToResources'
        },
        {
            title: 'Motivation Level',
            key: 'motivation_level_dist',
            userInput: 'motivationLevel'
        },
        {
            title: 'Family Income',
            key: 'family_income_dist',
            userInput: 'familyIncome'
        },
        {
            title: 'Teacher Quality',
            key: 'teacher_quality_dist',
            userInput: 'teacherQuality'
        },
        {
            title: 'Peer Influence',
            key: 'peer_influence_dist',
            userInput: 'peerInfluence'
        },
        {
            title: 'Parent Education Level',
            key: 'parental_edu_level_dist',
            userInput: 'parentalEducationLevel'
        }
    ];

    // Function to prepare data for a single chart
    const prepareChartData = (distribution, userChoice) => {
        return Object.entries(distribution).map(([category, percentage]) => ({
            category,
            percentage,
            isUserChoice: category === userChoice
        }));
    };

    // Custom tooltip that shows all values
    const CustomTooltip = ({ active, payload }) => {
        if (!active || !payload || !payload.length) return null;
        
        return (
            <div style={{ 
                backgroundColor: 'white', 
                padding: '10px', 
                border: '1px solid #ccc',
                borderRadius: '5px'
            }}>
                <p style={{ margin: 0, fontWeight: 'bold' }}>Distribution:</p>
                {payload[0].payload.allData.map((item, index) => (
                    <p key={index} style={{ margin: '5px 0' }}>
                        <span style={{ 
                            display: 'inline-block', 
                            width: '10px', 
                            height: '10px', 
                            backgroundColor: item.isUserChoice ? '#ff6b6b' : '#82ca9d',
                            marginRight: '5px'
                        }}></span>
                        {item.category}: {item.percentage.toFixed(1)}% {item.isUserChoice && <span style={{color: '#ff6b6b', fontWeight: 'bold'}}>(Your Choice)</span>}
                    </p>
                ))}
            </div>
        );
    };

    // Render a single chart
    const renderFeatureChart = (title, data, height = 250) => {
        // Add the complete data to each entry for the custom tooltip
        const enhancedData = data.map(entry => ({
            ...entry,
            allData: data  // Include all data in each entry
        }));

        return (
            <div style={{ width: '100%', height: height, marginBottom: '20px' }}>
                <h4 style={{ textAlign: 'center', marginBottom: '10px' }}>{title}</h4>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={enhancedData} margin={{ top: 10, right: 10, left: 10, bottom: 25 }}>
                        <XAxis dataKey="category" />
                        <YAxis label={{ value: '%', angle: -90, position: 'insideLeft' }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend 
                            payload={[
                                { value: 'Your Choice', type: 'square', color: '#ff6b6b' },
                                { value: 'Dataset Distribution', type: 'square', color: '#82ca9d' }
                            ]}
                        />
                        <Bar dataKey="percentage">
                            {enhancedData.map((entry, index) => (
                                <Cell 
                                    key={`cell-${index}`}
                                    fill={entry.isUserChoice ? '#ff6b6b' : '#82ca9d'} 
                                />
                            ))}
                            <LabelList dataKey="percentage" position="top" formatter={(value) => `${value.toFixed(1)}%`} />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        );
    };

    return (
        <>            
            <h3 style={{ textAlign: 'center', margin: '12vh 0 4vh' }}>Binary Features</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {binaryFeatures.map(feature => {
                    const chartData = prepareChartData(
                        datasetStats[feature.key],
                        userInputs[feature.userInput]
                    );
                    return (
                        <div key={feature.key} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '10px' }}>
                            {renderFeatureChart(feature.title, chartData)}
                        </div>
                    );
                })}
            </div>

            <h3 style={{ textAlign: 'center', margin: '12vh 0 4vh' }}>Multi-Category Features</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {multiFeatures.map(feature => {
                    const chartData = prepareChartData(
                        datasetStats[feature.key],
                        userInputs[feature.userInput]
                    );
                    return (
                        <div key={feature.key} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '10px' }}>
                            {renderFeatureChart(feature.title, chartData)}
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default CategoricalCharts;