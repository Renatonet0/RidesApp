import React, { useState, useEffect } from 'react';
import { Text, SafeAreaView, FlatList, View, Image, RefreshControl, Alert, TouchableOpacity } from 'react-native'; 
import { icons } from '../../constants'; 
import EmptyState from '../../components/EmptyState'; 
import RideCard from '../../components/RideCard'; 
import { useGlobalContext } from '../../context/GlobalProvider';
import { useRouter } from 'expo-router';
import Loading from '../../components/Loading';


const Profile = () => {

  const router = useRouter(); 
  const { dataP, fetchDataP } = useGlobalContext();
  const [isLoading, setIsLoading] = useState(false);
  const { user, setUser, setIsLoggedIn } = useGlobalContext();
  const [isDriver, setIsDriver] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user?.$id) {  
      fetchDataP();
    }
  }, [user?.$id]);

  const onRefresh = async () => {
    
    await fetchDataP();
  };

  function calcularIdade(dataNascimentoString) {
    
    const dataNascimento = new Date(dataNascimentoString);
    const dataAtual = new Date();
    
    let idade = dataAtual.getFullYear() - dataNascimento.getFullYear();
    
    const mesAtual = dataAtual.getMonth();
    const mesNascimento = dataNascimento.getMonth();
    const diaAtual = dataAtual.getDate();
    const diaNascimento = dataNascimento.getDate();
  
    if (mesAtual < mesNascimento || (mesAtual === mesNascimento && diaAtual < diaNascimento)) {
      idade--;
    }
  
    return idade;
  }

  return (
    <SafeAreaView className="flex-1 bg-interface">
      {isLoading ? ( <Loading /> ) : (
        <>
      <View className="mt-16 bg-interface rounded-[25px] px-4">
        <View className="mb-10 items-center justify-between flex-row">
          <Image
            source={icons.logoBlue}
            className="w-[50px] h-[50px]"
            resizeMode="contain"
          />
          <TouchableOpacity 
            onPress={() => router.push('../accountChange/acount')}
            activeOpacity={0.8} >

            <Image source={icons.setting} 
            className="w-[30px] h-[30px]"
            resizeMode="contain"/>

          </TouchableOpacity>
        </View>

        <View className="flex-row items-start justify-start bg-interface rounded-[25px]">
          <Image
            source={{ uri: user?.avatar }}
            className="w-[80px] h-[80px] rounded-lg"
            resizeMode='cover'
          />
          
          <View className="ml-2 mt-2 mb-9">
            <Text className={`text-3xl text-darkBlue mb-4 'text-center'} font-GolosText-Bold`}>
              {user?.username},{user?.car ? ' ': '\n'}{calcularIdade(user?.birthdate)}
            </Text>
            {/* Condicional para mostrar ou esconder o carBrand */}
            {user?.car && user?.carBrand && (
              <Text className="text-darkBlue text-[20px] font-GolosText-Medium">{user?.carBrand}
              </Text>
            )}
          </View>
        </View>

        <View className="flex-row">
          <View className="w-[280px] h-[100px] flex-row items-center justify-center bg-white rounded-lg">
            <View className="">
              <Text className="text-2xl text-darkBlue mb-[8px] font-GolosText-SemiBold">Trips</Text>
              <Text className="text-darkBlue text-[20px] text-center font-GolosText-Bold">{isDriver ? user?.tripsD : user?.tripsP}</Text>
            </View>

            <View className="ml-6 bg-">
              <View className="flex-row">
                <Image 
                  source={(user?.rating >= 4.5 && user?.rating < 5 ? icons.starHalf : (user?.rating >= 4.5 ? icons.star : icons.starBack))} 
                  className="w-[20px] h-[20px] ml-2 mt-[5px] mb-[10px]"
                  resizeMode="contain"
                />
                <Image 
                  source={(user?.rating >= 4.5 && user?.rating < 5 ? icons.starHalf : (user?.rating >= 4.5 ? icons.star : icons.starBack))}
                  className="w-[20px] h-[20px] ml-[4px] mt-[5px] mb-[10px]"
                  resizeMode="contain"
                />
                <Image 
                  source={(user?.rating >= 4.5 && user?.rating < 5 ? icons.starHalf : (user?.rating >= 4.5 ? icons.star : icons.starBack))}
                  className="w-[20px] h-[20px] ml-[4px] mt-[5px] mb-[10px]"
                  resizeMode="contain"
                />
                <Image 
                  source={(user?.rating >= 4.5 && user?.rating < 5 ? icons.starHalf : (user?.rating >= 4.5 ? icons.star : icons.starBack))}
                  className="w-[20px] h-[20px] ml-[4px] mt-[5px] mb-[10px]"
                  resizeMode="contain"
                />
                <Image 
                  source={(user?.rating >= 4.5 && user?.rating < 5 ? icons.starHalf : (user?.rating >= 4.5 ? icons.star : icons.starBack))}
                  className="w-[20px] h-[20px] ml-[4px] mt-[5px] mb-[10px]"
                  resizeMode="contain"
                />
              </View>

              <Text className="text-darkBlue text-[20px] text-center font-GolosText-Bold">{user?.rating}</Text>
            </View>
          </View>

          {/* Botão para alternar entre Condutor e Passageiro */}
          <View className="justify-center ml-3">
            <View className="items-center justify-center">
              <TouchableOpacity 
                onPress={() => setIsDriver(true)} 
                className={`justify-center items-center ${isDriver ? 'bg-darkBlue' : 'bg-white'} w-[100px] h-[50px] rounded-t-lg`}
              >
                <Text className={`text-center text-[16px] font-GolosText-SemiBold ${!isDriver ? 'text-darkBlue' : 'text-white'} `}>Driver</Text>
              </TouchableOpacity>
            </View>

            <View className="items-center justify-center">
              <TouchableOpacity 
                onPress={() => setIsDriver(false)} 
                className={`justify-center items-center ${!isDriver ? 'bg-darkBlue' : 'bg-white'} w-[100px] h-[50px] rounded-b-lg`}
              >
                <Text className={`text-center text-[16px] font-GolosText-SemiBold ${isDriver ? 'text-darkBlue' : 'text-white'}`}>Passanger</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Decrição */}
        {user?.description ? (
          <View className="mt-4 p-4 bg-lightGray rounded-lg">
            <Text className="text-darkBlue text-[20px] mb-3 font-GolosText-Bold">Description</Text>
            <Text className="text-darkBlue text-lg mb-4 font-GolosText-Medium">
              {user.description}
            </Text>
          </View>
        ) : (
          <View className="mt-10" /> 
        )}
      </View>

      <FlatList
        className="bg-whiteBack"
        data={dataP}
        renderItem={({ item }) => 
          <RideCard ride={item} user={user} />}
        keyExtractor={(item) => item.rideId}
        ListEmptyComponent={() => (
          <EmptyState title="No Rides Found" />
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
      </>
      )}
    </SafeAreaView>
  );
}

export default Profile;
