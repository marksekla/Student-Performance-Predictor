import { Box, Typography, Button } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

// @ts-ignore
import ChartsTest from './ChartsTest';

const Results = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { userInputs, predictionResult } = location.state || {};
    
    // Redirect to questionnaire if accessed directly without data
    if (!userInputs || !predictionResult) {
        navigate('/questionnaire');
        return null;
    }
    
    return (
        <Box
            sx={{
                minHeight: "100vh",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                background: "#14213D",
                color: "white",
                padding: "40px 20px",
            }}
        >
            <Typography variant="h3" sx={{ mb: 4 }}>
                Your Predicted Results
            </Typography>
            
            <Box sx={{ width: "100%", maxWidth: "1200px", display: "flex", justifyContent: "center", marginBottom: "16vh" }}>
                <ChartsTest userInputs={userInputs} predictionResult={predictionResult} />
            </Box>
            
            <Button 
                onClick={() => navigate('/')}
                sx={{
                    backgroundColor: "#64B5F6",
                    color: "#14213D",
                    padding: "10px 20px",
                    borderRadius: "20px",
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

export default Results;