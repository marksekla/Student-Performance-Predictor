import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, Legend } from 'recharts';

const CategoricalCharts = ({ datasetStats, sampleUserInput }) => {
    const binaryData = [
        {
            name: 'Extra Curricular Activities',
            Yes: datasetStats.extra_curricular_dist.Yes,
            No: datasetStats.extra_curricular_dist.No,
            userChoice: sampleUserInput.extracurricularActivities
        },
        {
            name: 'Internet Access',
            Yes: datasetStats.internet_access_dist.Yes,
            No: datasetStats.internet_access_dist.No,
            userChoice: sampleUserInput.internetAccess
        },
        {
            name: 'Learning Disabilities',
            Yes: datasetStats.learning_disabilities_dist.Yes,
            No: datasetStats.learning_disabilities_dist.No,
            userChoice: sampleUserInput.learningDisabilities
        },
        {
            name: 'Gender',
            Male: datasetStats.gender_dist.Male,
            Female: datasetStats.gender_dist.Female,
            userChoice: sampleUserInput.gender
        }
    ];

    const multiData = [
       {
            name: 'Distance from Home',
            Near: datasetStats.distance_from_home_dist.Near,
            Moderate: datasetStats.distance_from_home_dist.Moderate,
            Far: datasetStats.distance_from_home_dist.Far,
            userChoice: sampleUserInput.distanceFromHome
        },
        {
            name: 'Parental Involvement',
            Low: datasetStats.parental_involvement_dist.Low,
            Medium: datasetStats.parental_involvement_dist.Medium,
            High: datasetStats.parental_involvement_dist.High,
            userChoice: sampleUserInput.parentalInvolvement
        },
        {
            name: 'Access to Resources',
            Low: datasetStats.access_to_resources_dist.Low,
            Medium: datasetStats.access_to_resources_dist.Medium,
            High: datasetStats.access_to_resources_dist.High,
            userChoice: sampleUserInput.accessToResources
        },
        {
            name: 'Motivation Level',
            Low: datasetStats.motivation_level_dist.Low,
            Medium: datasetStats.motivation_level_dist.Medium,
            High: datasetStats.motivation_level_dist.High,
            userChoice: sampleUserInput.motivationLevel
        },
        {
            name: 'Family Income',
            Low: datasetStats.family_income_dist.Low,
            Medium: datasetStats.family_income_dist.Medium,
            High: datasetStats.family_income_dist.High,
            userChoice: sampleUserInput.familyIncome
        },
        {
            name: 'Teacher Quality',
            Low: datasetStats.teacher_quality_dist.Low,
            Medium: datasetStats.teacher_quality_dist.Medium,
            High: datasetStats.teacher_quality_dist.High,
            userChoice: sampleUserInput.teacherQuality
        },
        {
            name: 'Peer Influence',
            Negative: datasetStats.peer_influence_dist.Negative,
            Neutral: datasetStats.peer_influence_dist.Neutral,
            Positive: datasetStats.peer_influence_dist.Positive,
            userChoice: sampleUserInput.peerInfluence
        },
        {
            name: 'Parent Edu Level',
            'High School': datasetStats.parental_edu_level_dist['High School'],
            College: datasetStats.parental_edu_level_dist.College,
            Postgraduate: datasetStats.parental_edu_level_dist.Postgraduate,
            userChoice: sampleUserInput.parentalEducationLevel
        }
    ];

    

    // Get categories for binary features
    const binaryCategories = [...new Set(
        binaryData.flatMap(item => 
            Object.keys(item).filter(key => !['name', 'userChoice'].includes(key))
        )
    )];

    // Get categories for multi-category features
    const multiCategories = [...new Set(
        multiData.flatMap(item => 
            Object.keys(item).filter(key => !['name', 'userChoice'].includes(key))
        )
    )];

    return (
        <div className="p-4">
            {/* Binary Features Chart */}
            <h3 className="text-lg font-bold mb-4">Binary Features Distribution</h3>
            <div style={{ width: '80vw', height: '40vh' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                        data={binaryData}
                        barGap={1}
                    >
                        <XAxis 
                            dataKey="name"
                            tickMargin={5}  // Add some margin below the labels
                        />
                        <YAxis label={{ value: 'Percentage', angle: -90}} />
                        <Tooltip formatter={(value, name) => [`${Number(value).toFixed(1)}%`, name]} />
                        <Legend />
                        
                        {/* Real data bars without names (won't show in legend) */}
                        {binaryCategories.map((category) => (
                            <Bar 
                                dataKey={category}
                                legendType="none"
                            >
                                {binaryData.map((entry) => (
                                    <Cell 
                                        fill={category === entry.userChoice ? '#ff6b6b' : '#82ca9d'}
                                    />
                                ))}
                            </Bar>
                        ))}
                        
                        {/* Legend-only bars (no data, just for the legend) */}
                        <Bar name="Your Input" dataKey="" fill="#ff6b6b" legendType="square" />
                        <Bar name="Dataset Distribution" dataKey="" fill="#82ca9d" legendType="square" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <hr />

            {/* Multi-category Features Chart */}
            <h3 className="text-lg font-bold mb-4 mt-8">Multi-category Features Distribution</h3>
            <div style={{ width: '80vw', height: '40vh' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                        data={multiData}
                        barSize={30}
                        barGap={1}
                    >
                        <XAxis 
                            dataKey="name" 
                            angle={-45}
                            textAnchor="end"
                            height={100}
                            interval={0}
                            tickMargin={5}
                        />
                        <YAxis label={{ value: 'Percentage', angle: -90}} />
                        <Tooltip formatter={(value, name) => [`${Number(value).toFixed(1)}%`, name]} />
                        <Legend />
                        
                        {/* Real data bars without names (won't show in legend) */}
                        {multiCategories.map((category) => (
                            <Bar 
                                dataKey={category}
                                legendType="none"
                            >
                                {multiData.map((entry) => (
                                    <Cell 
                                        fill={category === entry.userChoice ? '#ff6b6b' : '#82ca9d'}
                                    />
                                ))}
                            </Bar>
                        ))}
                        
                        {/* Legend-only bars (no data, just for the legend) */}
                        <Bar name="Your Input" dataKey="" fill="#ff6b6b" legendType="square" />
                        <Bar name="Dataset Distribution" dataKey="" fill="#82ca9d" legendType="square" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default CategoricalCharts;