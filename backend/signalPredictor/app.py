from flask import Flask, request, jsonify
import math
from datetime import datetime

app = Flask(__name__)

# Mock satellite location above Africa
SATELLITE_NAME = "Starlink-3428"
LAT_SAT = 10.0
LON_SAT = -14.0
ALTITUDE_KM = 550

def calculate_elevation(lat_user, lon_user):
    # Convert lat/lon to radians
    lat1 = math.radians(lat_user)
    lon1 = math.radians(lon_user)
    lat2 = math.radians(LAT_SAT)
    lon2 = math.radians(LON_SAT)

    # Haversine formula
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = math.sin(dlat / 2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    earth_radius_km = 6371
    ground_distance_km = earth_radius_km * c

    # Elevation angle
    elevation_rad = math.atan2(ALTITUDE_KM, ground_distance_km)
    elevation_deg = math.degrees(elevation_rad)
    return round(elevation_deg, 2)

def calculate_azimuth(lat_user, lon_user):
    # Convert to radians
    lat1 = math.radians(lat_user)
    lon1 = math.radians(lon_user)
    lat2 = math.radians(LAT_SAT)
    lon2 = math.radians(LON_SAT)

    dlon = lon2 - lon1
    x = math.sin(dlon) * math.cos(lat2)
    y = math.cos(lat1) * math.sin(lat2) - math.sin(lat1) * math.cos(lat2) * math.cos(dlon)
    azimuth_rad = math.atan2(x, y)
    azimuth_deg = (math.degrees(azimuth_rad) + 360) % 360
    return round(azimuth_deg, 2)

def evaluate_signal_strength(elevation):
    if elevation > 60:
        return "strong"
    elif elevation > 30:
        return "moderate"
    else:
        return "weak"

@app.route('/api/telemetry')
def telemetry():
    lat = request.args.get('lat', type=float)
    lon = request.args.get('lon', type=float)
    if lat is None or lon is None:
        return jsonify({'error': 'Missing lat/lon parameters'}), 400

    azimuth = calculate_azimuth(lat, lon)
    elevation = calculate_elevation(lat, lon)
    signal = evaluate_signal_strength(elevation)

    return jsonify({
        'satellite': SATELLITE_NAME,
        'azimuth': azimuth,
        'elevation': elevation,
        'signal_strength': signal,
        'timestamp': datetime.utcnow().isoformat() + "Z",
        'lat': lat,
        'lon': lon
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
