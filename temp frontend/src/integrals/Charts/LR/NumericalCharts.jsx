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
        <div className="p-4">
            <h3 className="text-lg font-bold mb-4">Numerical Features Distribution</h3>
            <div style={{ width: '80vw', height: '50vh' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={numericalData} barGap={1}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="user" fill="#82ca9d" name="Your Input" />
                        <Bar dataKey="average" fill="#8884d8" name="Dataset Average" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );

}

export default NumericalCharts;