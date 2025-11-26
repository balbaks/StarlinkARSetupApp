import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions, CameraType, CameraMode } from 'expo-camera';

const CameraOverlayComponent = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [mode, setMode] = useState<CameraMode>('picture');
  const [facing, setFacing] = useState<CameraType>('back');
  const [uri, setUri] = useState<string | null>(null);

  useEffect(() => {
    if (!permission) return;
    if (!permission.granted) requestPermission();
  }, [permission]);

  const takePicture = async () => {
    const photo = await cameraRef.current?.takePictureAsync();
    setUri(photo?.uri ?? null);
  };

  if (!permission || !permission.granted) {
    return (
      <View style={styles.centered}>
        <Text>📷 Camera permission required</Text>
        <Button title="Grant Permission" onPress={requestPermission} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        mode={mode}
        facing={facing}
        responsiveOrientationWhenOrientationLocked
      />
      <View style={styles.controls}>
        <Button title="📸 Capture" onPress={takePicture} />
        <Button
          title={`🔄 Switch to ${facing === 'back' ? 'front' : 'back'}`}
          onPress={() => setFacing(facing === 'back' ? 'front' : 'back')}
        />
      </View>
      {uri && <Text style={styles.uri}>Saved to: {uri}</Text>}
    </View>
  );
};

export default CameraOverlayComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  controls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uri: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    color: '#fff',
  },
});
