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
  const [rangeValue, setRangeValue] = useState<number>(0);

  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.overflow = "auto";
    setSelectedOption(null);
    setTextInput("");
    setRangeValue(0);

    const savedAnswer = answers[questions[currentQuestionIndex].id];
    if (savedAnswer !== undefined) {
      if (questions[currentQuestionIndex].type === "multiple") {
        setSelectedOption(savedAnswer);
      } else if (questions[currentQuestionIndex].type === "text") {
        setTextInput(savedAnswer);
      } else if (questions[currentQuestionIndex].type === "range" || questions[currentQuestionIndex].type === "number") {
        setRangeValue(savedAnswer);
      }
    }
  }, [currentQuestionIndex]);

  const questions = [
    { id: 1, text: 'What is your age?', type: 'number', min: 15, max: 25, inputProps: { step: '1'} },
    { id: 2, text: 'What is your Gender?', type: 'selection', subtype: 'button-image', options: [ { label: 'Male', value: 0, image: 'male.png' }, { label: 'Female', value: 1, image: 'female.png' } ] },
    { id: 3, text: 'What is your Ethnicity?', type: 'selection', options: [ { label: 'Caucasian', value: 0 }, { label: 'African American', value: 1 }, { label: 'Asian', value: 2 }, { label: 'Other', value: 3 } ] },
    { id: 4, text: "What education did your parents complete?", type: 'selection', options: [ { label: 'None', value: 0 }, { label: 'High School', value: 1 }, { label: 'Some College', value: 2 }, { label: "Bachelor's", value: 3 }, { label: 'Higher', value: 4 } ] },
    { id: 5, text: 'How many hours do you study per week?', type: 'number', min: 0, max: 20, inputProps: { step: '1' } },
    { id: 6, text: 'How many absences did you have during your last semester?', type: 'number', min: 0, max: 30, inputProps: { step: '1' } },
    { id: 7, text: 'How supportive are parents with your education?', type: 'selection', options: [ { label: 'None', value: 0 }, { label: 'Low', value: 1 }, { label: 'Moderate', value: 2 }, { label: 'High', value: 3 }, { label: 'Very High', value: 4 } ] },
    { id: 8, text: 'Choose all that apply: Tutoring, Extracurricular, Sports, Music, Volunteering', type: 'multi', options: [ { label: 'Tutoring', value: 'tutoring' }, { label: 'Extracurricular', value: 'extracurricular' }, { label: 'Sports', value: 'sports' }, { label: 'Music', value: 'music' }, { label: 'Volunteering', value: 'volunteering' } ] },
    { id: 9, text: 'What is your GPA (Grade point average)?', type: 'number', min: 0.0, max: 4.0, inputProps: { step: '0.01' } }
  ];

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleNext = () => {
    if (currentQuestion.type === "selection" && selectedOption !== null) {
      setAnswers({ ...answers, [currentQuestion.id]: selectedOption });
    }  else if (currentQuestion.type === "range" || currentQuestion.type === "number") {
      const valueToSave = currentQuestion.inputProps?.step === "0.01"
        ? parseFloat(rangeValue.toFixed(2))
        : rangeValue;
      setAnswers({ ...answers, [currentQuestion.id]: valueToSave });
    } else if (currentQuestion.type === "multi") {
      setAnswers({ ...answers, [currentQuestion.id]: selectedOption });
    }

    if (currentQuestionIndex === questions.length - 1) {
      console.log("Questionnaire completed", answers);
      alert("Thank you for completing the questionnaire!");
      navigate("/");
    } else {
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

  const lightBlue = "#64B5F6";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        background: "#14213D",
        position: "relative",
        paddingTop: "30px",
        paddingBottom: "40px",
        overflow: "visible",
      }}
    >
      <Box sx={{ width: "70%", marginBottom: "20px" }}>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 10,
            borderRadius: 5,
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            '& .MuiLinearProgress-bar': { backgroundColor: lightBlue }
          }}
        />
        <Typography variant="body2" sx={{ color: "white", textAlign: "right", mt: 1 }}>
          Question {currentQuestionIndex + 1} of {questions.length}
        </Typography>
      </Box>

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
          marginBottom: "40px",
        }}
      >
        <Typography sx={{ color: "white", fontSize: "1.8rem", fontWeight: "500", mb: 4 }}>
          {currentQuestion.text}
        </Typography>
        
        {currentQuestion.type === "multi" && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {currentQuestion.options?.map((option) => {
            const selectedValues: any[] = answers[currentQuestion.id] || [];
            const isSelected = selectedValues.includes(option.value);

            return (
              <Button
                key={option.value}
                variant={isSelected ? "contained" : "outlined"}
                onClick={() => {
                  const updated = isSelected
                    ? selectedValues.filter((v) => v !== option.value)
                    : [...selectedValues, option.value];
                  setAnswers({ ...answers, [currentQuestion.id]: updated });
                }}
                sx={{
                  color: "white",
                  borderColor: "rgba(255, 255, 255, 0.5)",
                  backgroundColor: isSelected ? lightBlue : "transparent",
                  textTransform: "none",
                  fontSize: "1rem",
                  '&:hover': {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    borderColor: "white"
                  }
                }}
              >
                {option.label}
              </Button>
            );
          })}
        </Box>
      )}

        {currentQuestion.type === "selection" && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {currentQuestion.options?.map((option) => (
            <Button
            key={option.value}
            variant={selectedOption === option.value ? "contained" : "outlined"}
            onClick={() => setSelectedOption(option.value)}
            sx={{
              color: "white",
              borderColor: "rgba(255, 255, 255, 0.5)",
              backgroundColor: selectedOption === option.value ? lightBlue : "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              textTransform: "none",
              fontSize: "1rem",
              gap: 2,
              '&:hover': {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderColor: "white",
              }
            }}
            >
            {option.image && (
              <img
              src={option.image}
              alt={option.label}
              width="32"
              height="32"
              style={{ borderRadius: "50%" }}
              />
            )}
            {option.label}
            </Button>
          ))}
          </Box>
        )}


        <Box sx={{ mb: 4 }}>
          {(currentQuestion.type === "range" || currentQuestion.type === "number") && (
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
              <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between", color: "white" }}>
                <Typography>{currentQuestion.min ?? 0}</Typography>
                <Typography>{currentQuestion.max ?? 100}</Typography>
              </Box>

              <Box sx={{ width: "100%", display: "flex", alignItems: "center", gap: 2 }}>
                <input
                  type="range"
                  min={currentQuestion.min ?? 0}
                  max={currentQuestion.max ?? 100}
                  step={parseFloat(currentQuestion.inputProps?.step ?? "1")}
                  value={rangeValue}
                  onChange={(e) => setRangeValue(parseFloat(e.target.value))}
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
                {parseFloat(rangeValue.toFixed(2))}
              </Typography>
            </Box>
          )}
        </Box>

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
              backgroundColor: lightBlue,
              color: "#14213D",
              textTransform: "none",
              fontSize: "1rem",
              padding: "8px 24px",
              borderRadius: "20px",
              fontWeight: "bold",
              '&:hover': {
                backgroundColor: "#90CAF9",
              },
              '&:disabled': {
                backgroundColor: "rgba(100, 181, 246, 0.5)",
                color: "rgba(20, 33, 61, 0.5)"
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
