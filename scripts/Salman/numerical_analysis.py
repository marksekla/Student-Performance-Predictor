'''
This file analyzes how numerical features influence exam scores by grouping them into quartiles:
- Low group: bottom 25% of values
- Mid group: middle 50% of values
- High group: top 25% of values

For each group, it calculates the mean exam score to understand how different ranges
of numerical values affect performance. The max difference between high and low groups
shows the feature's impact, which is used to calculate feature weights in the
synthetic data generator.

Features with larger point differences get higher weights. For example:
- Attendance (5.81 points) -> 44.7% weight
- Hours_Studied (4.22 points) -> 32.5% weight
'''

import pandas as pd
import numpy as np
import os

project_root = os.path.join(os.path.dirname(__file__), '..', '..')
df = pd.read_csv(os.path.join(project_root, 'datasets', 'Salman.csv'))

# Function to analyze score differences for numerical features
def analyze_numerical_impact(df, feature):
    # Create bins (e.g., low 25%, medium 50%, high 25%)
    low_threshold = df[feature].quantile(0.25)
    high_threshold = df[feature].quantile(0.75)
    
    # Get mean scores for each group
    low_scores = df[df[feature] <= low_threshold]['Exam_Score'].mean()
    mid_scores = df[(df[feature] > low_threshold) & 
                   (df[feature] < high_threshold)]['Exam_Score'].mean()
    high_scores = df[df[feature] >= high_threshold]['Exam_Score'].mean()
    
    # Calculate max difference
    max_diff = high_scores - low_scores
    
    print(f"\n{feature}:")
    print(f"Low group (≤{low_threshold:.1f}): {low_scores:.2f}")
    print(f"Mid group: {mid_scores:.2f}")
    print(f"High group (≥{high_threshold:.1f}): {high_scores:.2f}")
    print(f"Max difference: {max_diff:.2f} points")


# Analyze each numerical feature
numerical_features = ['Hours_Studied', 'Attendance', 'Previous_Scores', 
                     'Tutoring_Sessions', 'Physical_Activity', 'Sleep_Hours']

for feature in numerical_features:
    analyze_numerical_impact(df, feature)



### RESULTS ###
'''
Hours_Studied:
Low group (≤16.0): 65.15
Mid group: 67.24
High group (≥24.0): 69.37
Max difference: 4.22 points


Attendance:
Low group (≤70.0): 64.33
Mid group: 67.22
High group (≥90.0): 70.14
Max difference: 5.81 points


Previous_Scores:
Low group (≤63.0): 66.43
Mid group: 67.15
High group (≥88.0): 68.23
Max difference: 1.80 points


Tutoring_Sessions:
Low group (≤1.0): 66.78
Mid group: nan
High group (≥2.0): 67.81
Max difference: 1.03 points


Physical_Activity:
Low group (≤2.0): 67.15
Mid group: 67.20
High group (≥4.0): 67.38
Max difference: 0.23 points


Sleep_Hours:
Low group (≤6.0): 67.28
Mid group: 67.24
High group (≥8.0): 67.19
Max difference: -0.09 points
'''



### ANALYSIS ###
'''
Strong Impact (>4 points):
Attendance: 5.81 points (highest impact)
Hours_Studied: 4.22 points (second highest)

Moderate Impact (1-2 points):
Previous_Scores: 1.80 points
Tutoring_Sessions: 1.03 points

Minimal/No Impact (<1 point):
Physical_Activity: 0.23 points
Sleep_Hours: -0.09 points (slightly negative but negligible)


Comparing to the strongest categorical features:
Access_to_Resources: ±1.89 points
Parental_Involvement: ±1.73 points


This suggests that only Attendance and Hours_Studied have significantly stronger impacts than the categorical features.
The other numerical features have similar or even weaker impacts than some categorical features.
'''