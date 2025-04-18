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
        { name: "25th", score: datasetStats.exam_score_percentiles['25'], description: "25% of students score below this" },
        { name: "Median", score: datasetStats.exam_score_percentiles['50'], description: "50% of students score below this" },
        { name: "75th", score: datasetStats.exam_score_percentiles['75'], description: "75% of students score below this" },
        { name: "90th", score: datasetStats.exam_score_percentiles['90'], description: "90% of students score below this" }
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
        <>
            <h2>Your Predicted Score: {userScore.toFixed(1)}%</h2>
            <p>Grade: <span style={{color: userGradeDict?.fill}}>{userGradeDict?.grade}</span></p>
            
            <div style={{ width: '80vw', height: '50vh' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                        data={chartData}
                        layout="vertical"
                        barCategoryGap={0}
                        margin={{ top: 60, right: 0, left: 20, bottom: 50 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                            type="number" 
                            domain={[0, 100]} 
                            tick={{ fill: '#b2b5b8' }}
                            label={{ 
                                value: "Exam Score (%)", 
                                position: 'insideBottom',
                                offset: 0,
                                dy: 30,
                                fill: 'white',
                                fontSize: 16,
                                fontWeight: 'bold'
                            }} 
                        />
                        <YAxis type="category" dataKey="name" hide />
                        
                        <Tooltip 
                            content={({ active, payload, label }) => {
                                if (!active || !payload || !payload.length) return null;
                                
                                return (
                                    <div style={{ 
                                        backgroundColor: '#222',
                                        border: '1px solid #444',
                                        borderRadius: '4px',
                                        padding: '10px'
                                    }}>
                                        <p style={{ 
                                            margin: '0 0 1.4vh', 
                                            color: 'white',
                                            fontWeight: 'bold' ,
                                            textAlign: 'center'
                                        }}>
                                            {label}
                                        </p>

                                        {payload.map((entry, index) => {
                                            const range = gradeRanges.find(r => r.grade === entry.name);
                                            return (
                                                <p key={index} style={{ 
                                                    margin: '5px 0 0',
                                                    color: range?.fill || 'white'
                                                }}>
                                                    {entry.name}: {range ? `${range.min}-${range.max}` : entry.value}
                                                </p>
                                            );
                                        })}
                                    </div>
                                );
                            }}
                        />
                        
                        <Legend 
                            verticalAlign="top"
                            height={60}
                        />
                        
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
                                stroke="#fff"
                                strokeWidth={1}
                                isFront={true}
                                label={{
                                    value: `${item.name} Percentile`,
                                    position: index % 2 === 0 ? 'top' : 'bottom',
                                    offset: 10,
                                    fill: '#fff',
                                    fontSize: 12
                                }}
                            />
                        ))}
                        
                        {/* User score */}
                        <ReferenceLine
                            x={userScore}
                            stroke="red"
                            strokeWidth={3}
                            isFront={true}
                            label={{
                                value: "Your Score",
                                position: 'insideTopLeft',
                                offset: 15,
                                fill: 'red',
                                fontSize: 14,
                                fontWeight: 'bold'
                            }}
                        />
                        
                        {/* Average score */}
                        <ReferenceLine
                            x={avgScore}
                            stroke="green"
                            strokeWidth={3}
                            isFront={true}
                            label={{
                                value: "Average",
                                position: 'insideTopLeft',
                                offset: 15,
                                fill: 'green',
                                fontSize: 14,
                                fontWeight: 'bold'
                            }}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            
            <div>
                <h3>What This Means:</h3>
                <p>Your predicted score of <span>{userScore.toFixed(1)}%</span> falls in the <span>{getUserPercentile()}</span> of all students.</p>
                <p>This score corresponds to a grade of <span style={{color: userGradeDict?.fill}}>{userGradeDict?.grade}</span>.</p>
                <p>The class average is <span>{avgScore.toFixed(1)}%</span>.</p>
            </div>
        </>
    );
};

export default ExamChart;