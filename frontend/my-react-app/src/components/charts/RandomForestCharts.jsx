import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  Legend
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
        // entry.dataKey is the current category and entry.payload.userChoice is the user's input for that feature.
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

  // Define categorical features
  const categoricalFeatures = [
    {
      name: 'Tutoring',
      userChoice: sampleUserInput.tutoring ? 'Yes' : 'No',
      distribution: datasetStats.tutoring_dist
    },
    {
      name: 'Parental Support',
      userChoice: sampleUserInput.parentalSupport, // e.g., "High"
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
      userChoice: sampleUserInput.parentalEducation, // e.g., "Some College"
      distribution: datasetStats.parentaleducation_dist
    },
    {
      name: 'Ethnicity',
      userChoice: sampleUserInput.ethnicity, // e.g., "Caucasian"
      distribution: datasetStats.ethnicity_dist
    },
    {
      name: 'Gender',
      userChoice: sampleUserInput.gender, // e.g., "Male"
      distribution: datasetStats.gender_dist
    }
  ];

  // Convert each feature into a single data object for its mini-chart
  const categoricalData = categoricalFeatures.map(feature => {
    const dataEntry = { name: feature.name, userChoice: feature.userChoice };
    Object.keys(feature.distribution).forEach(cat => {
      dataEntry[cat] = feature.distribution[cat];
    });
    return dataEntry;
  });

  // Prepare numeric features for their separate chart
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

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">
        Predicted Grade: {predictionMapping[predictionResult]}
      </h2>

      {/* One mini-chart per categorical feature */}
      <div className="mb-8">
        <h3 className="text-lg font-bold mb-4">Categorical Features Distribution</h3>
        {categoricalData.map((item, i) => (
          <div key={i} style={{ width: '80vw', height: '40vh', marginBottom: '2rem' }}>
            <h4>{item.name}</h4>
            <ResponsiveContainer width="100%" height="100%">
              {/* We pass [item] as the data array so we have only one row */}
              <BarChart data={[item]} barGap={1}>
                <XAxis dataKey="name" tickMargin={5} />
                <YAxis label={{ value: 'Percentage', angle: -90 }} />
                {/* Use our custom tooltip here */}
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                {/* Render one bar per category key in this feature's distribution */}
                {Object.keys(item)
                  .filter(key => key !== 'name' && key !== 'userChoice')
                  .map((category, index) => (
                    <Bar key={index} dataKey={category} legendType="none">
                      {/* Since our data is a single object wrapped in an array, map over that */}
                      {[item].map((entry, idx) => (
                        <Cell
                          key={idx}
                          fill={entry.userChoice === category ? '#ff6b6b' : '#82ca9d'}
                        />
                      ))}
                    </Bar>
                  ))}
                {/* Legend-only bars (for clarity) */}
                <Bar name="Your Input" dataKey="" fill="#ff6b6b" legendType="square" />
                <Bar name="Dataset Distribution" dataKey="" fill="#82ca9d" legendType="square" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>

      {/* Numeric Features Comparison Chart */}
      <div>
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
    </div>
  );
};

export default RandomForestCharts;
