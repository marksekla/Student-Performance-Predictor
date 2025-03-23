import { Box, SxProps, Typography } from "@mui/material";
import ContactUs from "../StayConnectedContainer/ContactUs";

export default function Footer(props: { sx?: SxProps }) {
    const today = new Date();
    const year = today.getFullYear();

    return (
        <Box 
            sx={{ 
                ...props.sx, 
                display: "flex", 
                alignItems: "center", // Align items vertically
                justifyContent: "space-between", // Keeps left and right aligned
                width: "100%", 
                padding: "20px 50px", // Adjust padding to match Stay Connected section
                position: "relative", // Allows absolute positioning for the logo
            }}
        >
            {/* Copyright Text (Left) */}
            <Typography sx={{ fontSize: "16px", color: "#fff" }}>
                &copy; {year} Student Performance Predictor
            </Typography>

            {/* Centered Logo */}
            <Box sx={{ 
                position: "absolute", 
                left: "50%", 
                transform: "translateX(-50%)" // Moves logo to exact center
            }}>
                <img 
                    src="../logo256.png" 
                    alt="Logo" 
                    style={{ maxHeight: "40px" }} 
                />
            </Box>

            {/* Contact Icons (Right) */}
            <ContactUs sx={{ justifyContent: "flex-end" }} />
        </Box>
    );
}
