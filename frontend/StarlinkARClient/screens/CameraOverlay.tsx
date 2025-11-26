import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Platform,
  ScrollView,
  Button,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Camera } from 'expo-camera';
import SatellitePointer from './widgets/SatellitePointer';
import Slider from '@react-native-community/slider';
import useHeading from '@/components/hooks/useHeading';
import useTelemetry from '@/components/hooks/useTelemetry';
import useInstallerLog from '@/components/hooks/useInstallerLog';
import useMinimalMode from '@/components/hooks/useMinimalMode';

const screen = Dimensions.get('window');

type Props = {
  tolerance?: number;
  telemetryURL?: string;
};

export default function CompassOverlay({
  tolerance = 10,
  telemetryURL = 'http://192.168.100.197:5000/api/satellite-azimuth',
}: Props) {
  const heading = useHeading();
  const { azimuth, elevation, signal, satellite } = useTelemetry(telemetryURL);
  const { log, addLogEntry, exportLogAsJson, resetLog } = useInstallerLog();
  const { minimal, toggleMinimal } = useMinimalMode();

  const [wasAligned, setWasAligned] = useState(false);
  const [sliderTolerance, setSliderTolerance] = useState(tolerance);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'web') return;
    Camera.requestCameraPermissionsAsync().then(({ status }) => {
      setHasPermission(status === 'granted');
    });
  }, []);

  const angleToRotate = azimuth - heading;
  const normalizedAngle = (angleToRotate + 360) % 360;
  const isAligned =
    Math.abs(normalizedAngle) < sliderTolerance ||
    Math.abs(360 - normalizedAngle) < sliderTolerance;

  useEffect(() => {
    if (isAligned && !wasAligned) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      addLogEntry(heading, azimuth, satellite);
      setWasAligned(true);
    } else if (!isAligned && wasAligned) {
      setWasAligned(false);
    }
  }, [isAligned, wasAligned]);

  const renderLogEntries = () => {
    if (log.length === 0 || minimal) return null;

    return (
      <ScrollView style={styles.logPanel}>
        <Text style={styles.logTitle}>📒 Installer Logs</Text>
        {log.map((entry, index) => (
          <View key={index} style={styles.logEntry}>
            <Text style={styles.logText}>🕒 {entry.timestamp}</Text>
            <Text style={styles.logText}>📍 Lat: {entry.location.latitude.toFixed(5)}</Text>
            <Text style={styles.logText}>📍 Lon: {entry.location.longitude.toFixed(5)}</Text>
            <Text style={styles.logText}>🧭 Heading: {entry.heading}°</Text>
            <Text style={styles.logText}>🎯 Azimuth: {entry.azimuth}°</Text>
            <Text style={styles.logText}>📡 Satellite: {entry.satellite}</Text>
          </View>
        ))}
        <View style={styles.logButtons}>
          <Button title="📤 Export Logs" onPress={exportLogAsJson} color="#0f0" />
          <Button title="🗑 Reset Logs" onPress={resetLog} color="#f44" />
        </View>
      </ScrollView>
    );
  };

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <Text style={{ color: '#fff' }}>🧭 Compass not supported on web</Text>
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text style={{ color: '#fff' }}>🔒 Camera permission not granted</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <Camera style={styles.camera} />
      <View style={[styles.container, isAligned && styles.alignedGlow]}>
        <View style={[styles.pointer, isAligned && styles.alignedGlow]}>
          <Text style={styles.azimuthText}>🧭 Heading: {heading}°</Text>
          <Text style={styles.targetText}>🎯 Target: {azimuth}°</Text>
          <Text style={styles.satelliteText}>📡 Satellite: {satellite}</Text>
          <Text style={[styles.lockStatus, isAligned && styles.locked]}>
            {isAligned ? '🟢 Azimuth Locked' : '🔴 Adjust Orientation'}
          </Text>
        </View>

        {!minimal && (
          <View style={styles.sliderContainer}>
            <Text style={styles.sliderLabel}>Tolerance: ±{sliderTolerance}°</Text>
            <Slider
              style={{ width: 200 }}
              minimumValue={2}
              maximumValue={30}
              step={1}
              value={sliderTolerance}
              onValueChange={setSliderTolerance}
              minimumTrackTintColor="#0f0"
              maximumTrackTintColor="#555"
              thumbTintColor="#0f0"
            />
          </View>
        )}

        <SatellitePointer angle={angleToRotate} aligned={isAligned} />
        {renderLogEntries()}
        <Button
          title={minimal ? '🔧 Dev Mode' : '🛠 Installer Mode'}
          onPress={toggleMinimal}
          color="#999"
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
  },
  camera: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  container: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 10,
    position: 'absolute',
    top: 80,
    left: 0,
    right: 0,
    zIndex: 999,
  },
  pointer: {
    alignItems: 'center',
    marginTop: 10,
    padding: 10,
    borderRadius: 6,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  alignedGlow: {
    backgroundColor: 'rgba(0,255,0,0.1)',
    borderColor: '#0f0',
    borderWidth: 1,
  },
  azimuthText: {
    fontSize: 17,
    color: '#fff',
    marginBottom: 2,
  },
  targetText: {
    fontSize: 17,
    color: '#aaa',
    marginBottom: 2,
  },
  satelliteText: {
    fontSize: 15,
    color: '#ccc',
    marginBottom: 2,
  },
  lockStatus: {
    fontSize: 18,
    color: '#ccc',
    marginTop: 4,
  },
  locked: {
    color: '#0f0',
    fontWeight: 'bold',
  },
  sliderContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  sliderLabel: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 4,
  },
  logPanel: {
    marginTop: 12,
    padding: 10,
    maxHeight: 220,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 8,
    width: '100%',
  },
  logEntry: {
    marginBottom: 12,
    borderBottomColor: '#555',
    borderBottomWidth: 1,
    paddingBottom: 6,
  },
  logTitle: {
    fontSize: 18,
    color: '#0f0',
    fontWeight: 'bold',
    marginBottom: 6,
  },
  logText: {
    fontSize: 14,
    color: '#ccc',
  },
  logButtons: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
