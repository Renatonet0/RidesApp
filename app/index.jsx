import { StatusBar } from 'expo-status-bar';
import { ScrollView, Text, View, Image, TouchableOpacity, Animated } from 'react-native';
import { Redirect, router } from 'expo-router';
import React, { useState, useRef, useEffect } from 'react';
import { icons } from '../constants';
import { useGlobalContext } from '../context/GlobalProvider';
import Loading from '../components/Loading';
import 'setimmediate';

import 'react-native-gesture-handler';

if (typeof global.setImmediate === 'undefined') {
  global.setImmediate = (callback) => setTimeout(callback, 0);
}


const Welcome = () => {

  const {isLoading, isLoggedIn} = useGlobalContext() || {};

  if(!isLoading && isLoggedIn) return <Redirect href="/(tabs)/rides" />

  const [activeIndex, setActiveIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const listener = scrollX.addListener(({ value }) => {
      const index = Math.floor(value / 400);
      setActiveIndex(index);
    });

    return () => {


      scrollX.removeListener(listener);
    };
  }, [scrollX]);

  return (
    
    <View className="bg-whiteBack h-full">
      {isLoading ? ( <Loading /> ) : (
        <>
      {/* Logo */}
      <Image
        source={icons.logoBlue}
        className="absolute top-[80px] -left-[480px] w-[1193px] h-[1157px] opacity-5"
        style={{ zIndex: -1 }}
      />

      {/* Conteúdo scrollable */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        className="flex-1"
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* imagem 1 */}
        <View className="top-[100px] items-center">
          <Image
            source={require("../assets/images/pexels-pripicart-620335.jpg")}
            className="w-screen h-[50%] rounded-[25px]"
            resizeMode="cover"
          />

          <Animated.View style={{ transform: [{ translateX: Animated.multiply(scrollX, -1.2) }] }}>
            <Text className="text-darkBlue text-center text-[45px] font-GolosText-SemiBold top-[28px]">Give a ride</Text>
            <Text className="text-darkBlue text-center opacity-50 text-[20px] font-GolosText-SemiBold top-[32px]">
              Create a ride and have people {'\n'}join your trip.
            </Text>
          </Animated.View>
        </View>

        {/* imagem 2 */}
        <View className="top-[100px]">
          <Image
            source={require("../assets/images/pexels-cottonbro-4606397.jpg")}
            className="w-screen h-[400px] rounded-[25px]"
            resizeMode="cover"
          />

          <Animated.View style={{ transform: [{ translateX: Animated.multiply(scrollX, -1.2) }] }}>
            <Text className="text-darkBlue text-center left-[495px] text-[45px] font-GolosText-SemiBold top-[28px]">Get a ride</Text>
            <Text className="text-darkBlue text-center left-[495px] opacity-50 text-[20px] font-GolosText-SemiBold top-[32px]">
              Join other people trips
            </Text>
          </Animated.View>
        </View>

        {/* imagens 3 */}
        <View className="top-[100px]">
          <Image
            source={require("../assets/images/pack.jpg")}
            className="w-screen h-[400px] rounded-[25px]"
            resizeMode="cover"
          />
          <Animated.View style={{ transform: [{ translateX: Animated.multiply(scrollX, -1.2) }] }}>
            <Text className="text-darkBlue text-center left-[990px] text-[45px] font-GolosText-SemiBold top-[28px]">Travel, meet {'\n'} and save</Text>
            <Text className="text-darkBlue text-center left-[990px] opacity-50 text-[20px] font-GolosText-SemiBold top-[32px]">
              Travel to your destination, {'\n'} accompanied, while saving money
            </Text>
          </Animated.View>  
        </View>

      </ScrollView>

      {/* Indicadores */}
      <View className="flex-row -top-[6px] left-[24px] items-center mt-4">
        {[0, 1, 2].map((index) => (
          <View
            key={index}
            className={`w-10 h-2 mx-1 rounded-[25px] ${activeIndex === index ? 'bg-darkBlue' : 'bg-gray-300'}`}
          />
        ))}
      </View>

      {/* Botão fixo "Start" */}
      <View style={{left: 175, top: -40}}>
        <TouchableOpacity 
          onPress={() => router.push('/signIn')} 
          activeOpacity={0.8} 
          className="items-start justify-center w-[195px] h-[60px] bg-darkBlue rounded-[25px]"
        >
          <Text className="text-whiteBack text-2xl font-GolosText-Medium">   Continuar</Text>
          <Image
            source={icons.arrowWhite}
            className="absolute left-[160px] w-6 h-6"
          />

        </TouchableOpacity>
      </View>

      <StatusBar style="auto" />
      </>
      )}
    </View>
  );
}

export default Welcome;

