import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { CssBaseline, ThemeProvider } from '@mui/material'
import AppThemeController from './middleware/AppThemeController'
import WebLandingPage from './integrals/WebLandingPage'
import { HashRouter, Route, Routes } from 'react-router-dom'
import WebProjectsPage from './integrals/WebProjectsPage'
import WebTierPage from './integrals/WebTierPage'
import 'atropos/css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import ModelChoicePage from "./integrals/ModelChoice.tsx";
import RF_WebQuestionnaire from "./integrals/RF_WebQuestionnaire.tsx";
import LR_WebQuestionnaire from "./integrals/LR_WebQuestionnaire.tsx";
<<<<<<< Updated upstream
import ModelChoicePage from "./integrals/ModelChoice.tsx";
import ResultsPage from "./integrals/RFResults.tsx";
=======
import Results from "./integrals/Charts/LR/Results.tsx";
>>>>>>> Stashed changes

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <HashRouter>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={AppThemeController.baseTheme}>
        <CssBaseline />
        <Routes>
          <Route path="/choice" element={<ModelChoicePage />} />
          <Route path="/" element={<WebLandingPage />} />
          <Route path="/" element={<App />}>
          <Route path="/project/:projectId" element={<WebProjectsPage />} />
          <Route path="tier/:tier" element={<WebTierPage />} />
          <Route path="/random-forest" element={<RF_WebQuestionnaire />} />
          <Route path="/linear-regression" element={<LR_WebQuestionnaire />} />
<<<<<<< Updated upstream
          <Route path="/rf-results" element={<ResultsPage />} />
=======
          <Route path="/results" element={<Results />} />
>>>>>>> Stashed changes
          </Route>
        </Routes>
      </ThemeProvider>
    </QueryClientProvider>
  </HashRouter>
);
