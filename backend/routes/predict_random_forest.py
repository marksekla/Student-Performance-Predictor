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
predicted_grade_map = {0.0 : "A",
                       1.0 : 'B',
                       2.0 : 'C',
                       3.0 : 'D',
                       4.0 : 'F'}

from flask import Blueprint, request, jsonify
import pandas as pd
import json

# backend.models is referring to models.py, NOT models/ folder
# random_forest_pipeline is the variable inside of models.py, NOT the pickle file
from backend.models import random_forest_pipeline
from backend.config import scripts_path

from feature_engineering_random_forest import feature_engineering

# Create a Blueprint for predict routes
predict_random_forest_bp = Blueprint('predict_random_forest', __name__)

@predict_random_forest_bp.route('/predict_random_forest', methods=['POST'])
def predict_random_forest():
    try:
        data = request.get_json(force=True)

        # Convert booleans (True/False) to integers (1/0)
        data['Tutoring']        = 1 if data.get('Tutoring', False) else 0
        data['ParentalSupport'] = 1 if data.get('ParentalSupport', False) else 0
        data['Extracurricular'] = 1 if data.get('Extracurricular', False) else 0
        data['Sports']          = 1 if data.get('Sports', False) else 0
        data['Music']           = 1 if data.get('Music', False) else 0
        data['Volunteering']    = 1 if data.get('Volunteering', False) else 0

        # Convert to DataFrame
        input_data = pd.DataFrame([data])

        # Make prediction
        prediction = random_forest_pipeline.predict(input_data)

        # Convert feature importances to serializable format
        feature_importance_raw = random_forest_pipeline.feature_importance_data
        feature_importance = pd.DataFrame(feature_importance_raw).to_dict(orient="records") \
            if isinstance(feature_importance_raw, pd.DataFrame) else feature_importance_raw


        result = {
            "success": True,
            "prediction": float(prediction[0]),
            "featureImportance": feature_importance,
            "model": "Random Forest"
        }

        return jsonify(result)

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 400
