from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import os
import json
import requests
from datetime import datetime

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'static/uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

DATA_FILE = 'data/farmers.json'
os.makedirs('data', exist_ok=True)

if not os.path.exists(DATA_FILE):
    with open(DATA_FILE, 'w') as f:
        json.dump([], f)

ESP32_IP = "http://192.168.1.101"


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')


@app.route('/upload')
def upload_page():
    return render_template('upload.html')


@app.route('/submit_farmer', methods=['POST'])
def submit_farmer():

    name = request.form.get('name')
    district = request.form.get('district')
    crop = request.form.get('crop')
    moisture = request.form.get('moisture')
    npk = request.form.get('npk')
    latitude = request.form.get('latitude')
    longitude = request.form.get('longitude')

    image = request.files.get('image')

    filename = ''

    if image:
        filename = image.filename
        image.save(os.path.join(UPLOAD_FOLDER, filename))

    farmer = {
        'name': name,
        'district': district,
        'crop': crop,
        'moisture': moisture,
        'npk': npk,
        'latitude': latitude,
        'longitude': longitude,
        'image': filename,
        'time': str(datetime.now())
    }

    with open(DATA_FILE, 'r') as f:
        data = json.load(f)

    data.append(farmer)

    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=4)

    return jsonify({'status': 'success'})


@app.route('/get_farmers')
def get_farmers():

    with open(DATA_FILE, 'r') as f:
        data = json.load(f)

    return jsonify(data)


@app.route('/sensor_data')
def sensor_data():

    try:
        response = requests.get(f"{ESP32_IP}/data", timeout=2)
        return response.json()

    except:

        return jsonify({
            'temperature': 29,
            'humidity': 71,
            'soil_moisture': 63,
            'npk': 48,
            'ph': 6.5,
            'water_level': 82,
            'status': 'ESP32 OFFLINE - USING DEMO DATA'
        })


@app.route('/telemetry')
def telemetry():

    return jsonify({
        'gps': '18.5204, 73.8567',
        'altitude': '82m',
        'speed': '14m/s',
        'battery': '78%',
        'satellites': '13',
        'drone_status': 'ACTIVE'
    })


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)