// components/Loading.js
import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { icons } from '../constants';

const Loading = () => {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const rotateImage = () => {
      Animated.loop(
        Animated.timing(rotation, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        })
      ).start();
    };

    rotateImage();
  }, [rotation]);

  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const rotateStyle = {
    transform: [{ rotate: rotateInterpolate }],
  };

  return (
    <View style={styles.container}>
      <Animated.Image
        source={icons.logoBlue} 
        style={[styles.image, rotateStyle]}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  image: {
    width: 80,
    height: 80,
  },
});

export default Loading;
