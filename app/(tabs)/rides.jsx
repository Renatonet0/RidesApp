import React, { useState, useEffect } from 'react';
import { SafeAreaView, TouchableWithoutFeedback, FlatList, View, Image, RefreshControl, Alert, StatusBar } from 'react-native';
import SearchInput from '../../components/SearchInput';
import { icons } from '../../constants'; 
import EmptyState from '../../components/EmptyState'; 
import RideCard from '../../components/RideCard'; 
import { useGlobalContext } from '../../context/GlobalProvider';

const Rides = () => {

  const [visibleRideId, setVisibleRideId] = useState(null);

  const { dataR, fetchDataR } = useGlobalContext();
  const [form, setForm] = useState({
    de: '',
    para: ''
  });
  const [refreshing, setRefreshing] = useState(false);

  
  useEffect(() => {
    fetchDataR(form.de, form.para);
  }, [form.de, form.para]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDataR(form.de, form.para);
    setRefreshing(false);
  };

  const dismissVisibleButton = () => {
    setVisibleRideId(null); 
};

  return (
    <TouchableWithoutFeedback onPress={dismissVisibleButton}>
      <SafeAreaView className="flex-1 bg-whiteBack h-full ">
        <View className="mt-16 h-[20vh] bg-whiteBack rounded-[25px] px-4">
            <View className="mb-2">
              <Image
                source={icons.logoBlue}
                className="w-[50px] h-[50px]"
                resizeMode="contain"
              />
            </View>

            <View className="flex-row mt-4 items-center justify-center">
              <SearchInput 
                title="From"
                placeholder="From" 
                value={form.de}
                handleChangeText={(e) => setForm({ ...form, de: e })}
              />
              <Image
                source={icons.arrowRight}
                className="w-[25px] h-[25px]"
                resizeMode="contain"
              />
              <SearchInput 
                title="To"
                placeholder="To" 
                value={form.para}
                handleChangeText={(e) => setForm({ ...form, para: e })}
              />
            </View>
          </View>
        <FlatList
          className="bg-whiteBack"
          data={dataR}
          renderItem={({ item }) => (
            <RideCard
              ride={item}
              isVisible={visibleRideId === item.rideId}
              onToggle={() =>
                setVisibleRideId(visibleRideId === item.rideId ? null : item.rideId)
              }
            />
          )}
          keyExtractor={(item) => item.rideId}
          ListEmptyComponent={() => (<EmptyState title="No Rides Found" /> )}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

export default Rides;
