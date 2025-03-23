import { useLocation } from "react-router-dom";
import RandomForestDashboard from "../components/RandomForestDashboard/RandomForestDashboard";

export default function RFResults() {
  const location = useLocation();
  const { userInput, predictionResult } = location.state || {};

  if (!userInput || !predictionResult) {
    return <div>Missing results — please complete the questionnaire first.</div>;
  }


  return (
    <div>
      <RandomForestDashboard
        userInput={userInput}
        predictionResult={predictionResult}
      />
    </div>
  );
}
