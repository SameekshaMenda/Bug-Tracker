# predict_type.py
from flask import Flask, request, jsonify
import joblib

app = Flask(__name__)
model = joblib.load('bug_type_model.joblib')

@app.route('/predict-type', methods=['POST'])
def predict():
    data = request.get_json()
    description = data.get("description", "")
    prediction = model.predict([description])[0]
    return jsonify({"type": prediction})

if __name__ == '__main__':
    app.run(port=5001)
