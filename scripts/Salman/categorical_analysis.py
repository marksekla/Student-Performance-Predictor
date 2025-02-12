'''
This file analyzes categorical features' influence on exam scores in two steps:

1. Impact Analysis:
  - Calculates mean scores and statistics for each category
  - Identifies significant features (>1 point difference between categories)
  - Example: Parental_Involvement with ±1.73 point impact is significant
  - Features with <1 point impact are excluded from score generation

2. Baseline Analysis:
  - For significant features, determines appropriate baseline category
  - Uses criteria: highest frequency and/or closest to overall mean
  - Example: For Parental_Involvement, Medium is baseline (most common and closest to mean)
  - Baselines are used to calculate score modifiers in synthetic data generation

The results from both analyses help generate synthetic data that maintains realistic 
relationships between features and exam scores from the original dataset.
'''

import pandas as pd
import numpy as np
import os

project_root = os.path.join(os.path.dirname(__file__), '..', '..')
df = pd.read_csv(os.path.join(project_root, 'datasets', 'Salman', 'Salman.csv'))

# List of categorical features
categorical_features = [
    'Parental_Involvement', 'Access_to_Resources', 'Extracurricular_Activities',
    'Motivation_Level', 'Internet_Access', 'Family_Income', 'Teacher_Quality',
    'School_Type', 'Peer_Influence', 'Learning_Disabilities',
    'Parental_Education_Level', 'Distance_from_Home', 'Gender'
]

# Analyze mean and standard deviation of exam scores for each category
print("Categorical Feature Analysis:\n")
for feature in categorical_features:
    print(f"\n{'-'*50}")
    print(f"{feature}:")
    print(f"{'-'*50}")
    
    # Calculate statistics
    stats = df.groupby(feature)['Exam_Score'].agg(['mean', 'std', 'count']).round(2)
    stats['percentage'] = (stats['count'] / len(df) * 100).round(2)
    
    # Rename columns for clarity
    stats.columns = ['Mean Score', 'Std Dev', 'Count', '% of Total']
    print(stats)

print("\nAnalysis complete! Check each feature's impact on exam scores.\n")



### RESULTS ###
'''
- Binary Features: -

Extracurricular_Activities
Yes: 67.44
No: 66.93
Difference: 0.51 points

Internet_Access
Yes: 67.29
No: 66.54
Difference: 0.75 points

School_Type
Private: 67.29
Public: 67.21
Difference: 0.08 points

Learning_Disabilities
No: 67.35
Yes: 66.27
Difference: 1.08 points

Gender
Female: 67.24
Male: 67.23
Difference: 0.01 points



- Multi-category Features: -

Parental_Involvement
High: 68.09
Medium: 67.10
Low: 66.36
Max Difference: 1.73 points

Access_to_Resources
High: 68.09
Medium: 67.13
Low: 66.20
Max Difference: 1.89 points

Motivation_Level
High: 67.70
Medium: 67.33
Low: 66.75
Max Difference: 0.95 points

Family_Income
High: 67.84
Medium: 67.33
Low: 66.85
Max Difference: 0.99 points

Teacher_Quality
High: 67.68
Medium: 67.11
Low: 66.75
Max Difference: 0.93 points

Peer_Influence
Positive: 67.62
Neutral: 67.20
Negative: 66.56
Max Difference: 1.06 points

Distance_from_Home
Near: 67.51
Moderate: 66.98
Far: 66.46
Max Difference: 1.05 points

Parental_Education_Level
Postgraduate: 67.97
College: 67.32
High School: 66.89
Max Difference: 1.08 points
'''



### ANALYSIS ###
'''
We should only include categorical features that show meaningful differences in exam scores from the analysis we did.
Looking at the results, the following features have minimal impact on exam scores (difference less than 1 point), so we should EXclude them from score generation:


Motivation_Level: 0.95 points

Family_Income: 0.99 points

Teacher_Quality: 0.93 points

Extracurricular_Activities: 0.51 points

Internet_Access: 0.75 points

School_Type: 0.08 points

Gender: 0.01 points


So, we should include features that have differences greater than 1 point in exam scores because they show more significant impact.
Including features with very small effects (like Gender with 0.01 point difference) wouldn't meaningfully affect the generated scores.
'''



# Analyze baseline for each categorical feature
def analyze_baseline(df, feature):
    # Get overall mean score
    overall_mean = df['Exam_Score'].mean()
    
    # For each category
    analysis = df.groupby(feature).agg({
        'Exam_Score': ['mean', 'count']  # Get mean score and count
    }).round(2)
    
    # Calculate percentage and difference from overall mean
    analysis['percentage'] = (analysis[('Exam_Score', 'count')] / len(df) * 100).round(2)
    analysis['diff_from_mean'] = abs(analysis[('Exam_Score', 'mean')] - overall_mean).round(2)
    
    print(f"\n{feature}:")
    print(analysis)
    print("\nRecommended baseline: ", end="")
    
    # Get category with highest count
    most_common = analysis[('Exam_Score', 'count')].idxmax()
    # Get category closest to mean
    closest_to_mean = analysis['diff_from_mean'].idxmin()
    
    if most_common == closest_to_mean:
        print(f"{most_common} (both most common and closest to mean)")
    else:
        print(f"{most_common} (most common) or {closest_to_mean} (closest to mean)")


print(f"Overall exam_score mean: {df['Exam_Score'].mean():.2f}\n")

strong_cat_features = [f for f in categorical_features if f not in 
                           ['Motivation_Level', 'Family_Income', 'Teacher_Quality', 'Extracurricular_Activities', 
                            'Internet_Access', 'School_Type', 'Gender']
                    ]
for feature in strong_cat_features:
    analyze_baseline(df, feature)



### BASELINE RESULTS ###
'''
Overall exam_score mean: 67.24


Parental_Involvement:
                     Exam_Score       percentage diff_from_mean
                           mean count
Parental_Involvement
High                      68.09  1908      28.88           0.85
Low                       66.36  1337      20.24           0.88
Medium                    67.10  3362      50.89           0.14
Recommended baseline: Medium (both most common and closest to mean)


Access_to_Resources:
                    Exam_Score       percentage diff_from_mean
                          mean count
Access_to_Resources
High                     68.09  1975      29.89           0.85
Low                      66.20  1313      19.87           1.04
Medium                   67.13  3319      50.23           0.11
Recommended baseline: Medium (both most common and closest to mean)


Peer_Influence:
               Exam_Score       percentage diff_from_mean
                     mean count
Peer_Influence
Negative            66.56  1377      20.84           0.68
Neutral             67.20  2592      39.23           0.04
Positive            67.62  2638      39.93           0.38
Recommended baseline: Positive (most common) or Neutral (closest to mean)


Learning_Disabilities:
                      Exam_Score       percentage diff_from_mean
                            mean count
Learning_Disabilities
No                         67.35  5912      89.48           0.11
Yes                        66.27   695      10.52           0.97
Recommended baseline: No (both most common and closest to mean)


Parental_Education_Level:
                         Exam_Score       percentage diff_from_mean
                               mean count
Parental_Education_Level
College                       67.32  1989      30.10           0.08
High School                   66.89  3223      48.78           0.35
Postgraduate                  67.97  1305      19.75           0.73
Recommended baseline: High School (most common) or College (closest to mean)


Distance_from_Home:
                   Exam_Score       percentage diff_from_mean
                         mean count
Distance_from_Home
Far                     66.46   658       9.96           0.78
Moderate                66.98  1998      30.24           0.26
Near                    67.51  3884      58.79           0.27
Recommended baseline: Near (most common) or Moderate (closest to mean)
'''