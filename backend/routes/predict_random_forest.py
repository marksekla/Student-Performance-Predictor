from flask import Blueprint, request, jsonify
import pandas as pd

from models import random_forest_pipeline

# Create a Blueprint for predict routes
predict_random_forest_bp = Blueprint('predict_random_forest', __name__)

@predict_random_forest_bp.route('/predict_random_forest', methods=['POST'])
def predict_random_forest():
    try:
        # Get JSON data
        data = request.get_json()

        # Convert JSON to DataFrame
        input_data = pd.DataFrame([data])

        # Apply feature engineering
        input_data = feature_engineering(input_data)

        prediction = random_forest_pipeline.predict(input_data)

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
