import React, { useState, useEffect } from 'react';
import { Platform, View, Text, StyleSheet } from 'react-native';
import { Camera } from 'expo-camera';

export default function CameraView({ children }: { children?: React.ReactNode }) {
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    const request = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };
    request();
  }, []);

  if (Platform.OS === 'web') {
    return (
      <View style={styles.fallback}>
        <Text style={styles.text}>🔒 Camera not supported on web</Text>
        {children}
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View style={styles.fallback}>
        <Text style={styles.text}>🔒 Camera permission not granted</Text>
        {children}
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <Camera style={StyleSheet.absoluteFillObject} />
      <View style={StyleSheet.absoluteFill}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    position: 'relative',
  },
  fallback: {
    flex: 1,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 16,
    padding: 20,
    textAlign: 'center',
  },
});
