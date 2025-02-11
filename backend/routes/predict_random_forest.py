from flask import Blueprint, request, jsonify
import pandas as pd

from models import random_forest_pipeline

import os
import sys
backend_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'scripts'))
sys.path.append(backend_path)

from feature_engineering_random_forest import feature_engineering

# Mappings
gender_map = {'Male': 0, 'Female': 1}
ethnicity_map = {'Caucasian': 0, 'African American': 1, 'Asian': 2, 'Other': 3}
education_map = {
    'None': 0,
    'High School': 1,
    'Some College': 2,
    "Bachelor's": 3,
    'Higher': 4
}
parentalSupport_map = {
    'None': 0,
    'Low' : 1,
    'Moderate' : 2,
    'High' : 3,
    'Very High' : 4
}
predicted_grade_map = {1.0 : 'D',
                       2.0 : 'C',
                       3.0 : 'B',
                       4.0 : 'A'}

# Create a Blueprint for predict routes
predict_random_forest_bp = Blueprint('predict_random_forest', __name__)
def predict_random_forest():
        # Get JSON data
        data = request.get_json()

        # Convert booleans (True/False) to integers (1/0)
        data['Tutoring']          = 1 if data['Tutoring'] else 0
        data['ParentalSupport']   = 1 if data['ParentalSupport'] else 0
        data['Extracurricular']   = 1 if data['Extracurricular'] else 0
        data['Sports']            = 1 if data['Sports'] else 0
        data['Music']             = 1 if data['Music'] else 0
        data['Volunteering']      = 1 if data['Volunteering'] else 0

        # Convert strings to numeric codes using the dictionaries above
        data['Gender']            = gender_map.get(data['Gender'], 0)
        data['Ethnicity']         = ethnicity_map.get(data['Ethnicity'], 3)  # default to 'Other'
        data['ParentalEducation'] = education_map.get(data['ParentalEducation'], 0)
        data['ParentalSupport'] = parentalSupport_map.get(data['ParentalSupport'], 0)

        # Convert JSON to DataFrame
        input_data = pd.DataFrame([data])

        prediction = random_forest_pipeline.predict(input_data)

        print('prediction:', prediction)

        return jsonify({
            'success': True,
            'prediction': float(prediction[0]),
            'model': 'Random Forest'
        })
        except Exception as e:
            return jsonify({
                'success': False,
                'error': str(e)
        }), 400
