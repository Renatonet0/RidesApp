import React, { useState, useEffect } from 'react';
import { TextInput, SafeAreaView, View, Image, Text, TouchableOpacity, ScrollView, Alert, StatusBar } from 'react-native';
import { icons } from '../../constants';
import DateTimePicker from '@react-native-community/datetimepicker';
import { createRide } from '../../lib/appwrite';
import { router } from 'expo-router'
import { useGlobalContext } from '../../context/GlobalProvider';
// import MapView, { Marker } from 'react-native-maps'

const CreateRide = () => {

  const { fetchDataR, fetchDataP } = useGlobalContext();
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [form, setForm] = useState({
    de: '',
    para: '',
    data: null,
    pessoas: 0,
  });

  const fromCoordinates = {
    latitude: 37.78825,
    longitude: -122.4324,
  };

  const toCoordinates = {
    latitude: 37.75825,
    longitude: -122.4624,
  };

  const Createride = async () => {
    
    if (!isFormValid()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos corretamente.');
      return;
    }

    const de = form.de;
    const para = form.para;
    const data = form.data;
    const pessoas = form.pessoas;

    setForm({
      de: '',
      para: '',
      data: null,
      pessoas: 0,
    });

    try {
      await createRide({
        de: de, 
        para: para, 
        data: data, 
        pessoas: pessoas 
      });

      fetchDataR();
      fetchDataP();
      router.replace('../(tabs)/profile');
    } catch (error) {
      Alert.alert('Erro', error.message);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowPicker(false);
    if (event.type === 'set' && selectedDate) {
      setForm({ ...form, data: selectedDate });
      setShowTimePicker(true);
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (event.type === 'set' && selectedTime) {
      const combinedDateTime = new Date(form.data);
      combinedDateTime.setHours(selectedTime.getHours());
      combinedDateTime.setMinutes(selectedTime.getMinutes());

      setForm({ ...form, data: combinedDateTime });
    }
  };

  const isFormValid = () => {
    return form.de !== '' && form.para !== '' && form.data !== null && form.pessoas > 0;
  };

  return (
    <SafeAreaView className="flex-1 bg-whiteBack h-full">
      <ScrollView>
        <View className="w-full min-h-[95vh] px-4 my-[56px]">
          <View className="mb-2">
            <Image
              source={icons.logoBlue}
              className="w-[50px] h-[50px]"
              resizeMode="contain"
            />
          </View>

          <View className="mt-4 mb-4 items-center justify-center">
            <View className="w-full h-[70px] px-11 mb-4 bg-interface rounded-[15px] items-center justify-center flex-row">
              <View className="w-[66px] h-[70px] mr-4 items-center justify-center rounded-[15px] bg-gray-200 ">
                <Image 
                  source={icons.point}
                  className="w-[25px] h-[25px] "
                />
              </View>
              <View className="w-full">
                <Text className="text-gray-800 mt-2 text-[14px] font-GolosText-Medium">From</Text> 
                <TextInput 
                  value={form.de}
                  className="flex-1 text-darkBlue text-[18px] font-GolosText-SemiBold"
                  placeholder="From"
                  placeholderTextColor="#7b7b8b"
                  onChangeText={(e) => setForm({ ...form, de: e})}
                />
              </View>
            </View>

            <View className="w-full h-[70px] px-11 mb-4 bg-interface rounded-[15px] items-center justify-center flex-row">
              <View className="w-[66px] h-[70px] mr-4 items-center justify-center rounded-[15px] bg-gray-200 ">
                <Image 
                  source={icons.pin}
                  className="w-[25px] h-[25px] "
                />
              </View>
              <View className="w-full">
                <Text className="text-gray-800 mt-2 text-[14px] font-GolosText-Medium">To</Text> 
                <TextInput 
                  value={form.para}
                  className="flex-1 text-darkBlue text-[18px] font-GolosText-SemiBold"
                  placeholder="To"
                  placeholderTextColor="#7b7b8b"
                  onChangeText={(e) => setForm({ ...form, para: e})}
                />
              </View>
            </View>
          </View>
          {/* View Wrapper for Map */}
          {/*
          <View style={{ flex: 1, borderRadius: 15, overflow: 'hidden' }}>
            <MapView
              style={{ flex: 1 }}
              initialRegion={{
                latitude: fromCoordinates.latitude,
                longitude: fromCoordinates.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            >
              
              <Marker
                coordinate={{ latitude: fromCoordinates.latitude, longitude: fromCoordinates.longitude }}
              >
               
                <Image
                  source={icons.point}
                  style={{ width:25, height: 25 }}
                />
              </Marker>

              
              <Marker
                coordinate={{ latitude: toCoordinates.latitude, longitude: toCoordinates.longitude }}
              >
                
                <Image
                  source={icons.pin}
                  style={{ width: 30, height: 30 }}
                />
              </Marker>
            </MapView>
          </View>
            *
            */}
          <View className="flex-row w-full mt-10 justify-center">
            {/* Date */}
            <View className="space-y-2 w-[64%] mr-4">
              <TouchableOpacity
                className="w-full h-[70px] bg-interface rounded-[15px] justify-center px-4"
                onPress={() => setShowPicker(true)}
              >
                <Text className="text-gray-800 mb-[10px] text-[14px] font-GolosText-Medium">Date/Time of Ride</Text> 
                <Text className="text-darkBlue text-[18px] font-GolosText-SemiBold">
                  {form.data
                    ? form.data.toLocaleDateString('en-US', {
                        month: 'short',
                        day: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      }).replace(/,/g, ''
                    ) : ( 
                      <Text style={{ color: '#7b7b8b' }}>
                        Date/Time of Ride
                      </Text>
                    )}
                </Text>
              </TouchableOpacity>

              {/* Seletor de Data */}
              {showPicker && (
                <DateTimePicker
                  value={form.data || new Date()}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                />
              )}

              {/* Seletor de Hora */}
              {showTimePicker && (
                <DateTimePicker
                  value={form.data || new Date()}
                  mode="time"
                  display="default"
                  onChange={handleTimeChange}
                />
              )}
            </View>

            {/* Pessoas */}
            <View className="space-y-2 w-[32%]">
              <View className="h-[70px] bg-interface rounded-[15px] px-4">
                <Text className="text-gray-800 mt-2 text-[14px] font-GolosText-Medium">Nº Seats</Text> 
                <TextInput 
                  className="flex-1 text-darkBlue text-[18px] font-GolosText-SemiBold"
                  onChangeText={(e) => {
                    const filteredValue = parseInt(e.replace(/[^0-9]/g, '')); 

                    setForm({ ...form, pessoas: filteredValue || 0 });
                  }}
                  value={form.pessoas ? form.pessoas.toString() : ''}
                  placeholderTextColor="#7b7b8b"
                  placeholder="Nº Seats"
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          <View className="items-center mt-8">
            <TouchableOpacity
            onPress={Createride}
            activeOpacity={0.8}
            className={`items-center justify-center w-[320px] h-[60px] ${!isFormValid() ? 'bg-gray-200' : 'bg-darkBlue' } rounded-[15px]`}
            disabled={!isFormValid()}
            >
            <Text className="text-whiteBack text-2xl font-GolosText-Medium">Create Ride</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateRide;
