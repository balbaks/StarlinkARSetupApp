import { useState, useCallback, useEffect } from 'react';
import * as Location from 'expo-location';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';

type LogEntry = {
  timestamp: string;
  location: { latitude: number; longitude: number };
  heading: number;
  azimuth: number;
  satellite: string;
};

const LOG_KEY = 'installerLog';

export default function useInstallerLog() {
  const [log, setLog] = useState<LogEntry[]>([]);

  // Load stored logs on mount
  useEffect(() => {
    AsyncStorage.getItem(LOG_KEY).then(data => {
      if (data) setLog(JSON.parse(data));
    });
  }, []);

  const addLogEntry = useCallback(async (
    heading: number,
    azimuth: number,
    satellite: string
  ) => {
    try {
      const loc = await Location.getCurrentPositionAsync({});
      const entry: LogEntry = {
        timestamp: new Date().toISOString(),
        location: {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        },
        heading,
        azimuth,
        satellite,
      };
      const updated = [...log, entry];
      setLog(updated);
      await AsyncStorage.setItem(LOG_KEY, JSON.stringify(updated));
    } catch (err) {
      console.warn('Failed to log installer event:', err);
    }
  }, [log]);

  const resetLog = async () => {
    setLog([]);
    await AsyncStorage.removeItem(LOG_KEY);
  };

  const exportLogAsJson = async () => {
    const path = FileSystem.documentDirectory + 'installer-log.json';
    const content = JSON.stringify(log, null, 2);
    await FileSystem.writeAsStringAsync(path, content, { encoding: FileSystem.EncodingType.UTF8 });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(path);
    } else {
      console.warn('Sharing not available on this platform');
    }
  };

  return { log, addLogEntry, exportLogAsJson, resetLog };
}
