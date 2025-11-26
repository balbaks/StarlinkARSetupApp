import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

type Telemetry = {
  azimuth: number;
  elevation: number;
  signal: string;
  satellite: string;
};

export default function useTelemetry(url: string, interval = 5000): Telemetry {
  const [data, setData] = useState<Telemetry>({
    azimuth: 0,
    elevation: 0,
    signal: 'unknown',
    satellite: '',
  });

  useEffect(() => {
    const fetchTelemetry = async () => {
      try {
        const loc = await Location.getCurrentPositionAsync({});
        const lat = loc.coords.latitude;
        const lon = loc.coords.longitude;

        const res = await fetch(`${url}?lat=${lat}&lon=${lon}`);
        const result = await res.json();
        setData({
          azimuth: Math.round(result.azimuth),
          elevation: Math.round(result.elevation),
          signal: result.signal,
          satellite: result.satellite,
        });
      } catch (err) {
        console.warn('Telemetry fetch failed:', err);
      }
    };

    fetchTelemetry();
    const id = setInterval(fetchTelemetry, interval);
    return () => clearInterval(id);
  }, [url]);

  return data;
}
