import React, { useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import LoopIcon from "@mui/icons-material/Loop";
import { useNavigate } from "react-router-dom";
import WebAppBar from "../components/WebAppBar";
import { WebAppBarLink } from "../components/WebAppBar/interfaces";

export default function ModelChoice() {
  const navigate = useNavigate();
  const lightBlue = "#64B5F6";

  const webAppBarLinks: WebAppBarLink[] = [
        { title: "Home", anchor: "/#maindiv-001" },
        { title: "Projects", anchor: "/#subdiv-002" },
        { title: "Contact Us", anchor: "/#contact" },
    ];


  const cards = [
    {
      title: "Letter Grade",
      route: "/random-forest",
      description: "This questionnaire helps collect categorical and numerical inputs for a Random Forest model to predict student performance based on behavior and study habits.",
    },
    {
      title: "Linear Regression",
      route: "/linear-regression",
      description: "Use this questionnaire to gather numerical input data optimized for a Linear Regression model analyzing academic trends and productivity scores.",
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
        minHeight: "100vh", // Changed from height to minHeight to allow scrolling
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        background: "#14213D", // Changed to solid color as requested
        position: "relative",
        paddingBottom: "40px", // Add bottom padding for better spacing
        overflow: "visible", // Allow content to overflow for scrolling
      }}
    >

      <WebAppBar links={webAppBarLinks}/>
      <Typography variant="h3" sx={{ color: "white", mb: 2 }}>
        Choose a Model
      </Typography>
      <Typography variant="h6" sx={{ color: "rgba(255,255,255,0.8)", mb: 6 }}>
        Click the icon to flip the card and learn more
      </Typography>

      <Box sx={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center" }}>
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
              {/* Front */}
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
                  fontSize: "1.4rem",
                  fontWeight: "bold",
                  color: "#14213D",
                  boxShadow: "0 8px 16px rgba(0,0,0,0.3)",
                  padding: "20px",
                  textAlign: "center",
                }}
                onClick={() => navigate(card.route)}
              >
                {card.title} Questionnaire

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
                    '&:hover': { backgroundColor: "#fff" },
                    zIndex: 2,
                  }}
                >
                  <LoopIcon />
                </IconButton>
              </Box>

              {/* Back */}
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
                    '&:hover': { backgroundColor: "rgba(255,255,255,0.4)" },
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
    </Box>
  );
}
