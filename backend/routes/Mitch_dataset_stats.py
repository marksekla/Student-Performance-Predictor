from flask import Blueprint, jsonify
from backend.config import root_dir
import pandas as pd

# Create a Blueprint named "stats"
Mitch_dataset_stats_bp = Blueprint('Mitch_dataset_stats', __name__)

# Define your features – adjust these lists if your CSV column names differ.
numeric_features = ['Age', 'StudyTimeWeekly', 'Absences', 'GPA']
categorical_features = [
    'Tutoring', 'ParentalSupport', 'Extracurricular',
    'Sports', 'Music', 'Volunteering',
    'ParentalEducation', 'Ethnicity', 'Gender'
]

def compute_summary_statistics():
    # Load the dataset
    df = pd.read_csv(f'{root_dir}/data/combined_shuffled_student_performance.csv')

    # Compute numeric statistics
    numeric_stats = {}
    for feature in numeric_features:
        if feature in df.columns:
            numeric_stats[f'{feature.lower()}_avg'] = float(df[feature].mean())
            numeric_stats[f'{feature.lower()}_std'] = float(df[feature].std())
            numeric_stats[f'{feature.lower()}_min'] = float(df[feature].min())
            numeric_stats[f'{feature.lower()}_max'] = float(df[feature].max())
        else:
            print(f"Warning: Column '{feature}' not found in dataset.")

    # Compute categorical distributions as percentages
    categorical_stats = {}
    for feature in categorical_features:
        if feature in df.columns:
            counts = df[feature].value_counts(normalize=True) * 100
            distribution = counts.round(1).to_dict()
            categorical_stats[f'{feature.lower()}_dist'] = distribution
        else:
            print(f"Warning: Column '{feature}' not found in dataset.")

    # Combine both numeric and categorical stats into one dictionary
    stats = {**numeric_stats, **categorical_stats}
    return stats

# Define the endpoint using the blueprint
@Mitch_dataset_stats_bp.route('/Mitch_dataset_stats', methods=['GET'])
def dataset_stats():
    stats = compute_summary_statistics()
    return jsonify(stats)
