import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Telemetry = {
  satellite: string;
  azimuth: number;
  elevation: number;
  signal_strength: string;
  timestamp: string;
};

type Props = {
  telemetry: Telemetry;
  visible?: boolean;
};

export default function CalibrationSummary({ telemetry, visible = true }: Props) {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <Text style={styles.header}>🛰️ Calibration Summary</Text>
      <Text style={styles.text}>📡 Satellite: {telemetry.satellite}</Text>
      <Text style={styles.text}>🧭 Azimuth: {telemetry.azimuth}°</Text>
      <Text style={styles.text}>📶 Elevation: {telemetry.elevation}°</Text>
      <Text style={styles.text}>🔊 Signal: {telemetry.signal_strength.toUpperCase()}</Text>
      <Text style={styles.text}>⏱️ {new Date(telemetry.timestamp).toLocaleTimeString()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 40,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 10,
    padding: 12,
    zIndex: 10,
    borderColor: '#0ff',
    borderWidth: 1,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0ff',
    marginBottom: 8,
    textAlign: 'center',
  },
  text: {
    fontSize: 15,
    color: '#fff',
    marginBottom: 4,
  },
});
