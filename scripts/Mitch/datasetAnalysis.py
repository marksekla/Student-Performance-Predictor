import pandas as pd
import numpy as np
import json
import os

project_root = os.path.join(os.path.dirname(__file__), '..', '..')

# Define the feature names
numeric_features = ['Age', 'StudyTimeWeekly', 'Absences', 'GPA']
categorical_features = [
    'Tutoring', 'ParentalSupport', 'Extracurricular',
    'Sports', 'Music', 'Volunteering',
    'ParentalEducation', 'Ethnicity', 'Gender'
]

def compute_summary_statistics():

    df = pd.read_csv(os.path.join(project_root, 'data', 'combined_shuffled_student_performance.csv'))
    # Dictionary to store numeric statistics
    numeric_stats = {}
    for feature in numeric_features:
        if feature in df.columns:
            numeric_stats[f'{feature.lower()}_avg'] = df[feature].mean()
            numeric_stats[f'{feature.lower()}_std'] = df[feature].std()
            numeric_stats[f'{feature.lower()}_min'] = df[feature].min()
            numeric_stats[f'{feature.lower()}_max'] = df[feature].max()
        else:
            print(f"Warning: Column '{feature}' not found in dataset.")

    # Dictionary to store categorical distributions (in percentages)
    categorical_stats = {}
    for feature in categorical_features:
        if feature in df.columns:
            # Compute relative frequencies (percentage)
            counts = df[feature].value_counts(normalize=True) * 100
            # Round percentages to one decimal place and convert to dict
            distribution = counts.round(1).to_dict()
            categorical_stats[f'{feature.lower()}_dist'] = distribution
        else:
            print(f"Warning: Column '{feature}' not found in dataset.")

    # Combine both dictionaries
    stats = {**numeric_stats, **categorical_stats}
    return stats

if __name__ == '__main__':
    stats = compute_summary_statistics()

    # Custom function to handle NumPy types
    def convert_np_types(obj):
        if isinstance(obj, (np.int64, np.int32)):
            return int(obj)
        if isinstance(obj, (np.float64, np.float32)):
            return float(obj)
        return str(obj)  # fallback if needed

    # Pass the custom function to json.dumps
    print(json.dumps(stats, indent=4, default=convert_np_types))
