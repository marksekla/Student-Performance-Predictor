import React, { useState, useEffect } from "react";
import { Box, Typography, LinearProgress, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SponsorshipCard from "../components/SponsorshipCard";

export default function WebQuestionnaire() {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [selectedOption, setSelectedOption] = useState<string | number | null>(null);
  const [textInput, setTextInput] = useState("");
  const [rangeValue, setRangeValue] = useState<number>(5);

  useEffect(() => {
    document.body.style.margin = "0";
    // Remove the overflow: hidden that was preventing scrolling
    document.body.style.overflow = "auto";

    // Reset selections when changing questions
    setSelectedOption(null);
    setTextInput("");
    setRangeValue(5);

    // Load previous answer if exists
    const savedAnswer = answers[questions[currentQuestionIndex].id];
    if (savedAnswer !== undefined) {
      if (questions[currentQuestionIndex].type === "multiple") {
        setSelectedOption(savedAnswer);
      } else if (questions[currentQuestionIndex].type === "text") {
        setTextInput(savedAnswer);
      } else if (questions[currentQuestionIndex].type === "range") {
        setRangeValue(savedAnswer);
      }
    }
  }, [currentQuestionIndex]);

  // List of questions for the questionnaire
  const questions: Question[] = [
    {
        id: 1,
        text: 'How many hours do you study per week?',
        type: 'number',
        inputProps: { step: '1', min: '0', max: '80' },
        key: 'hoursStudied'
    },
    {
        id: 2,
        text: 'What were your previous scores (out of 100)?',
        type: 'number',
        inputProps: { step: '1', min: '0', max: '100' },
        key: 'previousScores'
    },
    {
        id: 3,
        text: 'How many hours of physical activity do you do per week?',
        type: 'number',
        inputProps: { step: '1', min: '0', max: '40' },
        key: 'physicalActivity'
    },
    {
        id: 4,
        text: 'What is your typical attendance percentage?',
        type: 'number',
        inputProps: { step: '1', min: '0', max: '100' },
        key: 'attendance'
    },
    {
        id: 5,
        text: 'How many tutoring sessions have you attended last month?',
        type: 'number',
        inputProps: { step: '1', min: '0', max: '30' },
        key: 'tutoringSessions'
    },
    {
        id: 6,
        text: 'Do you participate in extracurricular activities?',
        type: 'selection',
        options: [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' }
        ],
        key: 'extracurricularActivities'
    },
    {
        id: 7,
        text: 'Do you have internet access at home?',
        type: 'selection',
        options: [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' }
        ],
        key: 'internetAccess'
    },
    {
        id: 8,
        text: 'Do you have any learning disabilities?',
        type: 'selection',
        options: [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' }
        ],
        key: 'learningDisabilities'
    },
    {
        id: 9,
        text: 'What is your gender?',
        type: 'selection',
        options: [
            { label: 'Male', value: 'Male' },
            { label: 'Female', value: 'Female' }
        ],
        key: 'gender'
    },
    {
        id: 10,
        text: 'How far do you live from school?',
        type: 'selection',
        options: [
            { label: 'Near', value: 'Near' },
            { label: 'Moderate', value: 'Moderate' },
            { label: 'Far', value: 'Far' }
        ],
        key: 'distanceFromHome'
    },
    {
        id: 11,
        text: 'How involved are your parents in your academics?',
        type: 'selection',
        options: [
            { label: 'Low', value: 'Low' },
            { label: 'Medium', value: 'Medium' },
            { label: 'High', value: 'High' }
        ],
        key: 'parentalInvolvement'
    },
    {
        id: 12,
        text: 'What is your access to learning resources?',
        type: 'selection',
        options: [
            { label: 'Low', value: 'Low' },
            { label: 'Medium', value: 'Medium' },
            { label: 'High', value: 'High' }
        ],
        key: 'accessToResources'
    },
    {
        id: 13,
        text: 'What is your motivation level?',
        type: 'selection',
        options: [
            { label: 'Low', value: 'Low' },
            { label: 'Medium', value: 'Medium' },
            { label: 'High', value: 'High' }
        ],
        key: 'motivationLevel'
    },
    {
        id: 14,
        text: "How is your family's income?",
        type: 'selection',
        options: [
            { label: 'Low', value: 'Low' },
            { label: 'Medium', value: 'Medium' },
            { label: 'High', value: 'High' }
        ],
        key: 'familyIncome'
    },
    {
        id: 15,
        text: "What is your teacher's quality?",
        type: 'selection',
        options: [
            { label: 'Low', value: 'Low' },
            { label: 'Medium', value: 'Medium' },
            { label: 'High', value: 'High' }
        ],
        key: 'teacherQuality'
    },
    {
        id: 16,
        text: "How much do your peers influence you on your academic performance?",
        type: 'selection',
        options: [
            { label: 'Positive', value: 'Positive' },
            { label: 'Neutral', value: 'Neutral' },
            { label: 'Negative', value: 'Negative' }
        ],
        key: 'peerInfluence'
    },
    {
        id: 17,
        text: "What was the highest education level any of your parents achieved?",
        type: 'selection',
        options: [
            { label: 'High School', value: 'High School' },
            { label: 'College', value: 'College' },
            { label: 'Postgraduate', value: 'Postgraduate' }
        ],
        key: 'parentalEducationLevel'
    }
  ];

  // Define the question type
  interface Question {
    id: number;
    text: string;
    type: "multiple" | "text" | "range";
    options?: string[];
    min?: number;
    max?: number;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleNext = () => {
    // Save the current answer
    if (currentQuestion.type === "multiple" && selectedOption !== null) {
      setAnswers({ ...answers, [currentQuestion.id]: selectedOption });
    } else if (currentQuestion.type === "text" && textInput) {
      setAnswers({ ...answers, [currentQuestion.id]: textInput });
    } else if (currentQuestion.type === "range") {
      setAnswers({ ...answers, [currentQuestion.id]: rangeValue });
    }

    // Check if it's the last question
    if (currentQuestionIndex === questions.length - 1) {
      // Handle questionnaire completion
      console.log("Questionnaire completed", answers);
      // You can submit the answers to your backend here
      // For now, we'll just navigate back to the landing page
      alert("Thank you for completing the questionnaire!");
      navigate("/");
    } else {
      // Move to the next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const isNextDisabled = () => {
    if (currentQuestion.type === "multiple" && selectedOption === null) return true;
    if (currentQuestion.type === "text" && !textInput.trim()) return true;
    return false;
  };

  // Light blue color for buttons and progress bar
  const lightBlue = "#64B5F6";

  return (
    <Box
      sx={{
        minHeight: "100vh", // Changed from height to minHeight to allow scrolling
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        background: "#14213D", // Changed to solid color as requested
        position: "relative",
        paddingTop: "30px", // Add padding to account for the navigation bar
        paddingBottom: "40px", // Add bottom padding for better spacing
        overflow: "visible", // Allow content to overflow for scrolling
      }}
    >

      {/* Progress Bar */}
      <Box sx={{ width: "70%", marginBottom: "20px" }}>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 10,
            borderRadius: 5,
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            '& .MuiLinearProgress-bar': {
              backgroundColor: lightBlue, // Changed to light blue
            }
          }}
        />
        <Typography variant="body2" sx={{ color: "white", textAlign: "right", mt: 1 }}>
          Question {currentQuestionIndex + 1} of {questions.length}
        </Typography>
      </Box>

      {/* Questionnaire Box */}
      <Box
        sx={{
          width: "70%",
          maxWidth: "800px",
          minHeight: "400px",
          background: "rgba(255, 255, 255, 0.1)",
          borderRadius: "15px",
          backdropFilter: "blur(10px)",
          padding: "40px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
          marginBottom: "40px", // Add margin to create space at bottom
        }}
      >
        {/* Question */}
        <Typography sx={{ color: "white", fontSize: "1.8rem", fontWeight: "500", mb: 4 }}>
          {currentQuestion.text}
        </Typography>

        {/* Answer options based on question type */}
        <Box sx={{ mb: 4 }}>
          {currentQuestion.type === "multiple" && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {currentQuestion.options?.map((option) => (
                <Button
                  key={option}
                  variant={selectedOption === option ? "contained" : "outlined"}
                  onClick={() => setSelectedOption(option)}
                  sx={{
                    color: "white",
                    borderColor: "rgba(255, 255, 255, 0.5)",
                    backgroundColor: selectedOption === option ? lightBlue : "transparent", // Changed to light blue for selected
                    justifyContent: "flex-start",
                    padding: "12px 20px",
                    textTransform: "none",
                    fontSize: "1rem",
                    '&:hover': {
                      backgroundColor: selectedOption === option ? lightBlue : "rgba(255, 255, 255, 0.1)",
                      borderColor: "white"
                    }
                  }}
                >
                  {option}
                </Button>
              ))}
            </Box>
          )}

          {currentQuestion.type === "text" && (
            <Box
              component="textarea"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              sx={{
                width: "100%",
                minHeight: "120px",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                color: "white",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                borderRadius: "8px",
                padding: "15px",
                fontSize: "1rem",
                fontFamily: "inherit",
                resize: "vertical",
                '&:focus': {
                  outline: "none",
                  borderColor: lightBlue, // Changed to light blue
                }
              }}
              placeholder="Type your answer here..."
            />
          )}

          {currentQuestion.type === "range" && (
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  color: "white"
                }}
              >
                <Typography>{currentQuestion.min}</Typography>
                <Typography>{currentQuestion.max}</Typography>
              </Box>

              <Box sx={{ width: "100%", display: "flex", alignItems: "center", gap: 2 }}>
                <input
                  type="range"
                  min={currentQuestion.min}
                  max={currentQuestion.max}
                  value={rangeValue}
                  onChange={(e) => setRangeValue(parseInt(e.target.value))}
                  style={{
                    width: "100%",
                    height: "8px",
                    appearance: "none",
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    borderRadius: "4px",
                    outline: "none",
                  }}
                />
              </Box>

              <Typography sx={{ color: "white", fontSize: "1.5rem", fontWeight: "bold" }}>
                {rangeValue}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Navigation Buttons */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            sx={{
              color: "white",
              borderColor: "rgba(255, 255, 255, 0.5)",
              textTransform: "none",
              fontSize: "1rem",
              opacity: currentQuestionIndex === 0 ? 0.5 : 1,
              '&:hover': {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderColor: "white"
              }
            }}
          >
            Previous
          </Button>

          <Button
            onClick={handleNext}
            disabled={isNextDisabled()}
            sx={{
              backgroundColor: lightBlue, // Changed to light blue
              color: "#14213D", // Changed to dark color for contrast
              textTransform: "none",
              fontSize: "1rem",
              padding: "8px 24px",
              borderRadius: "20px",
              fontWeight: "bold", // Added for better contrast
              '&:hover': {
                backgroundColor: "#90CAF9", // Lighter blue on hover
              },
              '&:disabled': {
                backgroundColor: "rgba(100, 181, 246, 0.5)", // Lighter version of light blue
                color: "rgba(20, 33, 61, 0.5)" // Darker text with reduced opacity
              }
            }}
          >
            {currentQuestionIndex === questions.length - 1 ? "Submit" : "Next"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
