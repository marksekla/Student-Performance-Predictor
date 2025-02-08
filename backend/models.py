import os
import pickle
import sys

# MOVED TO app.py (changed name to scripts_path)
# backend_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'scripts'))
# sys.path.append(backend_path)


from feature_engineering_random_forest import feature_engineering


# Dynamically construct the path to the .pkl file
# This creates an absolute path because __file__ is absolute
file_path_lr = os.path.join(os.path.dirname(__file__), "models", "linear_regression_pipeline.pkl")

# Dynamically construct the path to the .pkl file
# This creates an absolute path because __file__ is absolute
file_path_rf = os.path.join(os.path.dirname(__file__), "models", "random_forest_pipeline.pkl")

# Load the trained pipeline for Linear Regression
with open(file_path_lr, 'rb') as f:
    linear_regression_pipeline = pickle.load(f)

# Load the trained pipeline for Random Forest
with open(file_path_rf, 'rb') as f:
    random_forest_pipeline = pickle.load(f)
