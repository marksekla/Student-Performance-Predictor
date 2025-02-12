import pandas as pd
# import os
import pickle


# import sys
# backend_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'scripts'))
 #sys.path.append(backend_path)

from feature_engineering_random_forest import feature_engineering

# Print confirmation for feature engineering function
print("Feature engineering function loaded:", feature_engineering)

# Dynamically construct the path to the .pkl file
file_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend\\models\\random_forest_pipeline.pkl'))

# Load the trained pipeline for Random Forest
with open(file_path, 'rb') as f:
    random_forest_pipeline = pickle.load(f)

# Print confirmation that the model has been loaded
print("Random forest pipeline loaded successfully.")

# Test data (ensure it matches the format of your training data)
test_data = pd.DataFrame([{
    "Age" : 17,
    "Gender" : 0,
    "Ethnicity" : 0,
    "ParentalEducation" : 2,
    "StudyTimeWeekly" : 16.3885570734073,
    "Absences" : 3,
    "Tutoring" : 1,
    "ParentalSupport" : 4,
    "Extracurricular" : 0,
    "Sports" : 0,
    "Music" : 0,
    "Volunteering" : 0,
    "GPA" : 3.3473567435078

}])

# Apply feature engineering to the test data
test_data = feature_engineering(test_data)

# Make a prediction
try:
    prediction = random_forest_pipeline.predict(test_data)
    print("Prediction result:", prediction[0])
except Exception as e:
    print("Error during prediction:", e)
