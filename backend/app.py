from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/api/satellite-azimuth')
def satellite_azimuth():
    lat = float(request.args.get('lat'))
    lon = float(request.args.get('lon'))

    # Dummy azimuth calculation for now
    azimuth = (lat + lon) % 360
    return jsonify({ 'azimuth': round(azimuth, 2) })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
