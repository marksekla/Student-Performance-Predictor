from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import pandas as pd
import numpy as np

app = Flask(__name__)
CORS(app)

# Load the trained pipeline
with open('student_performance_model.pkl', 'rb') as f:
    pipeline = pickle.load(f)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get the JSON data from the request
        data = request.get_json()
        
        # Validate numerical inputs
        if not (0 <= float(data['hoursStudied']) <= 24):
            raise ValueError("Hours studied must be between 0 and 24")
        if not (0 <= float(data['previousScores']) <= 100):
            raise ValueError("Previous scores must be between 0 and 100")
        if not (0 <= float(data['attendance']) <= 100):
            raise ValueError("Attendance must be between 0 and 100")
        if not (0 <= float(data['tutoringSessions']) <= 100):  # adjust max as needed
            raise ValueError("Tutoring sessions must be between 0 and 100")
        
        # Create DataFrame with raw features
        # Note: No need to encode - pipeline will handle it
        input_data = pd.DataFrame({
            # Numerical features (will be scaled by pipeline)
            'Hours_Studied': [float(data['hoursStudied'])],
            'Previous_Scores': [float(data['previousScores'])],
            'Sleep_Hours': [float(data['sleepHours'])],
            'Physical_Activity': [float(data['physicalActivity'])],
            'Attendance': [float(data['attendance'])],
            'Tutoring_Sessions': [float(data['tutoringSessions'])],
            
            # Binary features (will be encoded by pipeline)
            'Extracurricular_Activities': [data['extracurricularActivities']],  # e.g. "yes"/"no"
            'Internet_Access': [data['internetAccess']],  # e.g. "yes"/"no"
            'Learning_Disabilities': [data['learningDisabilities']],  # e.g. "yes"/"no"
            
            # Multi-category features (will be one-hot encoded by pipeline)
            'School_Type': [data['schoolType']],  # e.g. "public"/"private"
            'Distance_from_Home': [data['distanceFromHome']],  # e.g. "close"/"medium"/"far"
            'Parental_Involvement': [data['parentalInvolvement']],  # e.g. "low"/"medium"/"high"
            'Access_to_Resources': [data['accessToResources']]  # e.g. "low"/"medium"/"high"
        })
        
        # Make prediction - pipeline handles all preprocessing
        prediction = pipeline.predict(input_data)
        
        return jsonify({
            'success': True,
            'prediction': float(prediction[0]),
            'message': 'Prediction successful'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'message': 'Error making prediction'
        }), 400

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'message': 'Server is running'
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)