Let's compare the categorical and numerical analyses approaches:

Categorical Features Analysis:
1. Simply grouped by categories and calculated mean scores
2. Direct comparison between categories (e.g., Yes vs No, High vs Low)
3. Natural groupings already exist

Example (Learning_Disabilities):
```
No:  67.35
Yes: 66.27
Difference: 1.08 points
```

Numerical Features Analysis:
1. Created artificial groups using quartiles (25th, 75th percentiles)
2. Split continuous data into Low/Mid/High groups
3. Had to create groupings to make comparison possible

Example (Hours_Studied):
```
Low (≤16.0):  65.15
Mid:          67.24
High (≥24.0): 69.37
Difference: 4.22 points
```

They differ because:
1. Categorical features have predefined groups (like Yes/No)
2. Numerical features are continuous (any value between min and max)
3. To compare their impacts similarly, we had to convert numerical features into groups

We did it this way because:
1. Needed a common way to measure impact (point differences)
2. Quartile approach for numerical features gives balanced groups (25% low, 50% mid, 25% high)
3. Makes numerical and categorical impacts somewhat comparable, though they're fundamentally different types of data



#######################################################################################################################################



Q: In categorical features, we use explicit baselines to calculate modifiers, but for numerical features, we just get weights like this: 'attendance': 0.447  # 5.81/13.00 = 44.7%
Why don't we need a baseline for numerical features?

A: The difference lies in how numerical and categorical features are processed:

Categorical Features:
- Have distinct categories (like "High", "Medium", "Low")
- Need a reference point (baseline) to calculate relative changes
- Example: If Medium is baseline, how much should we adjust for High or Low?
- Hence we use multipliers: score × 1.0148 for High, × 0.9889 for Low

Numerical Features:
- Are continuous values that get normalized to 0-1 range
- Normalization itself creates an implicit baseline
- When we do `normalize(features['attendance'], 0, 100)`:
  - 0% attendance becomes 0.0
  - 100% attendance becomes 1.0
  - 50% attendance becomes 0.5
- Then weights just determine how much this normalized value contributes to final score

So numerical features don't need explicit baselines because:
1. Normalization standardizes all values to same scale (0-1)
2. Weights determine relative importance of these normalized values
3. The relationship is linear (more attendance = proportionally higher score)



#######################################################################################################################################



Flow of execution:

1. Feature Impact Analysis:
   - numerical_analysis.py         # Analyze impact of numerical features using quartile groups
   - categorical_analysis.py       # Analyze impact of categorical features and determine baselines

2. Synthetic_Data_Generator.py     # Generate synthetic data using analyzed impacts and baselines
                                   # Uses weights for numerical features and modifiers for categorical features

3. main.ipynb                      # Combine datasets, train model, and create pipeline for deployment