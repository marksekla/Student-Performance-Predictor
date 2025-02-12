import numpy as np
import pandas as pd

def normalize(x, min_val=0, max_val=100):
    """Normalize values to 0-1 range"""
    return (x - min_val) / (max_val - min_val)


def generate_exam_score(features, categorical_features):
    """
    Generate realistic exam score based on both numerical and categorical features.
    Weights based on actual point differences from original dataset.
    """

    """
    Attendance: 5.81
    Hours_Studied: 4.22
    Previous_Scores: 1.80
    Tutoring_Sessions: 1.03
    Physical_Activity: 0.23
    Sleep_Hours: -0.09
    ------------------------
    Total: 13.00 points
    """
    # Weights for numerical features (sum to 1)
    weights = {
        'attendance': 0.447,      # 5.81/13.00 = 44.7%
        'hours_studied': 0.325,   # 4.22/13.00 = 32.5%
        'previous_scores': 0.138, # 1.80/13.00 = 13.8%
        'tutoring': 0.079,       # 1.03/13.00 = 7.9%
        'physical_activity': 0.018, # 0.23/13.00 = 1.8%
        'sleep_hours': -0.007,    # -0.09/13.00 = -0.7%
    }
    
    # Calculate base score (0-1 range) from numerical features
    base_score = (
        weights['hours_studied'] * normalize(features['hours_studied'], 0, 80) +
        weights['attendance'] * normalize(features['attendance'], 0, 100) +
        weights['previous_scores'] * normalize(features['previous_scores'], 0, 100) +
        weights['tutoring'] * normalize(features['tutoring'], 0, 30) +
        weights['physical_activity'] * normalize(features['physical_activity'], 0, 40) +
        weights['sleep_hours'] * normalize(features['sleep_hours'], 0, 12)
    )


    # Adjust score based on most impactful categorical features
    score_modifier = 1.0  # Start with no modification

    # Access_to_Resources (Medium baseline: 67.13)
    if categorical_features['Access_to_Resources'] == 'High':
        score_modifier *= 1.0143  # 68.09/67.13
    elif categorical_features['Access_to_Resources'] == 'Low':
        score_modifier *= 0.9862  # 66.20/67.13

    # Parental_Involvement (Medium baseline: 67.10)
    if categorical_features['Parental_Involvement'] == 'High':
        score_modifier *= 1.0148  # 68.09/67.10
    elif categorical_features['Parental_Involvement'] == 'Low':
        score_modifier *= 0.9889  # 66.36/67.10

    # Distance_from_Home (Near baseline: 67.51)
    if categorical_features['Distance_from_Home'] == 'Moderate':
        score_modifier *= 0.9922  # 66.98/67.51
    elif categorical_features['Distance_from_Home'] == 'Far':
        score_modifier *= 0.9845  # 66.46/67.51

    # Peer_Influence (Neutral baseline: 67.20)
    if categorical_features['Peer_Influence'] == 'Positive':
        score_modifier *= 1.0062  # 67.62/67.20
    elif categorical_features['Peer_Influence'] == 'Negative':
        score_modifier *= 0.9905  # 66.56/67.20

    # Learning_Disabilities (No baseline: 67.35)
    if categorical_features['Learning_Disabilities'] == 'Yes':
        score_modifier *= 0.9839  # 66.27/67.35

    # Parental_Education_Level (College baseline: 67.32)
    if categorical_features['Parental_Education_Level'] == 'Postgraduate':
        score_modifier *= 1.0097  # 67.97/67.32
    elif categorical_features['Parental_Education_Level'] == 'High School':
        score_modifier *= 0.9936  # 66.89/67.32


    # Apply categorical adjustments to base score
    base_score *= score_modifier

    # Transform to 0-100 range with sigmoid centered at 0.4
    score = 100 * (1 / (1 + np.exp(-8 * (base_score - 0.4))))
    
    # Add realistic variation
    variation = np.random.normal(0, 3)
    score += variation
    
    # Ensure score stays within bounds
    return min(max(score, 0), 100)


