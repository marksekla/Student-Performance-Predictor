import { Box, Paper, SxProps, Typography } from "@mui/material";
import Atropos from "atropos/react";
import { useNavigate } from "react-router-dom";
import { LandingProject } from "./interfaces";

function LandingProjectCard(props: { sx?: SxProps, mobileView: boolean, project: LandingProject }) {
  const navigate = useNavigate();
  const handleCardClick = (project: LandingProject) =>
    navigate(`/project/${project._id}`);

  return (
    (!props.mobileView) ?
      <Atropos
        highlight={false}
        onClick={() => {
          handleCardClick(props.project);
        }}
        style={{ minWidth: "800px", height: "60vh", cursor: "pointer" }}
      >
        <Paper
          sx={{
            ...props?.sx,
            borderRadius: "35px",
            padding: "30px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center", // Centers content vertically
            alignItems: "center", // Centers content horizontally
            textAlign: "center", // Centers text inside
            color: "#000000",
            bgcolor: "#ffffff",
            width: "100%",
            height: "100%",
          }}
        >
          <Box 
            sx={{ 
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center", 
              justifyContent: "center", 
              textAlign: "center", 
              width: "100%", 
              height: "100%" // Ensures full height for vertical centering
            }}
          >
            <Typography sx={{ fontSize: "1.8rem", fontWeight: 700 }}>
              {props.project.name}
            </Typography>
            <Typography sx={{ marginTop: "15px", fontSize: "1.1rem", fontWeight: 400, maxWidth: "80%" }}>
              {props.project.description}
            </Typography>
          </Box>
        </Paper>
      </Atropos> :
      <Paper
        elevation={5}
        onClick={() => {
          handleCardClick(props.project);
        }}
        sx={{
          ...props?.sx,
          cursor: 'pointer',
          borderRadius: "35px",
          padding: "30px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center", // Centers content vertically
          alignItems: "center", // Centers content horizontally
          textAlign: "center", // Centers text inside
          color: "#000000",
          bgcolor: "#ffffff",
          maxWidth: "100%",
          height: "400px",
          overflow: 'hidden'
        }}
      >
        <Box 
          sx={{ 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center", 
            justifyContent: "center", 
            textAlign: "center", 
            width: "100%", 
            height: "100%" 
          }}
        >
          <Typography sx={{ fontSize: "1.5rem", fontWeight: 700 }}>
            {props.project.name}
          </Typography>
          <Typography sx={{ marginTop: "10px", fontSize: "1.1rem", fontWeight: 400, maxWidth: "80%" }}>
            {props.project.description}
          </Typography>
        </Box>
      </Paper>
  );
}

export default LandingProjectCard;
