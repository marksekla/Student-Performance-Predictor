import React, { useState, useEffect } from "react";
import { Box, Typography, LinearProgress, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import RandomForestDashboard from "../components/RandomForestDashboard/RandomForestDashboard";

export default function WebQuestionnaire() {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [selectedOption, setSelectedOption] = useState<string | number | null>(null);
  const [textInput, setTextInput] = useState("");
  const [rangeValue, setRangeValue] = useState<number>(0);
  const [hasRangeChanged, setHasRangeChanged] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [userInput, setUserInput] = useState({});

  const questions = [
    // Update Age question: max changed to 80 (min remains as desired)
    { id: 1, text: 'What is your age?', type: 'number', min: 15, max: 80, inputProps: { step: '1'} },
    // Update Gender question: add an Other option
    { id: 2, text: 'What is your Gender?', type: 'selection', subtype: 'button-image', options: [
        { label: 'Male', value: 0},
        { label: 'Female', value: 1},
        { label: 'Other', value: 'Other' }
      ]
    },
    { id: 3, text: 'What is your Ethnicity?', type: 'selection', options: [
        { label: 'Caucasian', value: 0 },
        { label: 'African American', value: 1 },
        { label: 'Asian', value: 2 },
        { label: 'Other', value: 3 }
      ]
    },
    { id: 4, text: "What education did your parents complete?", type: 'selection', options: [
        { label: 'None', value: 0 },
        { label: 'High School', value: 1 },
        { label: 'Some College', value: 2 },
        { label: "Bachelor's", value: 3 },
        { label: 'Higher', value: 4 }
      ]
    },
    { id: 5, text: 'How many hours do you study per week?', type: 'number', min: 0, max: 20, inputProps: { step: '1' } },
    { id: 6, text: 'How many absences did you have during your last semester?', type: 'number', min: 0, max: 30, inputProps: { step: '1' } },
    { id: 7, text: 'How supportive are parents with your education?', type: 'selection', options: [
        { label: 'None', value: 0 },
        { label: 'Low', value: 1 },
        { label: 'Moderate', value: 2 },
        { label: 'High', value: 3 },
        { label: 'Very High', value: 4 }
      ]
    },
    { id: 8, text: 'Choose all that apply: Tutoring, Extracurricular, Sports, Music, Volunteering', type: 'multi', options: [
        { label: 'Tutoring', value: 'tutoring' },
        { label: 'Extracurricular', value: 'extracurricular' },
        { label: 'Sports', value: 'sports' },
        { label: 'Music', value: 'music' },
        { label: 'Volunteering', value: 'volunteering' }
      ]
    },
    { id: 9, text: 'What is your GPA (Grade point average)?', type: 'number', min: 0.0, max: 4.0, inputProps: { step: '0.01' } }
  ];

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.overflow = "auto";

    // Reset inputs based on question type and any saved answers
    if (currentQuestion.type === "selection") {
      setSelectedOption(
        answers[currentQuestion.id] !== undefined ? answers[currentQuestion.id] : null
      );
    }
    if (currentQuestion.type === "text") {
      setTextInput(
        answers[currentQuestion.id] !== undefined ? answers[currentQuestion.id] : ""
      );
    }
    if (currentQuestion.type === "number" || currentQuestion.type === "range") {
      setRangeValue(
        answers[currentQuestion.id] !== undefined
          ? answers[currentQuestion.id]
          : currentQuestion.min ?? 0
      );
      setHasRangeChanged(answers[currentQuestion.id] !== undefined);
    }
  }, [currentQuestionIndex]);

  // Save the current answer based on the question type and return the updated object
  const saveCurrentAnswer = () => {
    let updatedAnswers = { ...answers };
    if (currentQuestion.type === "selection" && selectedOption !== null) {
      updatedAnswers[currentQuestion.id] = selectedOption;
    } else if (currentQuestion.type === "text" && textInput.trim()) {
      updatedAnswers[currentQuestion.id] = textInput;
    } else if (
      (currentQuestion.type === "number" || currentQuestion.type === "range") &&
      (hasRangeChanged || answers[currentQuestion.id] !== undefined)
    ) {
      const valueToSave =
        currentQuestion.inputProps?.step === "0.01"
          ? parseFloat(rangeValue.toFixed(2))
          : rangeValue;
      updatedAnswers[currentQuestion.id] = valueToSave;
    }
    setAnswers(updatedAnswers);
    return updatedAnswers; // Return the new updatedAnswers object
  };

  const handleNext = () => {
    const updatedAnswers = saveCurrentAnswer();

    if (currentQuestionIndex === questions.length - 1) {
      handleSubmit(updatedAnswers);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleSubmit = async (finalAnswers: Record<number, any>) => {
    const selectedPrograms = finalAnswers[8] || [];

    const formattedInput = {
      Age: finalAnswers[1],
      // Map Gender: if the answer is exactly 0 (Male), leave as 0; otherwise, treat as 1 (Female)
      Gender: finalAnswers[2] === 0 ? 0 : 1,
      Ethnicity: finalAnswers[3],
      ParentalEducation: finalAnswers[4],
      StudyTimeWeekly: finalAnswers[5],
      Absences: finalAnswers[6],
      ParentalSupport: finalAnswers[7],
      Tutoring: selectedPrograms.includes("tutoring"),
      Extracurricular: selectedPrograms.includes("extracurricular"),
      Sports: selectedPrograms.includes("sports"),
      Music: selectedPrograms.includes("music"),
      Volunteering: selectedPrograms.includes("volunteering"),
      GPA: finalAnswers[9],
    };

    console.log("Sending payload to backend:", formattedInput);

    try {
      const response = await fetch("http://localhost:5000/predict_random_forest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formattedInput),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();

      navigate("/rf-results", {
        state: {
          userInput: formattedInput,
          predictionResult: result
        }
      });
    } catch (err: any) {
      console.error("Fetch error:", err.message || err);
    }
  };

  const handlePrevious = () => {
    saveCurrentAnswer();
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const isNextDisabled = () => {
    if (currentQuestion.type === "selection" && selectedOption === null) return true;
    if (currentQuestion.type === "text" && !textInput.trim()) return true;
    if (
      (currentQuestion.type === "number" || currentQuestion.type === "range") &&
      answers[currentQuestion.id] === undefined &&
      !hasRangeChanged
    ) {
      return true;
    }
    if (currentQuestion.type === "multi") {
      const selections = answers[currentQuestion.id] || [];
      if (selections.length === 0) return true;
    }
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
            "& .MuiLinearProgress-bar": { backgroundColor: lightBlue }
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
          marginBottom: "40px"
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
                    "&:hover": {
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
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    borderColor: "white"
                  }
                }}
              >
                {option.label}
              </Button>
            ))}
          </Box>
        )}

        <Box sx={{ mb: 4 }}>
          {(currentQuestion.type === "range" || currentQuestion.type === "number") && (
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  color: "white"
                }}
              >
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
                  onChange={(e) => {
                    setRangeValue(parseFloat(e.target.value));
                    setHasRangeChanged(true);
                  }}
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
              "&:hover": {
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
              "&:hover": {
                backgroundColor: "#90CAF9",
              },
              "&:disabled": {
                backgroundColor: "rgba(100, 181, 246, 0.5)",
                color: "rgba(20, 33, 61, 0.5)",
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