def generate_synthetic_data(n_samples=6600):
    synthetic_data = []
    
    # Categorical values with specified probabilities for certain features
    categorical_distributions = {
        'Internet_Access': {
            'values': ['Yes', 'No'],
            'probabilities': [0.9, 0.1]  # 90% Yes, 10% No
        },
        'School_Type': {
            'values': ['Public', 'Private'],
            'probabilities': [0.7, 0.3]    # 70% Public, 30% Private
        },
        'Learning_Disabilities': {
            'values': ['No', 'Yes'],
            'probabilities': [0.85, 0.15]  # 85% No, 15% Yes
        },
        'Parental_Education_Level': {
            'values': ['High School', 'College', 'Postgraduate'],
            'probabilities': [0.25, 0.45, 0.30]  # College highest, then Postgraduate, then High School
        },
        # Other categorical features with equal probabilities
        'Parental_Involvement': ['Low', 'Medium', 'High'],
        'Access_to_Resources': ['Low', 'Medium', 'High'],
        'Extracurricular_Activities': ['Yes', 'No'],
        'Motivation_Level': ['Low', 'Medium', 'High'],
        'Family_Income': ['Low', 'Medium', 'High'],
        'Teacher_Quality': ['Low', 'Medium', 'High'],
        'Peer_Influence': ['Negative', 'Neutral', 'Positive'],
        'Distance_from_Home': ['Near', 'Moderate', 'Far'],
        'Gender': ['Male', 'Female']
    }
    
    # Generate data focusing on extended ranges
    for _ in range(n_samples):
        # Generate numerical features
        features = {
            'hours_studied': np.random.choice([
                np.random.uniform(0, 20),     # Low range (20%)
                np.random.uniform(20, 44),    # Original range (60%)
                np.random.uniform(44, 80)     # Extended range (20%)
            ], p=[0.2, 0.6, 0.2]),
            'attendance': np.random.choice([
                np.random.uniform(0, 60),     # Very low (20%)
                np.random.uniform(60, 100)    # Original range (80%)
            ], p=[0.2, 0.8]),
            'previous_scores': np.random.choice([
                np.random.uniform(0, 50),     # Low range (20%)
                np.random.uniform(50, 100)    # Original range (80%)
            ], p=[0.2, 0.8]),
            'tutoring': np.random.choice([
                np.random.uniform(0, 8),      # Original range (70%)
                np.random.uniform(8, 30)      # Extended range (30%)
            ], p=[0.7, 0.3]),
            'physical_activity': np.random.choice([
                np.random.uniform(0, 6),      # Original range (70%)
                np.random.uniform(6, 40)      # Extended range (30%)
            ], p=[0.7, 0.3]),
            'sleep_hours': np.random.choice([
                np.random.uniform(0, 4),      # Very low (10%)
                np.random.uniform(4, 10),     # Original range (80%)
                np.random.uniform(10, 12)     # Extended range (10%)
            ], p=[0.1, 0.8, 0.1])
        }

        # Generate categorical features first
        categorical_features = {}
        for col, dist in categorical_distributions.items():
            if isinstance(dist, dict):  # If probabilities are specified
                categorical_features[col] = np.random.choice(dist['values'], p=dist['probabilities'])
            else:  # If equal probabilities (original behavior)
                categorical_features[col] = np.random.choice(dist)
        
        # Generate exam score using both numerical and categorical features
        exam_score = generate_exam_score(features, categorical_features)
        
        # Create a row with all features (starting with numerical)
        row = {
            'Hours_Studied': round(features['hours_studied']),
            'Attendance': round(features['attendance']),
            'Previous_Scores': round(features['previous_scores']),
            'Tutoring_Sessions': round(features['tutoring']),
            'Physical_Activity': round(features['physical_activity']),
            'Sleep_Hours': round(features['sleep_hours']),
            'Exam_Score': round(exam_score)
        }
        
        # Add categorical features to row
        row.update(categorical_features)
        
        synthetic_data.append(row)
    
    # Convert to DataFrame
    df = pd.DataFrame(synthetic_data)
    
    # Reorder columns to match original dataset
    column_order = [
        'Hours_Studied', 'Attendance', 'Parental_Involvement', 'Access_to_Resources',
        'Extracurricular_Activities', 'Sleep_Hours', 'Previous_Scores', 'Motivation_Level',
        'Internet_Access', 'Tutoring_Sessions', 'Family_Income', 'Teacher_Quality',
        'School_Type', 'Peer_Influence', 'Physical_Activity', 'Learning_Disabilities',
        'Parental_Education_Level', 'Distance_from_Home', 'Gender', 'Exam_Score'
    ]
    
    return df[column_order]


# Generate synthetic data
synthetic_df = generate_synthetic_data()

# Display first few rows and basic statistics
print("\nFirst few rows of synthetic data:")
print(synthetic_df.head())

print("\nNumerical features statistics:")
numerical_cols = ['Hours_Studied', 'Attendance', 'Previous_Scores', 
                 'Tutoring_Sessions', 'Physical_Activity', 'Sleep_Hours', 'Exam_Score']
print(synthetic_df[numerical_cols].describe())

# Display categorical distributions
print("\nCategorical feature distributions:")
categorical_cols = ['Internet_Access', 'School_Type', 'Learning_Disabilities', 'Parental_Education_Level']
for col in categorical_cols:
    print(synthetic_df[col].value_counts())

# Save to CSV
synthetic_df.to_csv('synthetic_data.csv', index=False)
print("\nSynthetic data saved to 'synthetic_data.csv'")