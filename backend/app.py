from flask import Flask, request, jsonify
from flask_cors import CORS

#from routes.predict_linear_regression import predict_linear_regression_bp
from routes.predict_random_forest import predict_random_forest_bp
from routes.health import health_bp

app = Flask(__name__)
CORS(app)

# Register blueprints
app.register_blueprint(predict_linear_regression_bp)
app.register_blueprint(predict_random_forest_bp)
app.register_blueprint(health_bp)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
