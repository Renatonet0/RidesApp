import { View, Text, Image, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import  React, { useState } from 'react'
import { router } from 'expo-router'
import DateTimePicker from '@react-native-community/datetimepicker';

import { icons } from '../../constants'
import FormField from '../../components/FormField'
import { createUser } from '../../lib/appwrite'
import { useGlobalContext } from '../../context/GlobalProvider';

const signUp = () => {

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPicker, setShowPicker] = useState(false);
  const {setUser, setIsLoggedIn } = useGlobalContext();

  const [form, setForm] = useState({
    name:'',
    surname:'',
    email: '',
    password: '',
    birthDate: null
  })

  const submit = async () => {
    if (!form.name || !form.surname || !form.email || !form.password || !form.birthDate) {
        Alert.alert('Error', 'Please fill in all the fields')
      }
    
    setIsSubmitting(true);

    try {
      const username = `${form.name} ${form.surname}`;
      const result = await createUser(form.email, form.password, username, form.birthDate)

      setUser(result);
      setIsLoggedIn(true);

      router.replace("../accountChange/acountSignUp")
    } catch (error) {
      Alert.alert('Error', error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const onChangeDate = (event, selectedDate) => {
    if (event.type === 'set') {
      const currentDate = selectedDate || form.birthDate;
      setForm({ ...form, birthDate: currentDate });
      setShowPicker(false);
    } else {
      setShowPicker(false);
    }
  };
  
  return (
    <SafeAreaView className="bg-whiteBack h-full">
      <ScrollView>
        <View className="w-full items-center justify-center min-h-[85vh] px-4 my-6">

          <Image source={icons.logoBlue} 
          resizeMode='contain' className="w-[150px] h-[150px]" />

        <View className="flex-row w-full mt-10 justify-center">
          {/* Name */}
          <View className="space-y-2 w-[48%] mr-4">
            <View className="h-[70px] bg-interface rounded-[15px] px-4">
              <Text className="text-gray-800 mt-2 text-[14px] font-GolosText-Medium">Name</Text> 
              <TextInput 
                className="flex-1 text-darkBlue text-[18px] font-GolosText-SemiBold"
                onChangeText={(e) => setForm({ ...form, name: e })}
                value={form.name}
                placeholderTextColor="#7b7b8b"
                placeholder='Name'
              />
            </View>
          </View>

          {/* Surname */}
          <View className="space-y-2 w-[48%]">
            <View className="h-[70px] bg-interface rounded-[15px] px-4">
              <Text className="text-gray-800 mt-2 text-[14px] font-GolosText-Medium">Surname</Text> 
              <TextInput 
                className="flex-1 text-darkBlue text-[18px] font-GolosText-SemiBold"
                onChangeText={(e) => setForm({ ...form, surname: e })}
                value={form.surname}
                placeholderTextColor="#7b7b8b"
                placeholder='Surname'
              />
            </View>
          </View>
        </View>

        {/* Date of Birth */}
        <View className="space-y-2 w-full mt-7">
          <TouchableOpacity
            className="w-full h-[70px] bg-interface rounded-[15px] justify-center px-4"
            onPress={() => setShowPicker(true)}
          >
            <Text className="text-gray-800 mb-[10px] text-[14px] font-GolosText-Medium">Date of Birth</Text> 
            <Text className="text-darkBlue text-[18px] font-GolosText-SemiBold">
              {form.birthDate
                ? form.birthDate.toLocaleDateString('en-US', {
                    month: 'short',
                    day: '2-digit',
                    year: 'numeric',
                  }).replace(/,/g, ''
                ) : ( 
                  <Text style={{ color: '#7b7b8b' }}>
                    Date of Birth
                  </Text>
                )}
            </Text>
          </TouchableOpacity>

          {showPicker && (
            <DateTimePicker
              value={form.birthDate || new Date()} // Usa a data atual se birthDate estiver vazio
              mode="date"
              display="default"
              onChange={onChangeDate}
              onTouchCancel={() => setShowPicker(false)} // Fecha o picker se for cancelado
            />
          )}
        </View>

          {/* Email */}
          <FormField 
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            placeholder="Email"
            keyboardType="email-address"
          />

          {/* Password */}
          <FormField 
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            placeholder="Password"
            otherStyles="mt-7"
          />

          {/* Botao */}
          <View className="items-center top-[48px]">
            <TouchableOpacity 
              onPress={submit}
              activeOpacity={0.8} 
              className="items-center justify-center w-[320px] h-[60px] bg-darkBlue rounded-[15px]"
              isLoading={isSubmitting}
            >
              <Text className="text-whiteBack text-2xl font-GolosText-Medium">Create acount</Text>
            </TouchableOpacity>
          </View>

        </View>

      </ScrollView>
    </SafeAreaView>
  )
}

export default signUp