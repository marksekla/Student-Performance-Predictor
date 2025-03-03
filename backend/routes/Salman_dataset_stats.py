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
    
    return jsonify(stats)