from flask import Flask
from flask_cors import CORS
from config import root_dir

from feature_engineering_random_forest import feature_engineering

from routes.predict_linear_regression import predict_linear_regression_bp
from routes.Salman_dataset_stats import Salman_dataset_stats_bp

from routes.predict_random_forest import predict_random_forest_bp
from routes.health import health_bp


app = Flask(__name__)
CORS(app)


# Register blueprints
app.register_blueprint(health_bp)

app.register_blueprint(predict_linear_regression_bp)
app.register_blueprint(Salman_dataset_stats_bp)

app.register_blueprint(predict_random_forest_bp)


if __name__ == '__main__':
    app.run(debug=True, port=5000)
