import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Alert, RefreshControl, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

import { icons } from '../../constants';
import FormField from '../../components/FormField';
import { updateUserProfile, getCurrentUser, signOut, deleteAccount } from '../../lib/appwrite';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useGlobalContext } from '../../context/GlobalProvider';

const Account = () => {
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
    if (!user || !user.$id) return; 
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
      birthDate: user?.birthdate ? new Date(user?.birthdate) : null,   
      avatar: user?.avatar,  
    }));
  }, [user?.birthdate, user?.avatar]);

  useEffect(() => {
    
    if (form.carBrand === "No car") {
      submit();
    }
  }, [form.carBrand]);

  useEffect(() => {
    if (form.Car) {
    setForm(prevForm => ({
      ...prevForm,   
      carBrand: user?.carBrand,
    }));
  }}, [form.Car]);

  useEffect(() => {
    
    if (user?.$id) {
      fetchData();
    } 
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

  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLoggedIn(false);

    router.dismissAll();
    router.replace("../(auth)/signIn");
  };

  const handleDelete = async () => {
    Alert.alert(
      'Confirmar Exclusão',
      'Você tem certeza de que deseja excluir sua conta? Esta ação não pode ser desfeita.',
      [
        {
          text: 'Cancelar',
          onPress: () => console.log('Cancelado'),
          style: 'cancel',
        },
        {
          text: 'Excluir',
          onPress: async () => {
            try {

              await deleteAccount();
              setUser(null);
              setIsLoggedIn(false);
              
              router.dismissAll();
              router.replace("../(auth)/signIn");
            } catch (error) {
              console.error('Erro ao tentar excluir a conta', error);
              Alert.alert('Erro', 'Houve um problema ao excluir sua conta.');
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-whiteBack h-full">
      <ScrollView>
        <View className="w-full min-h-[85vh] px-4 my-6">
          {/* Out */}
          <View className="mb-4 items-center justify-between flex-row">
            {/* Seta no início */}
            <TouchableOpacity 
              onPress={() => router.back('../(tabs)/rides')}
              activeOpacity={0.8}
            >
              <View className="w-[50px] h-[50px] items-center justify-center rounded-[10px] bg-interface">
                <Image source={icons.arrowBlackLeft} 
                  className="w-[25px] h-[25px]"
                  resizeMode="contain"
                />
              </View>
            </TouchableOpacity>

            {/* Texto centralizado */}
            <View>
              <Text className="text-darkBlue text-2xl font-GolosText-SemiBold">Settings</Text>
            </View>
            
            <View className="items-center justify-center">
              <TouchableOpacity 
                onPress={logout}
                activeOpacity={0.8}
              >
                <View className="w-[50px] h-[50px] items-end justify-center rounded-[10px]">
                  <Image source={icons.out} 
                    className="w-[35px] h-[35px]"
                    resizeMode="contain"
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <View className="">
            <View className="items-center mb-10">
              {/* Avatar */}
              <TouchableOpacity
                onPress={pickImage}
                className="w-[110px] h-[110px] rounded-[25px] bg-interface mt-6 items-center justify-center"
              >
                {form.avatar ? (
                  <Image source={{ uri: form.avatar }} className="w-[110px] h-[110px] rounded-lg" />
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
                  placeholder={form.Car ? (!form.carBrand === "No car" ? form.carBrand : "Car Name") : "No car"}
                  placeholderTextColor="#7b7b8b"
                  onChangeText={(e) => setForm({ ...form, carBrand: e})}
                  editable={form.Car} 
                />
              </View>
              <View className={`w-[45px] h-[25px] rounded-full items-center justify-center ${!form.Car ? 'bg-[#dedede]' : 'bg-[#60c25c]'}`}>
                <TouchableOpacity 
                  onPress={() => setForm({ ...form, Car: !form.Car, carBrand: "No car"})}
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

export default Account;
