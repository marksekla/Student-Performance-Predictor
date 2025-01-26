# Predicting-Student-Performance-COMP-4990


This project is a web application that predicts student performance using a machine learning model. The application is built with Flask for the backend and React for the frontend.

---

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Recreating the Python Virtual Environment](#recreating-the-python-virtual-environment)
- [Usage](#usage)
- [License](#license)

---

## Features

- Predict student performance based on various engagement metrics.
- Interactive frontend for submitting data and viewing results.
- Lightweight backend API for making predictions.

---

## Technologies Used

- **Frontend**: React, CSS, D3.js
- **Backend**: Flask, Python
- **Machine Learning**: scikit-learn, Random Forest, Linear Regression
- **Other Tools**: Pickle

---

## Project Structure

```plaintext
.
├── frontend/           # React frontend
│   ├── components/     # Reusable React components
│   ├── assets/         # Static files (e.g., images)
│   ├── styles/         # CSS/SCSS files
├── backend/            # Flask backend
│   ├── models/         # Serialized ML models
│   ├── routes/         # Flask route files
│   ├── static/         # Static assets
│   ├── templates/      # HTML templates
├── data/               # Datasets and sample data
├── scripts/            # ML training and utility scripts
├── tests/              # Unit tests for backend/frontend
├── docs/               # Documentation
├── requirements.txt    # Python dependencies
├── .gitignore          # Ignored files and folders
└── README.md           # Project overview

```

## Recreating the Python Virtual Environment

To set up the Python virtual environment for the backend, follow these steps:

1. Ensure Python 3.8 or higher is installed by checking your version with `python --version`. Verify that `pip` is installed by running `pip --version`.

2. Create a virtual environment by running `python -m venv venv`.

3. Activate the virtual environment:
   - On Linux/Mac: `source venv/bin/activate`
   - On Windows: `.\venv\Scripts\activate`

4. Install project dependencies with `pip install -r requirements.txt`.

5. Run the backend application using `python backend/app.py`.

6. When you're done, deactivate the virtual environment by running `deactivate`.
