import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, Legend } from 'recharts';

const ExamChart = ({ datasetStats, predictionResult }) => {
    const userScore = parseFloat(predictionResult);
    const avgScore = parseFloat(datasetStats.exam_score_avg);
    
    // Create grade ranges for context
    const gradeRanges = [
        { min: 0, max: 50, grade: 'F', fill: '#ff6b6b' },
        { min: 50, max: 60, grade: 'D', fill: '#ffa94d' },
        { min: 60, max: 70, grade: 'C', fill: '#ffd43b' },
        { min: 70, max: 80, grade: 'B', fill: '#69db7c' },
        { min: 80, max: 90, grade: 'A', fill: '#4dabf7' },
        { min: 90, max: 100, grade: 'A+', fill: '#8884d8' }
    ];
    
    // Find user's grade
    const userGradeDict = gradeRanges.find(range => 
        userScore >= range.min && userScore <= range.max
    );
    
    // Create percentile indicators
    const percentileData = [
        { name: "25th Percentile", score: datasetStats.exam_score_percentiles['25'], description: "25% of students score below this" },
        { name: "Median", score: datasetStats.exam_score_percentiles['50'], description: "50% of students score below this" },
        { name: "75th Percentile", score: datasetStats.exam_score_percentiles['75'], description: "75% of students score below this" },
        { name: "90th Percentile", score: datasetStats.exam_score_percentiles['90'], description: "90% of students score below this" }
    ];
    
    // Create user percentile text (assumes you have this data)
    const getUserPercentile = () => {
        // This is a simplification - ideally you'd get the actual percentile from the backend
        if (userScore < datasetStats.exam_score_percentiles['25']) return "bottom 25%";
        if (userScore < datasetStats.exam_score_percentiles['50']) return "25th-50th percentile";
        if (userScore < datasetStats.exam_score_percentiles['75']) return "50th-75th percentile";
        if (userScore < datasetStats.exam_score_percentiles['90']) return "75th-90th percentile";
        return "top 10%";
    };

    // Change the chartData structure to have each grade as a separate bar segment
    const chartData = [{
        name: "Score Range",
        F: 50,     // 0-50
        D: 10,     // 50-60
        C: 10,     // 60-70
        B: 10,     // 70-80
        A: 10,     // 80-90
        'A+': 10   // 90-100
    }];
    
    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-2">Your Predicted Score: {userScore.toFixed(1)}%</h2>
            <p className="mb-4">Grade: <span className="font-bold" style={{color: userGradeDict?.fill}}>{userGradeDict?.grade}</span></p>
            
            <div style={{ width: '80vw', height: '50vh' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                        data={chartData}
                        layout="vertical"
                        barCategoryGap={0}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" domain={[0, 100]} />
                        <YAxis type="category" dataKey="name" hide />
                        <Tooltip 
                            formatter={(value, name) => {
                                // Find the range for this grade
                                const range = gradeRanges.find(r => r.grade === name);
                                // Return formatted string: "F: 0-50"
                                return [range ? `${range.min}-${range.max}` : value, name];
                            }}
                        />
                        <Legend />
                        
                        {/* Grade bands */}
                        {gradeRanges.map((range) => (
                        <Bar 
                            key={range.grade}
                            dataKey={range.grade === 'A+' ? 'A+' : range.grade}  // Use exact grade as dataKey
                            name={range.grade}
                            stackId="stack"
                            fill={range.fill}
                            barSize={70}
                        />
                    ))}
                        
                        {/* Percentile markers */}
                        {percentileData.map((item, index) => (
                            <ReferenceLine
                                key={index}
                                x={item.score}
                                stroke="#000"
                                strokeWidth={1}
                                isFront={true}
                                label={item.name}
                            />
                        ))}
                        
                        {/* User score */}
                        <ReferenceLine
                            x={userScore}
                            stroke="red"
                            strokeWidth={3}
                            isFront={true}
                            label="Your Score"
                        />
                        
                        {/* Average score */}
                        <ReferenceLine
                            x={avgScore}
                            stroke="green"
                            strokeWidth={2}
                            isFront={true}
                            label="Average"
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            
            <div className="mt-4 p-4 bg-gray-100 rounded">
                <h3 className="font-bold mb-2">What This Means:</h3>
                <p>Your predicted score of <span className="font-bold">{userScore.toFixed(1)}%</span> falls in the <span className="font-bold">{getUserPercentile()}</span> of all students.</p>
                <p className="mt-2">This score corresponds to a grade of <span className="font-bold" style={{color: userGradeDict?.fill}}>{userGradeDict?.grade}</span>.</p>
                <p className="mt-2">The class average is <span className="font-bold">{avgScore.toFixed(1)}%</span>.</p>
            </div>
        </div>
    );
};

export default ExamChart;