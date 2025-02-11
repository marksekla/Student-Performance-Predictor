from flask import Blueprint, request, jsonify
import pandas as pd
import numpy as np
import pickle
import os
import sys


# backend.models is referring to models.py, NOT models/ folder
# linear_regression_pipeline is the variable inside of models.py, NOT the pickle file
from backend.models import linear_regression_pipeline


# Create a Blueprint for predict routes
predict_linear_regression_bp = Blueprint('predict_linear_regression', __name__)


@predict_linear_regression_bp.route('/linear_regression', methods=['POST'])
def predict_linear_regression():
    try:
        # Get the JSON data from the request
        data = request.get_json()
        
        # Validate numerical inputs
        if not (0 <= float(data['hoursStudied']) <= 80):  # Max ~11.4 hrs/day for 7 days
            raise ValueError("Hours studied per week must be between 0 and 80")
        
        if not (0 <= float(data['attendance']) <= 100):
            raise ValueError("Attendance percentage must be between 0 and 100")
        
        if not (0 <= float(data['previousScores']) <= 100):
            raise ValueError("Previous scores must be between 0 and 100")
        
        if not (0 <= float(data['tutoringSessions']) <= 30):  # Max 1 session per day
            raise ValueError("Monthly tutoring sessions must be between 0 and 30")
        
        if not (0 <= float(data['physicalActivity']) <= 40):
            raise ValueError("Physical activity hours must be between 0 and 40")
        

        # Creating DataFrame with raw features
        input_data = pd.DataFrame({
            # Numerical features
            'Hours_Studied': [float(data['hoursStudied'])],
            'Previous_Scores': [float(data['previousScores'])],
            'Physical_Activity': [float(data['physicalActivity'])],
            'Attendance': [float(data['attendance'])],
            'Tutoring_Sessions': [float(data['tutoringSessions'])],
            
            # Binary features
            'Extracurricular_Activities': [data['extracurricularActivities']],
            'Internet_Access': [data['internetAccess']],
            'Learning_Disabilities': [data['learningDisabilities']],
            'Gender': [data['gender']],
            
            # Multi-category features
            'Distance_from_Home': [data['distanceFromHome']],
            'Parental_Involvement': [data['parentalInvolvement']],
            'Access_to_Resources': [data['accessToResources']],
            'Motivation_Level': [data['motivationLevel']],
            'Family_Income': [data['familyIncome']],
            'Teacher_Quality': [data['teacherQuality']],
            'Peer_Influence': [data['peerInfluence']],
            'Parental_Education_Level': [data['parentalEducationLevel']]
        })
        
        # Make prediction
        prediction = linear_regression_pipeline.predict(input_data)[0]  # Get first (and only) prediction
        capped_prediction = min(100, max(0, prediction))  # Cap between 0 and 100
        rounded_prediction = round(float(capped_prediction), 2)  # Convert to float and round to 2 decimal places
                
        return jsonify({
            'success': True,
            'prediction': rounded_prediction,
            'message': 'Prediction successful'
        })


    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'message': 'Error making prediction'
        }), 400
