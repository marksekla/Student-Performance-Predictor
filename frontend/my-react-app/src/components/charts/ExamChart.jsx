import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, Legend } from 'recharts';

const ExamChart = ({ datasetStats, predictionResult }) => {
    // Create a bell curve-like distribution of scores
    const createDistributionData = () => {
        const mean = parseFloat(datasetStats.exam_score_avg);
        const stdDev = 5; // Approximate based on the data
        const points = [];
        
        // Create distribution points from 0-100
        for (let score = 0; score <= 100; score += 2) {
            // Approximating normal distribution
            const height = Math.exp(-0.5 * Math.pow((score - mean) / stdDev, 2));
            points.push({
                score,
                frequency: height * 100 // Scale for visibility
            });
        }
        return points;
    };
    
    const distributionData = createDistributionData();
    const userScore = parseFloat(predictionResult);
    const avgScore = parseFloat(datasetStats.exam_score_avg);
    
    const scoreRating = () => {
        if (userScore > avgScore + 10) return "Excellent";
        if (userScore > avgScore) return "Above Average";
        if (userScore > avgScore - 10) return "Average";
        return "Below Average";
    };
    
    return (
        <div className="p-4">
            <h3 className="text-xl font-bold mb-2">Your Predicted Score: {userScore.toFixed(1)}%</h3>
            <p className="mb-4">Rating: <span className="font-bold">{scoreRating()}</span></p>
            
            <div style={{ width: '80vw', height: '50vh' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={distributionData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                            dataKey="score" 
                            label={{ value: 'Exam Score', position: 'bottom' }} 
                            domain={[0, 100]}
                        />
                        <YAxis label={{ value: 'Distribution', angle: -90, position: 'insideLeft' }} />
                        <Tooltip formatter={(value, name) => name === 'frequency' ? ['', 'Score Distribution'] : [`${Number(value).toFixed(1)}%`, name]} />
                        <Legend />
                        
                        {/* User's predicted score */}
                        <ReferenceLine 
                            x={userScore} 
                            stroke="#ff6b6b" 
                            strokeWidth={2}
                            label={{ 
                                value: 'Your Score', 
                                position: 'top',
                                fill: '#ff6b6b'
                            }} 
                        />
                        
                        {/* Average score */}
                        <ReferenceLine 
                            x={avgScore} 
                            stroke="#82ca9d" 
                            strokeWidth={2}
                            label={{ 
                                value: 'Average', 
                                position: 'top',
                                fill: '#82ca9d'
                            }} 
                        />

                        {/* Distribution curve */}
                        <Area 
                            type="monotone" 
                            dataKey="frequency" 
                            fill="#bb86f7" 
                            stroke="#6b02f5" 
                            name="Score Distribution" 
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
            
            <div className="mt-4 p-4 bg-gray-100 rounded">
                <h3 className="font-bold mb-2">What This Means:</h3>
                <p>Your predicted exam score of <span className="font-bold">{userScore.toFixed(1)}%</span> is 
                {userScore > avgScore 
                    ? ` ${(userScore - avgScore).toFixed(1)} points ABOVE ` 
                    : ` ${(avgScore - userScore).toFixed(1)} points BELOW `} 
                the class average of <span className="font-bold">{avgScore.toFixed(1)}%</span>.</p>
            </div>
        </div>
    );
};

export default ExamChart;