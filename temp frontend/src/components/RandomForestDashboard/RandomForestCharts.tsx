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
  TooltipProps
} from "recharts";
import { Box, Button, Typography } from "@mui/material";

// Define your color palette
const colorPalette = [
  "#14213d", // Dark Blue
  "#82CAA0", // Green for Distribution
  "#82CAA0", // Medium Blue
  "#8e82d4", // Hover Color (Lighter Blue)
  "#ff6c6d", // Near Black (used for user choice in some places)
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

/**
 * Custom tooltip for categorical features:
 * - Red text for user choice
 * - Green text for other categories
 * - Percentage sign appended
 */
const CustomTooltipCategorical = ({ active, payload, label }: TooltipProps<any, any>) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;
  // e.g. { name: "Ethnicity", userChoice: "African American", "African American": 20.5, "Asian": 19.7, ... }

  const distributionKeys = Object.keys(data).filter(
    (k) => k !== 'name' && k !== 'userChoice'
  );

  return (
    <div style={{ backgroundColor: 'white', border: '1px solid #ccc', padding: '8px' }}>
      <div style={{ fontWeight: 'bold', marginBottom: '4px', color: '#333' }}>
        {label}
      </div>
      {distributionKeys.map((key) => {
        const val = data[key];
        const color = key === data.userChoice ? 'red' : 'green';
        return (
          <div key={key} style={{ color }}>
            {`${key} : ${val.toFixed(1)}%`}
          </div>
        );
      })}
      <div style={{ color: 'red', marginTop: '4px' }}>
        {`Your Input : ${data.userChoice}`}
      </div>
    </div>
  );
};

