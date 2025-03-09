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

    binary_mappings = {
        'Tutoring': {0: 'No', 1: 'Yes'},
        'Extracurricular': {0: 'No', 1: 'Yes'},
        'Sports': {0: 'No', 1: 'Yes'},
        'Music': {0: 'No', 1: 'Yes'},
        'Volunteering': {0: 'No', 1: 'Yes'}
    }
    genderMap = { 0: 'Male', 1: 'Female' }
    ethnicityMap = { 0: 'Caucasian', 1: 'African American', 2: 'Asian', 3: 'Other' }
    parentalEducationMap = { 0: 'None', 1: 'High School', 2: 'Some College', 3: "Bachelor's", 4: 'Higher' }
    parentalSupportMap = { 0: 'None', 1: 'Low', 2: 'Moderate', 3: 'High', 4: 'Very High' }

    # Apply mappings for each binary categorical feature
    for column, mapping in binary_mappings.items():
        if column in df.columns:
            df[column] = df[column].replace(mapping)

    if 'Gender' in df.columns:
        df['Gender'] = df['Gender'].replace(genderMap)
    if 'Ethnicity' in df.columns:
        df['Ethnicity'] = df['Ethnicity'].replace(ethnicityMap)
    if 'ParentalEducation' in df.columns:
        df['ParentalEducation'] = df['ParentalEducation'].replace(parentalEducationMap)
    if 'ParentalSupport' in df.columns:
        df['ParentalSupport'] = df['ParentalSupport'].replace(parentalSupportMap)

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
