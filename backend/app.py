from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import sys

# NOTE: Each Python process (i.e. file you can run) has its own separate sys.path list ; so scripts/main.ipynb and backend/app.py have different sys.path lists
# When you run app.py, it starts a single Python process. Any modules that app.py imports, and any modules those modules import (and so on), all share the same sys.path because they're all running within that one Python process.
# The sharing of sys.path extends through the entire import chain
# NOTE: This creates an absolute path because __file__ is absolute
# NOTE: I need to put root_dir in sys.path to help imports that start with 'backend/' (e.g. inside predict_linear_regression.py)
root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.append(root_dir)

scripts_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'scripts'))
sys.path.append(scripts_path)

from feature_engineering_random_forest import feature_engineering

# "Python can find and import from the 'routes' directory because it's a subdirectory of where app.py is located.
# When Python sees `from routes import <whatever>`, it first looks in the same directory as the importing file (app.py), which is the backend/ directory.
# Finding routes/ there, it doesn't need to search through sys.path."
from routes.predict_linear_regression import predict_linear_regression_bp
from routes.predict_random_forest import predict_random_forest_bp
from routes.health import health_bp


app = Flask(__name__)
CORS(app)

# Register blueprints
app.register_blueprint(health_bp)
app.register_blueprint(predict_linear_regression_bp)
app.register_blueprint(predict_random_forest_bp)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