// Single categorical bar chart with custom tooltip
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
        <XAxis
          dataKey="name"
          tickMargin={5}
          axisLine={{ stroke: '#ccc' }}
          tickLine={{ stroke: '#ccc' }}
          tick={{ fill: '#ccc' }}
        />
        <YAxis
          axisLine={{ stroke: '#ccc' }}
          tickLine={{ stroke: '#ccc' }}
          tick={{ fill: '#ccc' }}
        />
        {/* Custom tooltip for categorical features */}
        <Tooltip content={<CustomTooltipCategorical />} />
        <Legend />
        {Object.keys(item)
          .filter((key) => key !== 'name' && key !== 'userChoice')
          .map((category, index) => (
            <Bar key={index} dataKey={category} legendType="none">
              {[item].map((entry, idx) => (
                <Cell
                  key={idx}
                  fill={
                    entry.userChoice === category
                      ? colorPalette[4] // Red if user choice
                      : colorPalette[2] // Green otherwise
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

  // Map user inputs to text
  const mappedGender = GENDER_MAP[userInput.Gender] || 'Unknown';
  const mappedEthnicity = ETHNICITY_MAP[userInput.Ethnicity] || 'Unknown';
  const mappedParentalEducation = PARENT_EDUCATION_MAP[userInput.ParentalEducation] || 'Unknown';
  const mappedParentalSupport = PARENT_SUPPORT_MAP[userInput.ParentalSupport] || 'Unknown';
  const predictionMapping = { 0: 'A', 1: 'B', 2: 'C', 3: 'D', 4: 'F' };

  // Define categorical features
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
  }
  ];

  // Convert each categorical feature into a single data object
  const categoricalData = categoricalFeatures.map(feature => {
    const dataEntry = { name: feature.name, userChoice: feature.userChoice };
    Object.keys(feature.distribution).forEach(cat => {
      dataEntry[cat] = feature.distribution[cat];
    });
    return dataEntry;
  });

  // Numeric features
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

  // Feature importance
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
      {/* Predicted Grade */}
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
        Predicted Grade: {predictionMapping[predictionResult]}
      </Typography>

      {/* Brief explanation under Predicted Grade */}
      <Typography
        variant="body1"
        sx={{ mb: 2, maxWidth: 700, textAlign: 'center', lineHeight: 1.6 }}
      >
        This grade prediction is based on the features you provided and a trained machine learning model.
        A higher grade indicates stronger academic performance according to our model’s analysis.
      </Typography>

      {/* Updated Top Disclaimer with dark background and closer spacing */}
      <Typography
        variant="body2"
        sx={{
          mb: 2,
          maxWidth: 700,
          textAlign: 'center',
          fontStyle: 'italic',
          backgroundColor: '#2d2d2d', // Dark background for contrast
          color: '#f9f9f9',          // Light text
          p: 2,
          borderRadius: 1,
          lineHeight: 1.4           // Slightly reduced line height for closer text
        }}
      >
        Disclaimer: This is an estimated grade based on historical data. Actual performance may vary.
      </Typography>

      {/* Categorical Features Distribution */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Categorical Features Distribution
      </Typography>
      <Typography
        variant="body1"
        sx={{ mb: 4, maxWidth: 700, textAlign: 'center', lineHeight: 1.6 }}
      >
        This section displays how each of your selected categorical features (shown in red) compares to
        the overall dataset distribution (shown in green). Each chart represents one categorical feature,
        with the value you chose highlighted against the distribution of all possible values in our dataset.
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
                width: '400px',
                minWidth: '300px',
                textAlign: 'center',
                mb: 6,
                border: '1px solid #ccc',
                borderRadius: '8px',
                p: 2,
              }}
            >
              <Typography variant="h6" sx={{ mb: 2 }}>
                {item.name}
              </Typography>
              <CategoricalBarChart item={item} />
            </Box>
          ))
        }
      </Box>

      {/* Numeric Feature Comparison */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Numeric Feature Comparison
      </Typography>
      <Typography
        variant="body1"
        sx={{ mb: 4, maxWidth: 700, textAlign: 'center', lineHeight: 1.6 }}
      >
        This chart shows how your numeric inputs (in purple) compare with the average values in our dataset (in green).
        Each bar represents a numeric feature on the y-axis, while the x-axis shows the numerical scale for that feature.
      </Typography>

      {Array.isArray(numericFeatures) && (
        <Box
          sx={{
            maxWidth: "700px",
            width: "100%",
            margin: "0 auto",
            height: 300,
            mb: 2,
            textAlign: "center",
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={numericFeatures}
              layout="vertical"
              margin={{ top: 20, right: 20, left: 30, bottom: 20 }}
            >
              <XAxis
                type="number"
                axisLine={{ stroke: '#ccc' }}
                tickLine={{ stroke: '#ccc' }}
                tick={{ fill: '#ccc' }}
              />
              <YAxis
                type="category"
                dataKey="name"
                axisLine={{ stroke: '#ccc' }}
                tickLine={{ stroke: '#ccc' }}
                tick={{ fill: '#ccc' }}
              />
              <Tooltip
                formatter={(value: number, name: string) => {
                  if (name === 'Dataset Average' && typeof value === 'number') {
                    return [value.toFixed(2), name];
                  }
                  return [value, name];
                }}
              />
              <Legend />
              <Bar dataKey="user" fill={colorPalette[3]} name="Your Input" />
              <Bar dataKey="average" fill={colorPalette[2]} name="Dataset Average" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      )}

      {/* Key takeaway for numeric features (dark background) */}
      <Typography
        variant="body2"
        sx={{
          mt: 2,
          fontStyle: 'italic',
          textAlign: 'center',
          maxWidth: 700,
          backgroundColor: '#2d2d2d', // Darker background for contrast
          p: 2,
          borderRadius: 1,
          color: '#f9f9f9',          // Light text for readability
          lineHeight: 1.6
        }}
      >
        By comparing your values to the dataset average, you can identify areas where you might focus
        to potentially improve your predicted grade.
      </Typography>

      {/* Feature Importance */}
      <Typography variant="h6" sx={{ mb: 2, mt: 6 }}>
        Feature Importance
      </Typography>
      <Typography
        variant="body1"
        sx={{ mb: 4, maxWidth: 700, textAlign: 'center', lineHeight: 1.6 }}
      >
        This chart displays how much each feature influences the final grade prediction.
        A higher percentage indicates a stronger impact on the model’s outcome.
      </Typography>

      {Array.isArray(featureImportance) && (
        <Box
          sx={{
            maxWidth: "700px",
            width: "100%",
            margin: "0 auto",
            height: 300,
            mb: 2,
            textAlign: "center",
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={featureImportance}
              layout="vertical"
              margin={{ top: 20, right: 20, left: 90, bottom: 20 }}
            >
              <XAxis
                type="number"
                tickFormatter={(value: number) => `${(value * 100).toFixed(0)}%`}
                axisLine={{ stroke: '#ccc' }}
                tickLine={{ stroke: '#ccc' }}
                tick={{ fill: '#ccc' }}
              />
              <YAxis
                type="category"
                dataKey="name"
                interval={0}
                axisLine={{ stroke: '#ccc' }}
                tickLine={{ stroke: '#ccc' }}
                tick={{ fill: '#ccc' }}
              />
              <Tooltip formatter={(value: number) => `${(value * 100).toFixed(2)}%`} />
              <Legend />
              <Bar dataKey="importance" fill={colorPalette[3]} name="Importance" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      )}

      {/* Key takeaway for feature importance (dark background) */}
      <Typography
        variant="body2"
        sx={{
          mt: 2,
          fontStyle: 'italic',
          textAlign: 'center',
          maxWidth: 700,
          backgroundColor: '#2d2d2d', // Darker background for contrast
          p: 2,
          borderRadius: 1,
          color: '#f9f9f9',          // Light text for readability
          lineHeight: 1.6
        }}
      >
        Focusing on features with higher importance can often lead to more significant improvements
        in your overall performance.
      </Typography>

      {/* Clear CTA after charts, before button */}
      <Typography
        variant="body1"
        sx={{ mt: 4, maxWidth: 700, textAlign: 'center', lineHeight: 1.6, fontWeight: 'bold' }}
      >
        If you’d like to modify your inputs or try different scenarios, click below to go back and change your data.
      </Typography>

      <Button
        onClick={() => navigate('/')}
        sx={{
          backgroundColor: "#64B5F6",
          color: "#14213D",
          padding: "10px 20px",
          borderRadius: "20px",
          marginTop: "20px",
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
