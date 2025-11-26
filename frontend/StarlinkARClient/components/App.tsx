import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Button, Dimensions, Text } from 'react-native';
import CalibrationSummary from './components/CalibrationSummary';
import SignalMeter from './component./components/widgets/SignalMeter';
import CompassOverlay from './components/CompassOverlay';
import CameraOverlay from './components/CameraOverlay';
import * as Location from 'expo-location';
import * as Haptics from 'expo-haptics';

const screen = Dimensions.get('window');

export default function App() {
  const [telemetryData, setTelemetryData] = useState({
    satellite: '',
    azimuth: 0,
    elevation: 0,
    signal_strength: '',
    timestamp: '',
  });

  const [heading, setHeading] = useState(0); // simulate CompassOverlay feed-in
  const [userLat, setUserLat] = useState(null);
  const [userLon, setUserLon] = useState(null);
  const [showSummary, setShowSummary] = useState(true);
  const [wasFullyAligned, setWasFullyAligned] = useState(false);

  // GPS Setup
  useEffect(() => {
    const getLocation = async () => {
      const loc = await Location.getCurrentPositionAsync({});
      setUserLat(loc.coords.latitude);
      setUserLon(loc.coords.longitude);
    };
    getLocation();
  }, []);

  // Telemetry Fetch
  useEffect(() => {
    if (userLat && userLon) {
      const fetchTelemetry = async () => {
        try {
          const res = await fetch(`http://192.168.1.25:5000/api/telemetry?lat=${userLat}&lon=${userLon}`);
          const data = await res.json();
          setTelemetryData(data);
        } catch (err) {
          console.error('Telemetry fetch failed:', err);
        }
      };
      fetchTelemetry();
      const interval = setInterval(fetchTelemetry, 5000);
      return () => clearInterval(interval);
    }
  }, [userLat, userLon]);

  // Lock logic
  const elevationAligned =
    telemetryData.elevation >= 45 && telemetryData.elevation <= 49;
  const azimuthAligned =
    Math.abs(telemetryData.azimuth - heading) <= 10;

  const isFullyAligned = elevationAligned && azimuthAligned;

  // Haptics on full lock
  useEffect(() => {
    if (isFullyAligned && !wasFullyAligned) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setWasFullyAligned(true);
    } else if (!isFullyAligned && wasFullyAligned) {
      setWasFullyAligned(false);
    }
  }, [isFullyAligned, wasFullyAligned]);

  return (
    <View style={styles.wrapper}>
      <CameraOverlay />

      {/* HUD overlays */}
      {showSummary && (
        <CalibrationSummary telemetry={telemetryData} visible={showSummary} />
      )}

      <CompassOverlay
        tolerance={10}
        telemetryURL="http://192.168.1.25:5000/api/satellite-azimuth"
      />

      <View style={styles.signalMeter}>
        <SignalMeter
          signal={telemetryData.signal_strength}
          elevation={telemetryData.elevation}
          targetElevation={47}
          tolerance={2}
        />
      </View>

      {/* ✅ Dual Lock Badge */}
      {isFullyAligned && (
        <View style={styles.alignBadge}>
          <Text style={styles.alignText}>✅ Alignment Achieved</Text>
        </View>
      )}

      {/* Toggle Button */}
      <View style={styles.buttonContainer}>
        <Button
          title={showSummary ? 'Hide Summary' : 'Show Summary'}
          onPress={() => setShowSummary(prev => !prev)}
          color="#0ff"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    position: 'relative',
    width: screen.width,
    height: screen.height,
    backgroundColor: '#000',
  },
  signalMeter: {
    position: 'absolute',
    bottom: 120,
    left: 20,
    right: 20,
    zIndex: 999,
  },
  alignBadge: {
    position: 'absolute',
    bottom: 180,
    alignSelf: 'center',
    backgroundColor: '#0f0',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    zIndex: 999,
  },
  alignText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    width: '60%',
    zIndex: 999,
  },
});
