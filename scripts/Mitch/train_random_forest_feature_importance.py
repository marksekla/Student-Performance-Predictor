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
    "file_path": "C:\\Users\\Mitch\\Documents\\GitHub\\Predicting-Student-Performance-COMP-4990\\data\\combined_shuffled_student_performance.csv",
    "test_size": 0.3,
    "random_state": 42,
    "model_params": {
        "n_estimators": 100,
        "max_depth": 20,
        "random_state": 42,
    },
    "output_model_file": "random_forest_pipeline.pkl"
}

# Define the columns used for preprocessing
numeric_cols = ['StudyTimeWeekly', 'GPA']
pass_through_cols = ['Age', 'Gender', 'Ethnicity', 'ParentalEducation', 'Absences', 'Tutoring', 'ParentalSupport', 'TotalEngagement']

preprocessor = ColumnTransformer([
    ("scaler", StandardScaler(), numeric_cols),
    ("passthrough", "passthrough", pass_through_cols),
], remainder="drop")

# Feature engineering function (if not already applied in the imported module)
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

# Define pipeline with feature engineering, preprocessing, and classifier
pipeline = Pipeline(steps=[
    ("feature_engineering", FunctionTransformer(feature_engineering)),
    ("preprocessor", preprocessor),
    ("classifier", RandomForestClassifier(**CONFIG["model_params"])),
])

# Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=CONFIG["test_size"], random_state=CONFIG["random_state"])

# Train the pipeline
pipeline.fit(X_train, y_train)

# Extract feature importances from the trained classifier
classifier = pipeline.named_steps['classifier']
importances = classifier.feature_importances_

# Determine the feature names used by the classifier
# Note: After feature engineering and preprocessing, the final features are in the order of numeric_cols followed by pass_through_cols.
feature_names = numeric_cols + pass_through_cols

# Combine feature names and their corresponding importance values into a list of dictionaries
feature_importance_data = [
    {'name': name, 'importance': importance}
    for name, importance in zip(feature_names, importances)
    if name != 'TotalEngagement'
]

# Attach the feature importance data to the pipeline (or alternatively save it separately)
pipeline.feature_importance_data = feature_importance_data

# Serialize the pipeline (including the feature importance data) to a file
with open(CONFIG["output_model_file"], "wb") as file:
    pickle.dump(pipeline, file)

print(f"Pipeline has been serialized and saved as '{CONFIG['output_model_file']}'")
print("Feature Importances:")
for feature in feature_importance_data:
    print(f"{feature['name']}: {feature['importance']:.4f}")
