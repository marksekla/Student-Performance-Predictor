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

// Mapping objects for renaming distribution keys
const genderMap = {
  '0': 'Male',
  '1': 'Female'
};
const ethnicityMap = {
  '0': 'Caucasian',
  '1': 'African American',
  '2': 'Asian',
  '3': 'Other'
};
const parentalEducationMap = {
  '0': 'None',
  '1': 'High School',
  '2': 'Some College',
  '3': "Bachelor's",
  '4': 'Higher'
};
const parentalSupportMap = {
  '0': 'None',
  '1': 'Low',
  '2': 'Moderate',
  '3': 'High',
  '4': 'Very High'
};

// Helper function to rename keys in a distribution object
function renameDistributionKeys(dist, map) {
  const newDist = {};
  Object.entries(dist).forEach(([key, value]) => {
    // Use the mapping if available; note: key may be a number or string
    const mappedKey = map[String(key)] || key;
    newDist[mappedKey] = value;
  });
  return newDist;
}

const RandomForestCharts = ({ datasetStats, sampleUserInput, predictionResult }) => {
  console.log('userInput in RandomForestCharts:', sampleUserInput);

  // Map prediction codes to grade labels
  const predictionMapping = {
    0: 'A',
    1: 'B',
    2: 'C',
    3: 'D',
    4: 'D'
  };

  // Define categorical features. For those features that need remapping, apply renameDistributionKeys.
  const categoricalFeatures = [
    {
      name: 'Tutoring',
      distribution: datasetStats.tutoring_dist, // Assume keys like "Yes", "No" are already good.
      userChoice: sampleUserInput.tutoring ? 'Yes' : 'No'
    },
    {
      name: 'Parental Support',
      // Remap numeric keys to labels using parentalSupportMap
      distribution: renameDistributionKeys(datasetStats.parentalsupport_dist, parentalSupportMap),
      userChoice: sampleUserInput.parentalSupport // Should be a string like "High"
    },
    {
      name: 'Extracurricular',
      distribution: datasetStats.extracurricular_dist,
      userChoice: sampleUserInput.extracurricular ? 'Yes' : 'No'
    },
    {
      name: 'Sports',
      distribution: datasetStats.sports_dist,
      userChoice: sampleUserInput.sports ? 'Yes' : 'No'
    },
    {
      name: 'Music',
      distribution: datasetStats.music_dist,
      userChoice: sampleUserInput.music ? 'Yes' : 'No'
    },
    {
      name: 'Volunteering',
      distribution: datasetStats.volunteering_dist,
      userChoice: sampleUserInput.volunteering ? 'Yes' : 'No'
    },
    {
      name: 'Parental Education',
      distribution: renameDistributionKeys(datasetStats.parentaleducation_dist, parentalEducationMap),
      userChoice: sampleUserInput.parentalEducation // e.g., "Some College"
    },
    {
      name: 'Ethnicity',
      distribution: renameDistributionKeys(datasetStats.ethnicity_dist, ethnicityMap),
      userChoice: sampleUserInput.ethnicity // e.g., "Caucasian"
    },
    {
      name: 'Gender',
      distribution: renameDistributionKeys(datasetStats.gender_dist, genderMap),
      userChoice: sampleUserInput.gender // e.g., "Male"
    }
  ];

  // Convert categoricalFeatures into a data array for the bar chart.
  const categoricalData = categoricalFeatures.map(feature => {
    const dataEntry = { name: feature.name, userChoice: feature.userChoice };
    Object.keys(feature.distribution).forEach(cat => {
      dataEntry[cat] = feature.distribution[cat];
    });
    return dataEntry;
  });

  console.log('categoricalData:', categoricalData);

  // For numeric features, prepare a data array comparing the user’s input with the dataset average.
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
  console.log('numericFeatures:', numericFeatures);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">
        Predicted Grade: {predictionMapping[predictionResult]}
      </h2>

      {/* Categorical Features Chart */}
      <div className="mb-8">
        <h3 className="text-lg font-bold mb-4">Categorical Features Distribution</h3>
        <div style={{ width: '80vw', height: '40vh' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoricalData} barGap={1}>
              <XAxis dataKey="name" tickMargin={5} />
              <YAxis label={{ value: 'Percentage', angle: -90 }} />
              <Tooltip formatter={(value, name) => [`${value}`, name]} />
              <Legend />
              {/* Dynamically generate bars for each category (excluding 'name' and 'userChoice') */}
              {categoricalData.length > 0 &&
                Object.keys(categoricalData[0])
                  .filter(key => key !== 'name' && key !== 'userChoice')
                  .map((category, index) => (
                    <Bar key={index} dataKey={category} legendType="none">
                      {categoricalData.map((entry, idx) => (
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
