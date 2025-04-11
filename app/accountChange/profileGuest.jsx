import React, { useState, useEffect } from 'react';
import { Text, SafeAreaView, FlatList, View, Image, Modal, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { getUser, sendRating } from '../../lib/appwrite'; 
import { icons } from '../../constants'; 
import EmptyState from '../../components/EmptyState'; 
import RideCard from '../../components/RideCard'; 
import { useGlobalContext } from '../../context/GlobalProvider';
import { useRouter, useGlobalSearchParams } from 'expo-router';
import Loading from '../../components/Loading';


const profileGuest = () => {

  const router = useRouter(); 
  const [visibleRideId, setVisibleRideId] = useState(null);
  const { dataG, userGuest, isLoading, fetchDataGuest } = useGlobalContext();
  const [isDriver, setIsDriver] = useState(true);

  const [isMenuVisible, setMenuVisible] = useState(false);
  const [selectedRating, setSelectedRating] = useState(null);

  const handleOpenMenu = () => setMenuVisible(true);

  const handleCloseMenu = async () => {
    setMenuVisible(false);
    await sendRating(userGuest?.accountId, selectedRating);
    fetchDataGuest(userGuest?.accountId);
  }

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
          <TouchableOpacity 
            onPress={() => router.back()}
            activeOpacity={0.8}
            >
            <View className="w-[50px] h-[50px] items-center justify-center rounded-lg bg-whiteBack">
              <Image source={icons.arrowBlackLeft} 
                className="w-[25px] h-[25px]"
                resizeMode="contain"
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            className="bg-white  rounded-lg w-[50px] h-[50px] items-center justify-center"
            onPress={handleOpenMenu}
          >
            <Image source={icons.star} className="w-[20px] h-[20px]" resizeMode="contain"/>
          </TouchableOpacity>
        </View>

        <View className="flex-row items-start justify-start bg-interface rounded-[25px]">
          <Image
            source={{ uri: userGuest?.avatar }}
            className="w-[80px] h-[80px] rounded-lg"
            resizeMode='cover'
          />
          
          <View className="ml-2 mt-2 mb-9">
            <Text className={`text-3xl text-darkBlue mb-4 'text-center'} font-GolosText-Bold`}>
              {userGuest?.username},{userGuest?.car ? ' ': '\n'}{calcularIdade(userGuest?.birthdate)}
            </Text>
            {/* Condicional para mostrar ou esconder o carBrand */}
            {userGuest?.car && userGuest?.carBrand && (
              <Text className="text-darkBlue text-[20px] font-GolosText-Medium">{userGuest?.carBrand}
              </Text>
            )}
          </View>
        </View>

        <View className="flex-row">
          <View className="w-[280px] h-[100px] flex-row items-center justify-center bg-white rounded-lg">
            <View className="">
              <Text className="text-2xl text-darkBlue mb-[8px] font-GolosText-SemiBold">Trips</Text>
              <Text className="text-darkBlue text-[20px] text-center font-GolosText-Bold">{isDriver ? userGuest?.tripsD : userGuest?.tripsP}</Text>
            </View>

            <View className="ml-6">
              <View className="flex-row">
                <Image 
                  source={(userGuest?.rating >= 0.5 && userGuest?.rating < 1 ? icons.starHalf : (userGuest?.rating >= 0.5 ? icons.star : icons.starBack))} 
                  className="w-[20px] h-[20px] ml-2 mt-[5px] mb-[10px]"
                  resizeMode="contain"
                />
                <Image 
                  source={(userGuest?.rating >= 1.5 && userGuest?.rating < 2 ? icons.starHalf : (userGuest?.rating >= 1.5 ? icons.star : icons.starBack))} 
                  className="w-[20px] h-[20px] ml-[4px] mt-[5px] mb-[10px]"
                  resizeMode="contain"
                />
                <Image 
                  source={(userGuest?.rating >= 2.5 && userGuest?.rating < 3 ? icons.starHalf : (userGuest?.rating >= 2.5 ? icons.star : icons.starBack))} 
                  className="w-[20px] h-[20px] ml-[4px] mt-[5px] mb-[10px]"
                  resizeMode="contain"
                />
                <Image 
                  source={(userGuest?.rating >= 3.5 && userGuest?.rating < 4 ? icons.starHalf : (userGuest?.rating >= 3.5 ? icons.star : icons.starBack))} 
                  className="w-[20px] h-[20px] ml-[4px] mt-[5px] mb-[10px]"
                  resizeMode="contain"
                />
                <Image 
                  source={(userGuest?.rating >= 4.5 && userGuest?.rating < 5 ? icons.starHalf : (userGuest?.rating >= 4.5 ? icons.star : icons.starBack))} 
                  className="w-[20px] h-[20px] ml-[4px] mt-[5px] mb-[10px]"
                  resizeMode="contain"
                />
              </View>

              <Text className="text-darkBlue text-[20px] text-center font-GolosText-Bold">{userGuest?.rating}</Text>
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
        {userGuest?.description ? (
          <View className="mt-4 p-4 bg-lightGray rounded-lg">
            <Text className="text-darkBlue text-[20px] mb-3 font-GolosText-Bold">Description</Text>
            <Text className="text-darkBlue text-lg mb-4 font-GolosText-Medium">
              {userGuest?.description}
            </Text>
          </View>
        ) : (
          <View className="mt-10" />  // View vazia com margem se não houver descrição
        )}
      </View>

      <FlatList
        className="bg-whiteBack"
        data={dataG}
        renderItem={({ item }) => 
        <RideCard 
          ride={item}
          isVisible={visibleRideId === item.rideId}
          onToggle={() =>
            setVisibleRideId(visibleRideId === item.rideId ? null : item.rideId)
          }
        />}
        ListEmptyComponent={() => (
          <EmptyState title="No Rides Found" />
        )}
      />
      <Modal
        visible={isMenuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseMenu}
      >
        <TouchableWithoutFeedback onPress={handleCloseMenu}>
          <View className="flex-1 bg-[rgba(0,0,0,0.5)] justify-center items-center">
            <TouchableWithoutFeedback>
              <View className="w-[300px] p-5 bg-white rounded-lg items-center">
                <Text className="text-lg font-bold mb-4">Give Rating</Text>
                <View className="flex-row justify-between w-full mb-5">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <TouchableOpacity
                      key={rating}
                      className="items-center justify-center"
                      onPress={() => setSelectedRating(rating)}
                    >
                      <Image
                        source={
                          selectedRating >= rating
                            ? icons.star
                            : icons.starBack 
                        }
                        className="w-[30px] h-[30px]"
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                  ))}
                </View>
                <TouchableOpacity
                  className="bg-darkBlue py-2 px-5 rounded-md"
                  onPress={handleCloseMenu}
                >
                  <Text className="text-white text-base">Submit</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      </>
      )}
    </SafeAreaView>
  );
}

export default profileGuest;
