import React from "react";
import { useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Box, Button, Typography } from "@mui/material";

// Define your color palette
const colorPalette = [
  "#14213d", // Dark Blue
  "#223867", // Medium Dark Blue
  "#304f92", // Medium Blue
  "#3e66bc", // Hover Color (Lighter Blue)
  "#57279e", // Purple (for emphasis/user input)
  "#060a12", // Near Black
];

// Mapping objects (if needed)
const GENDER_MAP: Record<number, string> = {
  0: 'Male',
  1: 'Female',
};

const ETHNICITY_MAP: Record<number, string> = {
  0: 'Caucasian',
  1: 'African American',
  2: 'Asian',
  3: 'Other',
};

const PARENT_EDUCATION_MAP: Record<number, string> = {
  0: 'None',
  1: 'High school',
  2: 'Some College',
  3: 'Bachelor\'s',
  4: 'Higher',
};

const PARENT_SUPPORT_MAP: Record<number, string> = {
  0: 'None',
  1: 'Low',
  2: 'Moderate',
  3: 'High',
  4: 'Very High',
};

// Component for a single categorical bar chart with hover and tooltip
const CategoricalBarChart = ({ item }: { item: any }) => {
  const [hoveredCategory, setHoveredCategory] = React.useState<string | null>(null);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={[item]}
        barGap={1}
        barSize={50}
        margin={{ left: 40, right: 40, top: 20, bottom: 20 }}
      >
        <XAxis dataKey="name" tickMargin={5} />
        {/* Removed the YAxis label */}
        <YAxis />
        <Tooltip />
        <Legend />
        {Object.keys(item)
          .filter((key) => key !== 'name' && key !== 'userChoice')
          .map((category, index) => (
            <Bar key={index} dataKey={category} legendType="none">
              {[item].map((entry, idx) => (
                <Cell
                  key={idx}
                  fill={
                    hoveredCategory === category
                      ? colorPalette[3]
                      : entry.userChoice === category
                      ? colorPalette[4]
                      : colorPalette[2]
                  }
                  onMouseEnter={() => setHoveredCategory(category)}
                  onMouseLeave={() => setHoveredCategory(null)}
                />
              ))}
            </Bar>
          ))}
        {/* Legend samples */}
        <Bar name="Your Input" dataKey="userChoice" fill={colorPalette[4]} legendType="square" />
        <Bar name="Dataset Distribution" dataKey="distribution" fill={colorPalette[2]} legendType="square" />
      </BarChart>
    </ResponsiveContainer>
  );
};

