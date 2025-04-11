import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Alert, RefreshControl, TextInput  } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

import { icons } from '../../constants';
import FormField from '../../components/FormField';
import { updateUserProfile, getCurrentUser } from '../../lib/appwrite';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useGlobalContext } from '../../context/GlobalProvider';

const AccountSignUp = () => {
  const [form, setForm] = useState({
    username: '',
    birthDate: null,
    avatar: null,
    carBrand: '',
    description: '',
    Car: null,
  });

  const [showPicker, setShowPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, setUser, setIsLoggedIn } = useGlobalContext();
  const [isPressed, setIsPressed] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const userResponse = await getCurrentUser(user.$id);

      setUser(userResponse); 
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setForm(prevForm => ({
      ...prevForm,
      birthDate: user?.birthdate ? new Date(user.birthdate) : null,  
      Car: user?.car,  
      avatar: user?.avatar,  
    }));
  }, [user?.birthdate, user?.car, user?.avatar]);

  useEffect(() => {
    if (form.carBrand === "No car") {
      submit();
    }
  }, [form.carBrand]);

  useEffect(() => {
      fetchData();
  }, [user?.$id]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData(); 
    setRefreshing(false);
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('Permissão Negada', 'É necessária permissão para acessar a galeria');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType,
      allowsEditing: true,
      aspect: [4, 3], 
      quality: 1, 
    });

    if (!result.canceled) {
      setForm({ ...form, avatar: result.assets[0].uri });
    } 
  };

  const submit = async () => {
    setIsSubmitting(true);
    try {
      await updateUserProfile({
        username: form.username,
        birthdate: form.birthDate,
        avatar: form.avatar, 
        carBrand: form.carBrand,
        description: form.description,
        car: form.Car,
      });

      router.replace('../(tabs)/profile');
    } catch (error) {
      Alert.alert('Erro', error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <View className="w-full min-h-[85vh] px-4 my-6">

          <View className="">
            <View className="items-center mb-10">
              {/* Avatar */}
              <TouchableOpacity
                onPress={pickImage}
                className="w-[110px] h-[110px] rounded-[25px] bg-interface mt-6 items-center justify-center"
              >
                {form.avatar ? (
                  <Image source={{ uri: form.avatar }} className="w-[110px] h-[110px] rounded-[25px]" />
                ) : (
                  <Text className="text-gray-500">Selecionar Avatar</Text>
                )}

                <View className="absolute inset-0 items-center opacity-50 justify-center">
                  <Image
                    source={icons.edit} 
                    className="w-[60px] h-[60px]"
                    resizeMode="contain"
                  />
                </View>
              </TouchableOpacity>

            </View>

            <View className="items-center">
              <Text className="text-darkBlue mb-6 text-[20px] font-GolosText-SemiBold">Edit Personal Information</Text>
            </View>

            <FormField
              title="Username"
              value={form.username}
              handleChangeText={(e) => setForm({ ...form, username: e })}
              placeholder={user?.username}
            />

            <View className="space-y-2 w-full mt-4 mb-4">
              <TouchableOpacity
                className="w-full h-[70px] bg-interface rounded-[15px] justify-center px-4"
                onPress={() => {
                  setShowPicker(true);
                  setIsPressed(true);
                }}
              >
                <View className="w-full">
                  <Text className="text-gray-800 mb-[10px] text-[14px] font-GolosText-Medium">Date of birth</Text>
                  <Text className="text-[18px] font-GolosText-SemiBold" style={{ color: isPressed ? '#000' : '#7b7b8b' }}>
                    {form.birthDate ? form.birthDate.toLocaleDateString('en-US', {
                      month: 'short',
                      day: '2-digit',
                      year: 'numeric',
                    }).replace(/,/g, '') : 'No birthdate set'}
                  </Text>
                </View>
              </TouchableOpacity>
              
              {showPicker && (
                <DateTimePicker
                  value={form.birthDate || new Date()} 
                  mode="date"
                  display="default"
                  onChange={onChangeDate}
                  onTouchCancel={() => setShowPicker(false)} 
                />
              )}
            </View>

            <View className={`w-full h-[70px] px-11 mb-4 bg-interface rounded-[15px] items-center justify-center flex-row ${user?.car ? 'bg-interface' : 'bg-[#dedede]'}`}>
              <View className="w-full">
                <Text className="text-gray-800 mt-2 text-[14px] font-GolosText-Medium">Car</Text> 
                <TextInput 
                  value={form.carBrand}
                  className="flex-1 text-darkBlue text-[18px] font-GolosText-SemiBold"
                  placeholder={form.Car ? (form.carBrand === "No car" ? String(user?.carBrand) : "Enter your car") : "No car"}
                  placeholderTextColor="#7b7b8b"
                  onChangeText={(e) => setForm({ ...form, carBrand: e})}
                  editable={form.Car} 
                />
              </View>
              <View className={`w-[45px] h-[25px] rounded-full items-center justify-center ${!form.Car ? 'bg-[#dedede]' : 'bg-[#60c25c]'}`}>
                <TouchableOpacity 
                  onPress={() => setForm({ ...form, Car: !form.Car })}
                  style={{ padding: 2 }}
                >
                  <View 
                    style={{
                      marginRight: 20,
                      width: 25,
                      height: 25,
                      backgroundColor: 'white',
                      borderRadius: 50,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.8,
                      shadowRadius: 2,
                      transform: [{ translateX: form.Car ? 20 : 0 }] 
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <FormField
              title="Description"
              value={form.description}
              handleChangeText={(e) => setForm({ ...form, description: e })}
              placeholder={user?.description}
            />
          </View>
            {/* Botão de Envio */}
            <View className="items-center top-[48px]">
              <TouchableOpacity
                onPress={() => {
                  const updatedCarBrand = form.Car ? form.carBrand : "No car";
                  setForm({ 
                    ...form, 
                    carBrand: updatedCarBrand,
                  });
                  submit();
                }}
                activeOpacity={0.8}
                className="items-center justify-center w-[320px] h-[60px] bg-darkBlue rounded-[15px]"
                disabled={isSubmitting}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
              >
                <Text className="text-whiteBack text-2xl font-GolosText-Medium">Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AccountSignUp;
