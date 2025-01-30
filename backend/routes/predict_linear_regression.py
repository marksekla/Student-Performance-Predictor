from flask import Blueprint, request, jsonify

import pandas as pd
import numpy as np

from models import linear_regression_pipeline

# Create a Blueprint for predict routes
predict_linear_regression_bp = Blueprint('predict_linear_regression', __name__)

@predict_linear_regression_bp.route('/linear_regression', methods=['POST'])
def predict_linear_regression():
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
