import { View, Text } from 'react-native'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

const AcountLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen 
          name="acount"
          options={{
            headerShown: false
          }}
        />

        <Stack.Screen 
          name="acountSignUp"
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen 
          name="profileGuest"
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen 
          name="ChatScreen"
          options={{
            headerShown: false
          }}
        />
      </Stack>

      <StatusBar backgroundColor='#ffffff' />
    </>
  )
}

export default AcountLayout