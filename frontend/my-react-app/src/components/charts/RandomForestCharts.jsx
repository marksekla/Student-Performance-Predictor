import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

// Custom Tooltip Component for Categorical Features
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  return (
    <div style={{ backgroundColor: '#fff', border: '1px solid #ccc', padding: '8px' }}>
      <p style={{ margin: 0, fontWeight: 'bold' }}>{label}</p>
      {payload.map((entry, idx) => {
        const isUserInput = entry.payload.userChoice === entry.dataKey;
        return (
          <p
            key={idx}
            style={{
              color: isUserInput ? 'red' : '#333',
              margin: 0
            }}
          >
            {entry.name}: {entry.value}%
          </p>
        );
      })}
    </div>
  );
};

const RandomForestCharts = ({ datasetStats, sampleUserInput, predictionResult }) => {
  console.log('datasetStats in RandomForestCharts:', datasetStats);

  // Map prediction codes to grade labels
  const predictionMapping = { 0: 'A', 1: 'B', 2: 'C', 3: 'D', 4: 'F' };

  // Define categorical features using dataset statistics
  const categoricalFeatures = [
    {
      name: 'Tutoring',
      userChoice: sampleUserInput.tutoring ? 'Yes' : 'No',
      distribution: datasetStats.tutoring_dist
    },
    {
      name: 'Parental Support',
      userChoice: sampleUserInput.parentalSupport,
      distribution: datasetStats.parentalsupport_dist
    },
    {
      name: 'Extracurricular',
      userChoice: sampleUserInput.extracurricular ? 'Yes' : 'No',
      distribution: datasetStats.extracurricular_dist
    },
    {
      name: 'Sports',
      userChoice: sampleUserInput.sports ? 'Yes' : 'No',
      distribution: datasetStats.sports_dist
    },
    {
      name: 'Music',
      userChoice: sampleUserInput.music ? 'Yes' : 'No',
      distribution: datasetStats.music_dist
    },
    {
      name: 'Volunteering',
      userChoice: sampleUserInput.volunteering ? 'Yes' : 'No',
      distribution: datasetStats.volunteering_dist
    },
    {
      name: 'Parental Education',
      userChoice: sampleUserInput.parentalEducation,
      distribution: datasetStats.parentaleducation_dist
    },
    {
      name: 'Ethnicity',
      userChoice: sampleUserInput.ethnicity,
      distribution: datasetStats.ethnicity_dist
    },
    {
      name: 'Gender',
      userChoice: sampleUserInput.gender,
      distribution: datasetStats.gender_dist
    }
  ];

  // Convert each categorical feature into a single data object for its mini-chart
  const categoricalData = categoricalFeatures.map(feature => {
    const dataEntry = { name: feature.name, userChoice: feature.userChoice };
    Object.keys(feature.distribution).forEach(cat => {
      dataEntry[cat] = feature.distribution[cat];
    });
    return dataEntry;
  });

  // Prepare numeric features for their charts
  const numericFeatures = [
    {
      name: 'Age',
      user: sampleUserInput.age,
      average: datasetStats.age_avg
    },
    {
      name: 'Study Time Weekly',
      user: sampleUserInput.studyTimeWeekly,
      average: datasetStats.studytimeweekly_avg
    },
    {
      name: 'Absences',
      user: sampleUserInput.absences,
      average: datasetStats.absences_avg
    },
    {
      name: 'GPA',
      user: sampleUserInput.gpa,
      average: datasetStats.gpa_avg
    }
  ];

  // Use feature importance from datasetStats (merged from prediction, if available)
  const featureImportance = datasetStats.featureImportance
    ? [...datasetStats.featureImportance].sort((a, b) => b.importance - a.importance)
    : [];

console.log('Feature Importance in charts:', featureImportance);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">
        Predicted Grade: {predictionMapping[predictionResult]}
      </h2>

      {/* Categorical Features Distribution Charts */}
      <div className="mb-8">
        <h3 className="text-lg font-bold mb-4">Categorical Features Distribution</h3>
        {categoricalData.map((item, i) => (
          <div key={i} style={{ width: '80vw', height: '40vh', marginBottom: '2rem' }}>
            <h4>{item.name}</h4>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[item]} barGap={1}>
                <XAxis dataKey="name" tickMargin={5} />
                <YAxis label={{ value: 'Percentage', angle: -90 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                {Object.keys(item)
                  .filter(key => key !== 'name' && key !== 'userChoice')
                  .map((category, index) => (
                    <Bar key={index} dataKey={category} legendType="none">
                      {[item].map((entry, idx) => (
                        <Cell
                          key={idx}
                          fill={entry.userChoice === category ? '#ff6b6b' : '#82ca9d'}
                        />
                      ))}
                    </Bar>
                  ))}
                <Bar name="Your Input" dataKey="" fill="#ff6b6b" legendType="square" />
                <Bar name="Dataset Distribution" dataKey="" fill="#82ca9d" legendType="square" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>

      {/* Numeric Features Comparison Chart */}
      <div className="mb-8">
        <h3 className="text-lg font-bold mb-4">Numeric Features Comparison</h3>
        <div style={{ width: '80vw', height: '40vh' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={numericFeatures} barGap={1}>
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

      {/* Radar Chart for Numeric Features */}
      <div className="mb-8">
        <h3 className="text-lg font-bold mb-4">Radar Chart Comparison</h3>
        <div style={{ width: '80vw', height: '40vh' }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={numericFeatures}>
              <PolarGrid />
              <PolarAngleAxis dataKey="name" />
              <PolarRadiusAxis />
              <Radar
                name="Your Input"
                dataKey="user"
                stroke="#82ca9d"
                fill="#82ca9d"
                fillOpacity={0.6}
              />
              <Radar
                name="Dataset Average"
                dataKey="average"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.6}
              />
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Feature Importance Chart */}
      {featureImportance.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-bold mb-4">Feature Importance</h3>
          <div style={{ width: '80vw', height: '40vh' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={featureImportance} layout="vertical">
                <XAxis type="number" label={{ value: 'Importance', angle: -90 }} />
                <YAxis dataKey="name" type="category" />
                <Tooltip formatter={(value) => (Number(value) * 100).toFixed(2) + '%'} />
                <Legend />
                <Bar dataKey="importance" fill="#8884d8" name="Feature Importance" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default RandomForestCharts;