const RandomForestCharts = ({ datasetStats, userInput, predictionResult }: any) => {
  const navigate = useNavigate();

  // Map user inputs to text using the mapping objects
  const mappedGender = GENDER_MAP[userInput.Gender] || 'Unknown';
  const mappedEthnicity = ETHNICITY_MAP[userInput.Ethnicity] || 'Unknown';
  const mappedParentalEducation = PARENT_EDUCATION_MAP[userInput.ParentalEducation] || 'Unknown';
  const mappedParentalSupport = PARENT_SUPPORT_MAP[userInput.ParentalSupport] || 'Unknown';
  const predictionMapping = { 0: 'A', 1: 'B', 2: 'C', 3: 'D', 4: 'F' };

  // Define categorical features using dataset statistics
  const categoricalFeatures = [
    {
      name: 'Tutoring',
      userChoice: userInput.tutoring ? 'Yes' : 'No',
      distribution: datasetStats.tutoring_dist
    },
    {
      name: 'Parental Support',
      userChoice: mappedParentalSupport,
      distribution: datasetStats.parentalsupport_dist
    },
    {
      name: 'Extracurricular',
      userChoice: userInput.extracurricular ? 'Yes' : 'No',
      distribution: datasetStats.extracurricular_dist
    },
    {
      name: 'Sports',
      userChoice: userInput.sports ? 'Yes' : 'No',
      distribution: datasetStats.sports_dist
    },
    {
      name: 'Music',
      userChoice: userInput.music ? 'Yes' : 'No',
      distribution: datasetStats.music_dist
    },
    {
      name: 'Volunteering',
      userChoice: userInput.volunteering ? 'Yes' : 'No',
      distribution: datasetStats.volunteering_dist
    },
    {
      name: 'Parental Education',
      userChoice: mappedParentalEducation,
      distribution: datasetStats.parentaleducation_dist
    },
    {
      name: 'Ethnicity',
      userChoice: mappedEthnicity,
      distribution: datasetStats.ethnicity_dist
    },
    {
      name: 'Gender',
      userChoice: mappedGender,
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
      user: userInput.Age,
      average: datasetStats.age_avg
    },
    {
      name: 'Study Time Weekly',
      user: userInput.StudyTimeWeekly,
      average: datasetStats.studytimeweekly_avg
    },
    {
      name: 'Absences',
      user: userInput.Absences,
      average: datasetStats.absences_avg
    },
    {
      name: 'GPA',
      user: userInput.GPA,
      average: datasetStats.gpa_avg
    }
  ];

  // Use feature importance from datasetStats (merged from prediction, if available)
  const featureImportance = datasetStats.featureImportance
    ? [...datasetStats.featureImportance].sort((a, b) => b.importance - a.importance)
    : [];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        mt: 4,
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
        Predicted Grade: {predictionMapping[predictionResult]}
      </Typography>

      <Typography variant="h6" sx={{ mb: 2 }}>
        Categorical Features Distribution
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 4,
        }}
      >
        {Array.isArray(categoricalData) &&
          categoricalData.map((item: any, idx: number) => (
            <Box
              key={idx}
              sx={{
                width: '400px',      // Each chart gets a fixed width
                minWidth: '300px',   // Minimum width if the screen is too narrow
                textAlign: 'center',
                mb: 6,
              }}
            >
              <Typography variant="h6" sx={{ mb: 2 }}>{item.name}</Typography>
              <CategoricalBarChart item={item} />
            </Box>
          ))
        }
      </Box>

      <Typography variant="h6" sx={{ mb: 2 }}>
        Numeric Feature Comparison
      </Typography>

      {Array.isArray(numericFeatures) && (
        <Box
          sx={{
            maxWidth: "700px",
            width: "100%",
            margin: "0 auto",
            height: 300,
            mb: 6,
            textAlign: "center",
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={numericFeatures}
              layout="vertical"
              margin={{ top: 20, right: 20, left: 30, bottom: 20 }}
            >
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" />
              <Tooltip />
              <Legend />
              <Bar dataKey="user" fill={colorPalette[4]} name="Your Input" />
              <Bar dataKey="average" fill={colorPalette[2]} name="Dataset Average" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      )}

      <Typography variant="h6" sx={{ mb: 2 }}>
        Feature Importance
      </Typography>

      {Array.isArray(featureImportance) && (
        <Box
          sx={{
            maxWidth: "700px",
            width: "100%",
            margin: "0 auto",
            height: 300,
            mb: 6,
            textAlign: "center",
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={featureImportance}
              layout="vertical"
              margin={{ top: 20, right: 20, left: 90, bottom: 20 }}
            >
              {/*
                Use a tickFormatter for X-axis to show 0–100%,
                and a Tooltip formatter for the hover text
              */}
              <XAxis
                type="number"
                tickFormatter={(value: number) => `${(value * 100).toFixed(0)}%`}
              />
              <YAxis type="category" dataKey="name" interval={0} />
              <Tooltip formatter={(value: number) => `${(value * 100).toFixed(2)}%`} />
              <Legend />
              <Bar dataKey="importance" fill={colorPalette[4]} name="Importance" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      )}

      <Button 
          onClick={() => navigate('/')}
          sx={{
              backgroundColor: "#64B5F6",
              color: "#14213D",
              padding: "10px 20px",
              borderRadius: "20px",
              marginTop: "40px",
              fontWeight: "bold",
              '&:hover': {
                  backgroundColor: "#90CAF9",
              }
          }}
      >
          Back to Home
      </Button>
    </Box>
  );
};

export default RandomForestCharts;
