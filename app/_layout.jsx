import { StyleSheet, Text, View } from 'react-native'
import { Slot, SplashScreen, Stack } from 'expo-router';
import { useFonts } from 'expo-font'
import { useEffect } from 'react';
import "./global.css"

import GlobalProvider from '../context/GlobalProvider';

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [fontsLoaded, error] = useFonts({
    "GolosText-Black": require("../assets/fonts/GolosText-Black.ttf"),
    "GolosText-Bold": require("../assets/fonts/GolosText-Bold.ttf"),
    "GolosText-ExtraBold": require("../assets/fonts/GolosText-ExtraBold.ttf"),
    "GolosText-Medium": require("../assets/fonts/GolosText-Medium.ttf"),
    "GolosText-Regular": require("../assets/fonts/GolosText-Regular.ttf"),
    "GolosText-SemiBold": require("../assets/fonts/GolosText-SemiBold.ttf")
  });

  useEffect(() => {
    if(error) throw error;

    if(fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error])

  if(!fontsLoaded && !error) return null;

  return(
    <GlobalProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="accountChange" options={{ headerShown: false }} />
      </Stack>
    </GlobalProvider>
  )
}

export default RootLayout
