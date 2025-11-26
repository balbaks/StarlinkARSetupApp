import { useState, useEffect } from 'react';
import { Magnetometer } from 'expo-sensors';
import { Platform } from 'react-native';

export default function useHeading(): number {
  const [heading, setHeading] = useState(0);

  useEffect(() => {
    if (Platform.OS === 'web') return;

    Magnetometer.setUpdateInterval(500);
    const sub = Magnetometer.addListener(data => {
      let angle = Math.atan2(data.y, data.x) * (180 / Math.PI);
      angle = angle >= 0 ? angle : 360 + angle;
      setHeading(Math.round(angle));
    });

    return () => sub.remove();
  }, []);

  return heading;
}
