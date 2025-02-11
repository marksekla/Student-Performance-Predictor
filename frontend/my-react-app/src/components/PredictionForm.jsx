import React, { useState } from 'react';

function PredictionForm({ onPrediction }) {
  // Model toggle
  const [modelType, setModelType] = useState('random_forest')

  // State hooks for each field
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [ethnicity, setEthnicity] = useState('');
  const [parentalEducation, setParentalEducation] = useState('');
  const [studyTimeWeekly, setStudyTimeWeekly] = useState('');
  const [absences, setAbsences] = useState('');
  const [tutoring, setTutoring] = useState(false);
  const [parentalSupport, setParentalSupport] = useState(false);
  const [extracurricular, setExtracurricular] = useState(false);
  const [sports, setSports] = useState(false);
  const [music, setMusic] = useState(false);
  const [volunteering, setVolunteering] = useState(false);
  const [gpa, setGpa] = useState('');

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Build request payload
    const payload = {
        Age: parseFloat(age),
        Gender: gender,
        Ethnicity: ethnicity,
        ParentalEducation: parentalEducation,
        StudyTimeWeekly: parseFloat(studyTimeWeekly),
        Absences: parseFloat(absences),
        Tutoring: tutoring,                 // boolean (true/false)
        ParentalSupport: parentalSupport,   // boolean
        Extracurricular: extracurricular,   // boolean
        Sports: sports,                     // boolean
        Music: music,                       // boolean
        Volunteering: volunteering,         // boolean
        GPA: parseFloat(gpa),
    };

    try {
      let endpoint = '';
      if (modelType === 'linear_regression') {
        endpoint = 'http://localhost:5000/predict_linear_regression';
      } else {
        endpoint = 'http://localhost:5000/predict_random_forest';
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (data.success) {
        // Pass the prediction back to the parent
        onPrediction(data.prediction);
      } else {
        console.error('Prediction Error:', data.error);
      }
    } catch (error) {
      console.error('Error fetching prediction:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>

          {/* Model Selector (if you still want both models) */}
          <div>
            <label>Model Type:</label>
            <select value={modelType} onChange={(e) => setModelType(e.target.value)}>
              <option value="linear_regression">Linear Regression</option>
              <option value="random_forest">Random Forest</option>
            </select>
          </div>

          {/* Age */}
          <div>
            <label>Age:</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
            />
          </div>

          {/* Gender */}
          <div>
            <label>Gender:</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
            >
            <option value="">-- Select Gender --</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            </select>
          </div>

          {/* Ethnicity Dropdown */}
      <div>
        <label>Ethnicity:</label>
        <select
          value={ethnicity}
          onChange={(e) => setEthnicity(e.target.value)}
          required
        >
          <option value="">-- Select Ethnicity --</option>
          <option value="Caucasian">Caucasian</option>
          <option value="African American">African American</option>
          <option value="Asian">Asian</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Parental Education Dropdown */}
      <div>
        <label>Parental Education:</label>
        <select
          value={parentalEducation}
          onChange={(e) => setParentalEducation(e.target.value)}
          required
        >
          <option value="">-- Select Education Level --</option>
          <option value="None">None</option>
          <option value="High School">High School</option>
          <option value="Some College">Some College</option>
          <option value="Bachelor's">Bachelor's</option>
          <option value="Higher">Higher</option>
        </select>
      </div>

          {/* Study Time Weekly */}
          <div>
            <label>Study Time (Weekly Hours):</label>
            <input
              type="number"
              value={studyTimeWeekly}
              onChange={(e) => setStudyTimeWeekly(e.target.value)}
            />
          </div>

          {/* Absences */}
          <div>
            <label>Absences:</label>
            <input
              type="number"
              value={absences}
              onChange={(e) => setAbsences(e.target.value)}
            />
          </div>

          {/* Tutoring (Checkbox) */}
          <div>
            <label>Tutoring:</label>
            <input
              type="checkbox"
              checked={tutoring}
              onChange={(e) => setTutoring(e.target.checked)}
            />
          </div>

          {/* Parental Support Dropdown */}
     <div>
       <label>Parental Support:</label>
       <select
         value={parentalSupport}
         onChange={(e) => setParentalSupport(e.target.value)}
         required
       >
         <option value="">-- Select Parental Support --</option>
         <option value="0">None</option>
         <option value="1">Low</option>
         <option value="2">Moderate</option>
         <option value="3">High</option>
         <option value="4">Very High</option>
       </select>
     </div>

          {/* Extracurricular */}
          <div>
            <label>Extracurricular:</label>
            <input
              type="checkbox"
              checked={extracurricular}
              onChange={(e) => setExtracurricular(e.target.checked)}
            />
          </div>

          {/* Sports */}
          <div>
            <label>Sports:</label>
            <input
              type="checkbox"
              checked={sports}
              onChange={(e) => setSports(e.target.checked)}
            />
          </div>

          {/* Music */}
          <div>
            <label>Music:</label>
            <input
              type="checkbox"
              checked={music}
              onChange={(e) => setMusic(e.target.checked)}
            />
          </div>

          {/* Volunteering */}
          <div>
            <label>Volunteering:</label>
            <input
              type="checkbox"
              checked={volunteering}
              onChange={(e) => setVolunteering(e.target.checked)}
            />
          </div>

          {/* GPA */}
          <div>
            <label>GPA:</label>
            <input
              type="number"
              step="0.01"
              value={gpa}
              onChange={(e) => setGpa(e.target.value)}
              required
            />
          </div>

          <button type="submit">Predict</button>
        </form>
      );
    }

    export default PredictionForm;
