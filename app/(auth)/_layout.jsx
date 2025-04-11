import { View, Text } from 'react-native'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useGlobalContext } from "../../context/GlobalProvider";

const AuthLayout = () => {
  const { loading, isLogged } = useGlobalContext();

  if (!loading && isLogged) return <Redirect href="../(tabs)/rides" />;

  return (
    <>
      <Stack>
        <Stack.Screen 
          name="signIn"
          options={{
            headerShown: false
          }}
        />

        <Stack.Screen 
          name="signUp"
          options={{
            headerShown: false
          }}
        />
      </Stack>

      <StatusBar backgroundColor='#f0f0f0' />
    </>
  )
}

export default AuthLayout