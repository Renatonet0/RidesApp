import { View, Text, Image, ScrollView, TouchableOpacity, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import  React, { useState } from 'react'
import { Link } from 'expo-router'
import { router } from 'expo-router'

import { icons } from '../../constants'
import FormField from '../../components/FormField'

import { signin, account, getCurrentUser } from '../../lib/appwrite'
import { useGlobalContext } from '../../context/GlobalProvider';

const signIn = () => {

  const [isSubmitting, setIsSubmitting] = useState(false)
  const {setUser, setIsLoggedIn } = useGlobalContext();

  const [form, setForm] = useState({
    email: '',
    password: ''
  })

  const submit = async () => {
    if (!form.email || !form.password) {
      Alert.alert('Error', 'Please fill in all the fields');
      return; 
    }
    
    setIsSubmitting(true);

    try {
      await signin(form.email, form.password);
      const result = await getCurrentUser();
      setUser(result);
      setIsLoggedIn(true);

      router.replace("../(tabs)/rides");
    } catch (error) {
      Alert.alert('Error', error.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <SafeAreaView className="bg-whiteBack h-full">
      <ScrollView >
        <View className="w-full justify-center items-center min-h-[85vh] px-4 my-6">

          <Image 
          source={icons.logoBlue} 
          resizeMode='contain' 
          className="w-[40vw] h-[40vw]"
           />

          <FormField 
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-[10vh]"
            keyboardType="email-address"
            placeholder="Email"
          />

          <FormField 
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-[4vh]"
            placeholder="Password"
          />

          <View className="items-center top-[5vh]">
            <TouchableOpacity 
              activeOpacity={0.8} 
              className="items-center justify-center w-[80vw] h-[8vh] bg-darkBlue rounded-[15px]"
              isLoading={isSubmitting}
              onPress={submit}
            >
              <Text className="text-whiteBack text-2xl font-GolosText-Medium">Sign In</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row">
            <Text className="top-[7vh] text-center text-[18px] font-GolosText-Regular text-darkBlue">Don't have an account?</Text>
            <Link href="/signUp" className="top-[7vh] text-center text-[18px] font-GolosText-Bold text-darkBlue"> Sign Up </Link>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  )
}

export default signIn