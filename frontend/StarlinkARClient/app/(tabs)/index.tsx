import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Platform } from 'react-native';
import { CameraView } from 'expo-camera';

export default function CameraOverlayComponent({ children }: { children?: React.ReactNode }) {
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'web') return;
    (async () => {
      const { status } = await CameraView.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>🔒 Camera not supported on web</Text>
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>🔒 Camera permission not granted</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={StyleSheet.absoluteFillObject} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});
