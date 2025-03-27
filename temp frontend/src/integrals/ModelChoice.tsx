import React, { useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import LoopIcon from "@mui/icons-material/Loop";
import { useNavigate } from "react-router-dom";

export default function ModelChoice() {
  const navigate = useNavigate();
  const lightBlue = "#64B5F6";

  const cards = [
    {
      title: "Predict Your Letter Grade: A Quick Student Survey",
      subtitle: "Provide your academic and personal details to see an estimated letter grade.",
      route: "/random-forest",
      description:
        "Answer a few questions about your study routines and environment to see how your letter grade might look.",
    },
    {
      title: "Percentage Grade",
      route: "/linear-regression",
      description:
        "This questionnaire collects information about your study habits and academic environment to predict your exam score percentage.",
    },
  ];

  const [flippedStates, setFlippedStates] = useState(cards.map(() => false));

  const toggleFlip = (index: number) => {
    setFlippedStates((prev) =>
      prev.map((state, i) => (i === index ? !state : state))
    );
  };

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
      <Typography variant="h3" sx={{ color: "white", mb: 2 }}>
        Choose a Survey
      </Typography>
      <Typography variant="h6" sx={{ color: "rgba(255,255,255,0.8)", mb: 6 }}>
        Click the icon to flip the card and learn more
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 6,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {cards.map((card, index) => (
          <Box
            key={index}
            sx={{
              perspective: "1000px",
              width: 380,
              height: 300,
              cursor: "pointer",
            }}
          >
            <Box
              className="flip-card"
              sx={{
                width: "100%",
                height: "100%",
                transition: "transform 0.6s",
                transformStyle: "preserve-3d",
                position: "relative",
                transform: flippedStates[index] ? "rotateY(180deg)" : "rotateY(0deg)",
              }}
            >
              {/* Front of the Card */}
              <Box
                sx={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  backfaceVisibility: "hidden",
                  backgroundColor: lightBlue,
                  borderRadius: "16px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "#14213D",
                  boxShadow: "0 8px 16px rgba(0,0,0,0.3)",
                  padding: "20px",
                  textAlign: "center",
                }}
                onClick={() => navigate(card.route)}
              >
                <Typography
                  variant="h4"
                  sx={{ mb: 1, fontWeight: "bold", fontSize: "2.0rem" }}
                >
                  {card.title}
                </Typography>
                {card.subtitle && (
                  <Typography variant="h6" sx={{ mb: 2, fontSize: "1.3rem" }}>
                    {card.subtitle}
                  </Typography>
                )}

                {/* Flip icon */}
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent navigation
                    toggleFlip(index);
                  }}
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    color: "#14213D",
                    backgroundColor: "rgba(255, 255, 255, 0.6)",
                    "&:hover": { backgroundColor: "#fff" },
                    zIndex: 2,
                  }}
                >
                  <LoopIcon />
                </IconButton>
              </Box>

              {/* Back of the Card */}
              <Box
                sx={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  backfaceVisibility: "hidden",
                  backgroundColor: "rgba(255,255,255,0.1)",
                  borderRadius: "16px",
                  color: "white",
                  transform: "rotateY(180deg)",
                  boxShadow: "0 8px 16px rgba(0,0,0,0.3)",
                  padding: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  fontSize: "0.95rem",
                }}
                onClick={() => navigate(card.route)}
              >
                {card.description}

                {/* Flip icon */}
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFlip(index);
                  }}
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    color: "white",
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    "&:hover": { backgroundColor: "rgba(255,255,255,0.4)" },
                    zIndex: 2,
                  }}
                >
                  <LoopIcon />
                </IconButton>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Disclaimer (styled similarly to the disclaimers in your charts) */}
      <Typography
        variant="body2"
        sx={{
          mt: 4,
          fontStyle: "italic",
          textAlign: "center",
          maxWidth: 700,
          backgroundColor: "#2d2d2d",
          p: 2,
          borderRadius: 1,
          color: "#f9f9f9",
          lineHeight: 1.6,
        }}
      >
        Disclaimer: We do not store any user data. All information is processed locally
        and not saved on our servers.
      </Typography>
    </Box>
  );
}
