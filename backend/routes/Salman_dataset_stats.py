from flask import Blueprint, jsonify
from backend.config import root_dir
import pandas as pd

Salman_dataset_stats_bp = Blueprint('Salman_dataset_stats', __name__)

@Salman_dataset_stats_bp.route('/Salman_dataset_stats', methods=['GET'])
def dataset_stats():
    df = pd.read_csv(f'{root_dir}/datasets/Salman/combined_dataset.csv')

    # Get actual distribution of exam scores
    score_counts = df['Exam_Score'].value_counts().sort_index()
    score_percentages = (score_counts / len(df) * 100).to_dict()
    
    stats = {
        # Numerical averages
        'hours_studied_avg': df['Hours_Studied'].mean(),
        'previous_scores_avg': df['Previous_Scores'].mean(),
        'physical_activity_avg': df['Physical_Activity'].mean(),
        'attendance_avg': df['Attendance'].mean(),
        'tutoring_sessions_avg': df['Tutoring_Sessions'].mean(),
        
        # Categorical distributions
        'extra_curricular_dist': df['Extracurricular_Activities'].value_counts(normalize=True).multiply(100).to_dict(),
        'internet_access_dist': df['Internet_Access'].value_counts(normalize=True).multiply(100).to_dict(),
        'learning_disabilities_dist': df['Learning_Disabilities'].value_counts(normalize=True).multiply(100).to_dict(),
        'gender_dist': df['Gender'].value_counts(normalize=True).multiply(100).to_dict(),
        'distance_from_home_dist': df['Distance_from_Home'].value_counts(normalize=True).multiply(100).to_dict(),
        'parental_involvement_dist': df['Parental_Involvement'].value_counts(normalize=True).multiply(100).to_dict(),
        'access_to_resources_dist': df['Access_to_Resources'].value_counts(normalize=True).multiply(100).to_dict(),
        'motivation_level_dist': df['Motivation_Level'].value_counts(normalize=True).multiply(100).to_dict(),
        'family_income_dist': df['Family_Income'].value_counts(normalize=True).multiply(100).to_dict(),
        'teacher_quality_dist': df['Teacher_Quality'].value_counts(normalize=True).multiply(100).to_dict(),
        'peer_influence_dist': df['Peer_Influence'].value_counts(normalize=True).multiply(100).to_dict(),
        'parental_edu_level_dist': df['Parental_Education_Level'].value_counts(normalize=True).multiply(100).to_dict(),

        # Exam score average and distribution
        'exam_score_avg': df['Exam_Score'].mean(),
        'exam_score_dist': score_percentages,
        'exam_score_percentiles': {
            '25': df['Exam_Score'].quantile(0.25),
            '50': df['Exam_Score'].quantile(0.50),
            '75': df['Exam_Score'].quantile(0.75),
            '90': df['Exam_Score'].quantile(0.90)
        }
    }

    
    ###########################    For BestPerformersChart.jsx     #################################

    # For categorical variables, you might need to assign numerical scores
    # Example: High=3, Medium=2, Low=1 for ordered categories
    categorical_mapping = {
        'Extracurricular_Activities': {'Yes': 2, 'No': 1},
        'Internet_Access': {'Yes': 2, 'No': 1},
        'Learning_Disabilities': {'Yes': 2, 'No': 1},
        'Gender': {'Male': 2, 'Female': 1},
        'Parental_Involvement': {'High': 3, 'Medium': 2, 'Low': 1},
        'Access_to_Resources': {'High': 3, 'Medium': 2, 'Low': 1},
        'Motivation_Level': {'High': 3, 'Medium': 2, 'Low': 1},
        'Family_Income': {'High': 3, 'Medium': 2, 'Low': 1},
        'Teacher_Quality': {'High': 3, 'Medium': 2, 'Low': 1},
        'Peer_Influence': {'Positive': 3, 'Neutral': 2, 'Negative': 1},
        'Parental_Education_Level': {'Postgraduate': 3, 'College': 2, 'High School': 1},
    }

    # First, create all the score columns
    for category, mapping in categorical_mapping.items():
        df[f'{category}_cat'] = df[category].map(mapping)

    # THEN filter to get top students (e.g., top 10%)
    top_percentile = 90
    top_students = df[df['Exam_Score'] >= df['Exam_Score'].quantile(top_percentile/100)]

    # Calculate top student numerical averages
    stats['top_students_avg'] = {
        'hours_studied': float(top_students['Hours_Studied'].mean()),
        'attendance': float(top_students['Attendance'].mean()),
        'previous_scores': float(top_students['Previous_Scores'].mean()),
        'tutoring_sessions': float(top_students['Tutoring_Sessions'].mean()),
        'physical_activity': float(top_students['Physical_Activity'].mean())
    }

    # Calculate top student categorical averages
    stats['top_students_categorical'] = {}
    stats['avg_categorical'] = {}

    for category, mapping in categorical_mapping.items():
        mapped_cat_column = f'{category}_cat'
        
        # Calculate averages
        stats['top_students_categorical'][f'{category.lower()}'] = float(top_students[mapped_cat_column].mean())
        stats['avg_categorical'][f'{category.lower()}'] = float(df[mapped_cat_column].mean())

    
    return jsonify(stats)