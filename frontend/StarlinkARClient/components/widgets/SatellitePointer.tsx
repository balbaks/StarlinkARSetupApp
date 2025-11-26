import React from 'react';
import { View, StyleSheet } from 'react-native';

type Props = {
  angle: number;
  aligned: boolean;
};

const SatellitePointer: React.FC<Props> = ({ angle, aligned }) => {
  ret
    <View
      style={[
        styles.pointe
        {
          transform: [{ rotate: `${angle}deg` }],
          backgroundColor: aligned ? '#0f0' : '#f00',
        },
      ]}
    />
  );
};

export default SatellitePointer;

const styles = StyleSheet.create({
  pointer: {
    width: 20,
    height: 40,
    backgroundColor: '#f00',
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -10,
    marginTop: -20,
    borderRadius: 4,
  },
});
