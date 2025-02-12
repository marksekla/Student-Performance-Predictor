import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import FunctionTransformer
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler
import pickle

import sys
import os

# Add scripts folder to the path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'scripts')))

from feature_engineering_random_forest import feature_engineering 

# Configurable parameters
CONFIG = {
    "file_path": "C:\\Users\\Mitch\\Documents\\GitHub\\Predicting-Student-Performance-COMP-4990\\data\\Student_performance.csv",
    "test_size": 0.3,
    "random_state": 42,
    "model_params": {
        "n_estimators": 100,
        "max_depth": 20,
        "random_state": 42,
    },
    "output_model_file": "random_forest_pipeline.pkl"
}

numeric_cols = ['StudyTimeWeekly', 'GPA']
pass_through_cols = ['Age', 'Gender', 'Ethnicity', 'ParentalEducation', 'Absences', 'Tutoring', 'ParentalSupport', 'TotalEngagement']

preprocessor = ColumnTransformer([
    ("scaler", StandardScaler(), numeric_cols),
    ("passthrough", "passthrough", pass_through_cols),
], remainder="drop")

# Feature engineering function
def feature_engineering(data):
    if all(col in data.columns for col in ['Extracurricular', 'Sports', 'Music', 'Volunteering']):
        data = data.copy()
        data['TotalEngagement'] = data[['Extracurricular', 'Sports', 'Music', 'Volunteering']].sum(axis=1)
        data = data.drop(columns=['Extracurricular', 'Sports', 'Music', 'Volunteering'])
    return data

# Load the dataset
data = pd.read_csv(CONFIG["file_path"])

# Drop unnecessary columns
data = data.drop(columns=["StudentID"])

# Separate features and target
X = data.drop(columns=["GradeClass"])
y = data["GradeClass"]

# Define pipeline
pipeline = Pipeline(steps=[
    ("feature_engineering", FunctionTransformer(feature_engineering)),
    ("preprocessor", preprocessor),
    ("classifier", RandomForestClassifier(**CONFIG["model_params"])),
])

# Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=CONFIG["test_size"], random_state=CONFIG["random_state"])

# Train the pipeline
pipeline.fit(X_train, y_train)

# Serialize the pipeline
with open(CONFIG["output_model_file"], "wb") as file:
    pickle.dump(pipeline, file)

print(f"Pipeline has been serialized and saved as '{CONFIG['output_model_file']}'")
