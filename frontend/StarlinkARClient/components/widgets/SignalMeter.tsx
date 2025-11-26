import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Props = {
  signal: string;
  elevation: number;
  targetElevation?: number;
  tolerance?: number;
};

export default function SignalMeter({
  signal,
  elevation,
  targetElevation = 47,
  tolerance = 2,
}: Props) {
  const elevationAligned =
    elevation >= targetElevation - tolerance &&
    elevation <= targetElevation + tolerance;

  return (
    <View style={styles.container}>
      {/* Signal Status */}
      <View style={styles.row}>
        <Text style={styles.label}>Signal Strength:</Text>
        <Text style={[styles.value, signalStyles(signal)]}>{signal}</Text>
      </View>

      {/* Elevation with Feedback */}
      <View style={[styles.row, elevationAligned && styles.elevationGlow]}>
        <Text style={styles.label}>Elevation:</Text>
        <Text style={styles.value}>{elevation.toFixed(2)}°</Text>
      </View>

      {/* Lock Status */}
      <Text style={[styles.status, elevationAligned && styles.locked]}>
        {elevationAligned ? '🟢 Elevation Locked' : '🔴 Adjust Pitch'}
      </Text>
    </View>
  );
}

// Signal strength color modulation
const signalStyles = (signal: string) => {
  switch (signal.toLowerCase()) {
    case 'strong':
      return { color: '#0f0' };
    case 'moderate':
      return { color: '#ffa500' };
    case 'weak':
      return { color: '#f00' };
    default:
      return { color: '#fff' };
  }
};

const styles = StyleSheet.create({
  container: {
    padding: 14,
    borderRadius: 8,
    backgroundColor: '#222',
    marginTop: 10,
    borderColor: '#333',
    borderWidth: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: {
    fontSize: 16,
    color: '#aaa',
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  status: {
    marginTop: 8,
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
  },
  locked: {
    color: '#0f0',
    fontWeight: 'bold',
  },
  elevationGlow: {
    backgroundColor: 'rgba(0,255,0,0.1)',
    borderWidth: 1,
    borderColor: '#0f0',
    borderRadius: 4,
    padding: 4,
  },
});
