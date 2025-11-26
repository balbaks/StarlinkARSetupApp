import { View, Text, StyleSheet } from 'react-native';

export default function SignalMeter({ signal, elevation }: { signal: string; elevation: number }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>📡 Signal: {signal}</Text>
      <Text style={styles.label}>📈 Elevation: {elevation.toFixed(1)}°</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#00b7eb',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    margin: 20
  },
  label: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600'
  }
});
