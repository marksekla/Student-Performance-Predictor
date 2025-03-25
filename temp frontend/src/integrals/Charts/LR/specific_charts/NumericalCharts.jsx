import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, Legend } from 'recharts';

const NumericalCharts = ({ datasetStats, userInputs }) => {

    const numericalData = [
            { 
                name: 'Study Hours', 
                user: userInputs.hoursStudied, 
                average: datasetStats.hours_studied_avg.toFixed(1) 
            },
            { 
                name: 'Previous Scores', 
                user: userInputs.previousScores, 
                average: datasetStats.previous_scores_avg.toFixed(1) 
            },
            { 
                name: 'Physical Activity', 
                user: userInputs.physicalActivity, 
                average: datasetStats.physical_activity_avg.toFixed(1) 
            },
            { 
                name: 'Attendance', 
                user: userInputs.attendance, 
                average: datasetStats.attendance_avg.toFixed(1) 
            },
            { 
                name: 'Tutoring Sessions', 
                user: userInputs.tutoringSessions, 
                average: datasetStats.tutoring_sessions_avg.toFixed(1) 
            }
        ];

    return (
        <>
            <h3 style={{ textAlign: 'center', margin: '12vh 0 4vh' }}>Numerical Features</h3>
            <div style={{ width: '80vw', height: '50vh' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={numericalData} barGap={0} >
                        <XAxis dataKey="name" tick={{ fill: '#b2b5b8' }} />
                        <YAxis tick={{ fill: '#b2b5b8' }} />
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
                                        fontWeight: 'bold', 
                                        textAlign: 'center'
                                    }}>
                                        {label}
                                    </p>
                                    
                                    {payload.map((entry, index) => (
                                    <p key={index} style={{ 
                                        margin: '5px 0 0',
                                        color: entry.dataKey === 'user' ? '#82ca9d' : '#8884d8'
                                    }}>
                                        {entry.name}: {entry.value}
                                    </p>
                                    ))}
                                </div>
                                );
                            }}
                        />
                        <Legend />
                        <Bar dataKey="user" fill="#82ca9d" name="Your Input" />
                        <Bar dataKey="average" fill="#8884d8" name="Dataset Average" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </>
    );

}

export default NumericalCharts;