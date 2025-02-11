'''
This file analyzes how categorical features influence exam scores in the original dataset.
The analysis shows the mean exam scores, as well as some other statistics, for each category.
The comment at the bottom shows the resulting score differences.
Features with differences greater than 1 point were considered significant and used in the
synthetic data generator to maintain realistic relationships between features and exam scores.
'''

import pandas as pd
import numpy as np
import os

project_root = os.path.join(os.path.dirname(__file__), '..', '..')
df = pd.read_csv(os.path.join(project_root, 'datasets', 'Salman.csv'))

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

print("\nAnalysis complete! Check each feature's impact on exam scores.")



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



### WHICH FEATURES *NOT* TO INCLUDE IN SYNTHETIC DATA GENERATION ###
'''
We should only include categorical features that show meaningful differences in exam scores from the analysis we did.
Looking at the results, the following features have minimal impact on exam scores (difference less than 1 point), so we should EXclude them:


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