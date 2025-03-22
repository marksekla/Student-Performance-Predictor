import React, { useState, useEffect } from "react";
import { Box, Typography, LinearProgress, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SponsorshipCard from "../components/SponsorshipCard";

export default function WebSponsorTiers() {
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
      text: "What is your current educational level?",
      type: "multiple",
      options: ["High School", "Undergraduate", "Graduate", "Doctoral", "Other"]
    },
    {
      id: 2,
      text: "How many hours per week do you spend studying?",
      type: "range",
      min: 0,
      max: 40
    },
    {
      id: 3,
      text: "What subject areas are you most interested in?",
      type: "multiple",
      options: ["Science", "Technology", "Engineering", "Mathematics", "Arts", "Humanities"]
    },
    {
      id: 4,
      text: "Do you prefer studying alone or in groups?",
      type: "multiple",
      options: ["Alone", "Small groups (2-3)", "Medium groups (4-6)", "Large groups (7+)", "It depends on the subject"]
    },
    {
      id: 5,
      text: "What time of day are you most productive for studying?",
      type: "multiple",
      options: ["Early morning", "Late morning", "Afternoon", "Evening", "Late night"]
    },
    {
      id: 6,
      text: "How do you learn best?",
      type: "multiple",
      options: ["Visual (images, diagrams)", "Auditory (lectures, discussions)", "Reading/Writing", "Kinesthetic (hands-on activities)", "Mixed methods"]
    },
    {
      id: 7,
      text: "What are your academic goals for this year?",
      type: "text"
    },
    {
      id: 8,
      text: "On a scale of 1-10, how would you rate your time management skills?",
      type: "range",
      min: 1,
      max: 10
    },
    {
      id: 9,
      text: "Do you currently use any digital tools to help with your studies?",
      type: "multiple",
      options: ["Yes, regularly", "Yes, occasionally", "No, but I'd like to", "No, I prefer traditional methods"]
    },
    {
      id: 10,
      text: "How often do you review previously learned material?",
      type: "multiple",
      options: ["Daily", "Weekly", "Monthly", "Before exams only", "Rarely"]
    },
    {
      id: 11,
      text: "What challenges do you face in your academic journey?",
      type: "text"
    },
    {
      id: 12,
      text: "How important is getting good grades to you?",
      type: "range",
      min: 1,
      max: 10
    },
    {
      id: 13,
      text: "Do you currently work while studying?",
      type: "multiple",
      options: ["Yes, full-time", "Yes, part-time", "Yes, occasionally", "No"]
    },
    {
      id: 14,
      text: "How comfortable are you asking for help when you don't understand something?",
      type: "range",
      min: 1,
      max: 10
    },
    {
      id: 15,
      text: "What motivates you to learn?",
      type: "text"
    },
    {
      id: 16,
      text: "How do you handle academic stress?",
      type: "multiple",
      options: ["Exercise", "Meditation/Mindfulness", "Talking with friends/family", "Taking breaks", "Other techniques"]
    },
    {
      id: 17,
      text: "On a scale of 1-10, how satisfied are you with your current academic performance?",
      type: "range",
      min: 1,
      max: 10
    },
    {
      id: 18,
      text: "Do you have a dedicated study space?",
      type: "multiple",
      options: ["Yes, quiet and distraction-free", "Yes, but with some distractions", "No, I study wherever I can", "I prefer studying in public spaces"]
    },
    {
      id: 19,
      text: "What study techniques have you found most effective?",
      type: "text"
    },
    {
      id: 20,
      text: "What specific areas would you like to improve in your academic performance?",
      type: "text"
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
