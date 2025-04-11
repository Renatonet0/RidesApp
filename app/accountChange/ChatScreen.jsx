import React, { useState, useEffect, useRef } from 'react';
import { View, Alert, Modal, TouchableWithoutFeedback, Text, TextInput, FlatList, Image, SafeAreaView, TouchableOpacity } from 'react-native';
import { useGlobalContext } from '../../context/GlobalProvider';
import { getUser, putMessage, removePassanger, client, config, getMessages, getPassengers } from '../../lib/appwrite';
import { icons } from '../../constants'; 
import { useRouter } from 'expo-router';
import Loading from '../../components/Loading';
import { Keyboard } from 'react-native';
import Dialog from 'react-native-dialog';

const ChatScreen = () => {

  const [height, setHeight] = useState(16);

  const flatListRef = useRef(null);
  const router = useRouter();
  const { user, ride, fetchRide, fetchDataGuest, fetchDataP, fetchDataR } = useGlobalContext();
  const [newMessage, setNewMessage] = useState("");
  const dh = formatarDataHora(ride?.data);
  function abreviarUsername(username) {
    return username.length <= 13 ? username : username.split(" ")[0][0] + "." + username.split(" ")[1];
  }
  const [isLoading, setIsLoading] = useState(true);
  const [showLoading, setShowLoading] = useState(true);

  const isCreator = ride?.creator?.accountId === user?.accountId;
  const [selectedPassenger, setSelectedPassenger] = useState(null); 
  const [menuVisible, setMenuVisible] = useState(false); 
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [messages, setMessages] = useState([]);
  const [passengers, setPassengers] = useState([])

  const [dialogVisibleL, setDialogVisibleL] = useState(false);

  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setShowLoading(false);
      }, 1000);
      fetchRide(ride?.rideId);
      return () => clearTimeout(timer); 
    } else {
      setShowLoading(false);
    }
  }, [isLoading]);
  

  const handleContentSizeChange = (contentWidth, contentHeight) => {
    setHeight(contentHeight);  
  };


  const handleOpenMenu = (passenger, event) => {
    setSelectedPassenger(passenger);

    const { pageX, pageY } = event.nativeEvent;
    setMenuPosition({ x: pageX, y: pageY });
    setMenuVisible(true); 
  };


  const handleCloseMenu = () => {
    setSelectedPassenger(null);
    setMenuVisible(false); 
  };


  const handleLeave = async () => {
    try {
        setDialogVisibleL(true);
    } catch (error) {
        alert('Erro', 'Falha ao deletar a viagem. Tente novamente.');
    }
  };


  const leaveRide = async (confirm) => {
    if (confirm) {
      try {
        await removePassanger(ride?.rideId, user?.accountId);
        fetchRide(ride?.rideId)
        fetchDataP()
        fetchDataR("","")
        router.back()
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
    setDialogVisibleL(false);
  };


  useEffect(() => {
    getM()
    getP()

    if (ride?.rideId) {
      const unsubscribe = client.subscribe(
        [`databases.${config.databaseId}.collections.${config.ridesCollectionId}.documents.${ride?.rideId}`],
        (response) => {
          if (response.events.includes("databases.*.collections.*.documents.*.update")) {
            getM()
            getP()
          }
        }
      );
      return () => unsubscribe(); 
    }
  }, []);


  const getM = async () => {
    try {
      const rawMessages = await getMessages(ride?.rideId); // Supondo que retorna as mensagens no formato esperado
      const detailedMessages = await Promise.all(
        rawMessages.map(async (message) => {
          const parts = message.split(/,(?![^(]*\))/).map((s) => s.trim().replace(/[()]/g, ""));
          const accountId = parts[0]; 
          const username = parts[1]; 
          const text = parts[2]; 
          const timestamp = parts[3]; 
  
          let user = null;
          try {
            user = await getUser(accountId); 
          } catch (error) {
            console.error(`Error fetching user details for ID ${accountId}:`, error);
          }
  
          return {
            accountId,
            username: user?.username || username || "Unknown", 
            avatar: user?.avatar || "", 
            text,
            timestamp,
          };
        })
      );
      setMessages(detailedMessages); 
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };
  

  const getP = async () => {
    try {
      const passengerIds = await getPassengers(ride?.rideId); 
      const passengerDetails = await Promise.all(
        passengerIds.map(async (id) => {
          const user = await getUser(id); 
          return {
            accountId: id,
            username: user?.username || "Unknown", 
            avatar: user?.avatar || "", 
          };
        })
      );
      setPassengers(passengerDetails); 
    } catch (error) {
      console.error("Error fetching passengers:", error);
    }
  };
  

  function formatarDataHora(dataString) {
    
    const data = new Date(dataString);

    const meses = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    const dia = data.getUTCDate();
    const mes = meses[data.getUTCMonth()];

    const horas = String(data.getUTCHours()).padStart(2, '0');
    const minutos = String(data.getUTCMinutes()).padStart(2, '0');

    const dataFormatada = `${dia} ${mes}`;
    const horaFormatada = `${horas}:${minutos}h`;

    return { data: dataFormatada, hora: horaFormatada };
  };


  const SendMessage = async () => {
    if (newMessage.trim() === "") { return }

    const m = user?.accountId + "," + user?.username + ",(" + newMessage.trim() + ")," + new Date().toISOString()

    try {
      Keyboard.dismiss();
      setNewMessage("");
      await putMessage(ride?.rideId, m);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };


  const removePassenger = async (id) => {
    try {
      await removePassanger(ride?.rideId, id);
      fetchRide(ride?.rideId)
      fetchDataP()
      fetchDataR("","")
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };


  return (
    <SafeAreaView className="flex-1 bg-whiteBack h-full ">
      {showLoading ? ( <Loading /> ) : (
        <>
      <View className="flex-1">
        <View className="">
        <View className="mt-16 items-center m-4 justify-between flex-row">
            {/* Seta no início */}
            <TouchableOpacity 
              onPress={() => {router.back('../(tabs)/rides'), fetchDataR("","")}}
              activeOpacity={0.8}
            >
              <View className="w-[50px] h-[50px] items-center justify-center rounded-[10px] bg-interface">
                <Image source={icons.arrowBlackLeft} 
                  className="w-[25px] h-[25px]"
                  resizeMode="contain"
                />
              </View>
            </TouchableOpacity>
            
            {!isCreator && (
            <View className="items-center justify-center">
              <TouchableOpacity 
              onPress={() => handleLeave()}
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
            )}
          </View>
          <View className="flex-row bg-interface mt-2 border-darkBlue shadow-md rounded-lg">
            {/* Left Side - Profile Section */}
            <View className="items-center justify-center bg-whiteBack p-5 rounded-lg">
              <TouchableOpacity
                onPress={() => {
                  if (ride?.creator?.accountId === user?.accountId) {
                    router.push('../(tabs)/profile');
                  } else {
                  router.push('/accountChange/profileGuest');
                  fetchDataGuest(ride?.creator?.accountId);
                  }
                }}
                className="rounded-lg"
              >
                <Image source={{ uri: ride?.creator?.avatar }} className="w-16 h-16 rounded-lg" />
              </TouchableOpacity>
              <Text className="text-sm font-GolosText-Bold mt-2">{abreviarUsername(ride?.creator?.username)}</Text>
              <Text className="text-gray-500 font-GolosText-Medium text-xs">{ride?.creator?.carBrand}</Text>
            </View>

            {/* Right Side - Ride Details */}
            <View className="flex-1 ml-4 mr-4 justify-center">
              <View className="flex-row items-center justify-between">
                <Text className="text-[20px] font-GolosText-Bold text-darkBlue">{ride?.de}</Text>

                <View className="flex-1 ms-2 me-2 h-1 bg-darkBlue rounded-lg opacity-20" />

                <View className="flex-row items-center">
                  <Image source={icons.carSide} resizeMode="contain" className="w-[20px] h-[20px] opacity-20" />
                  <Text className="text-[20px] font-GolosText-Bold text-darkBlue ml-2">{ride?.para}</Text>
                </View>
              </View>

              <View className="flex-row mr-5 items-center justify-between">
                <View className="mt-4">
                  <Text className="text-[18px] text-center font-GolosText-Medium text-darkBlue">{dh.data}</Text>
                  <Text className="text-[16px] text-center font-GolosText-SemiBold text-darkBlue">{dh.hora}</Text>
                </View>

                <View className="flex-row items-center mt-2">
                  <Image source={icons.userActive} resizeMode="contain" className="w-[30px] h-[30px]" />
                  <Text className="text-gray-800 ml-2 font-GolosText-Bold text-[18px]">
                    {ride?.ocupado}/{ride?.pessoas}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View className=" mt-2 h-36">
            <Text className="text-[20px] font-GolosText-Bold text-darkBlue ml-3 mb-2">Passengers</Text>
            <FlatList
              data={passengers}
              horizontal
              className="bg-interface rounded-b-lg"
              keyExtractor={(item) => item.accountId}
              renderItem={({ item }) => {  
                return (
                  <TouchableOpacity
                    onPress={() => {
                      if (item.accountId === user?.accountId) {
                        router.push('../(tabs)/profile');
                      } else {
                      router.push('/accountChange/profileGuest');
                      fetchDataGuest(item.accountId);
                      }
                    }}
                    onLongPress={(event) => {
                      if (isCreator) {
                        handleOpenMenu(item, event)}
                      }}
                    className="items-center justify-center mx-2"
                  >
                    <Image
                      source={{ uri: item.avatar }}
                      className="w-16 h-16 rounded-lg"
                    />
                    <Text className="text-[14px] text-darkBlue font-GolosText-Medium mt-2">
                      {item.username}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
          <Modal
            transparent
            visible={menuVisible}
            animationType="fade"
            onRequestClose={handleCloseMenu} // Fecha o menu ao clicar fora
          >
            <TouchableWithoutFeedback onPress={handleCloseMenu}>
              <View className="flex-1 justify-center items-cente">
                <TouchableWithoutFeedback>
                  <View 
                    style={{
                      position: 'absolute',
                      top: menuPosition.y - 40,
                      left: menuPosition.x,
                      backgroundColor: 'white',
                      borderRadius: 8,
                      padding: 16,
                    }}
                    className="rounded-lg p-4">
                    <TouchableOpacity
                      title="Ban Passenger"
                      className="rounded-lg w-36 h-12 bg-red-500"
                      onPress={() => {
                        banPassenger(selectedPassenger?.accountId); 
                        Alert.alert("Passenger banned successfully.");
                        handleCloseMenu(); 
                      }}>
                      <Text className="text-[15px] text-center mt-3 text-darkBlue font-GolosText-Medium">Ban</Text>
                    </TouchableOpacity>
                    <View style={{ marginVertical: 10 }} />
                    <TouchableOpacity
                      title="Remove Passenger"
                      className="rounded-lg w-36 h-12 bg-red-500"
                      onPress={() => {
                        removePassenger(selectedPassenger?.accountId); 
                        Alert.alert("Passenger removed successfully.");
                        handleCloseMenu(); 
                      }}>
                        <Text className="text-[15px] text-center mt-3 text-darkBlue font-GolosText-Medium">Remove</Text>
                    </TouchableOpacity>
                    <View style={{ marginVertical: 10 }} />
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </View>
        <FlatList
          className="p-2"
          ref={flatListRef}
          data={messages}
          keyExtractor={(item, index) => `${item.accountId}-${index}`}
          renderItem={({ item, index }) => {
            const { accountId, username, avatar, text, timestamp } = item;
            const isCurrentUser = accountId === user?.accountId;

            // Format date
            const date = new Date(timestamp);
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const formattedDate = `${hours}:${minutes}`;

            // Check if the previous message is from the same user
            const isSameUserAsPrev =
              index > 0 &&
              messages[index - 1]?.accountId === accountId;

            return (
                <View className="mb-1">
                  {/* Show Avatar and Username if not the same user as the previous message */}
                  {!isSameUserAsPrev && (
                    <View className={`flex-row ${isCurrentUser ? 'justify-end' : 'justify-start'} items-center mb-2`}>
                      {!isCurrentUser ? (
                        <>
                        <View
                          className="rounded-lg mt-6">
                          <Image source={{ uri: avatar }} className="w-10 h-10 rounded-lg"  />
                        </View>
                        <Text className="ml-2 mt-6 font-GolosText-Bold text-[14px] text-darkBlue">
                          {abreviarUsername(username)}
                        </Text>
                        </>
                        ) : (
                        <>
                        <Text className="mr-2 font-GolosText-Bold text-[14px] text-darkBlue">
                          {abreviarUsername(username)}
                        </Text>
                        <Image source={{ uri: avatar }} className="w-10 h-10 rounded-lg" />
                        </>
                      )}
                    </View>
                  )}
                  {/* Message Bubble */}
                  <View
                    className={`${isCurrentUser ? 'self-end bg-darkBlue mr-8' : 'self-start bg-interface ml-8 '} items-center flex-row rounded-lg ${text.length>6 ? 'pb-7 pt-4' : 'pb-4 pt-4' } px-4 max-w-[80%]`}
                  >
                    <Text
                      className={`${isCurrentUser ? 'text-whiteBack' : 'text-darkBlue'} ${text.length>6 ? '' : 'mr-8' } text-[15px] text-center font-GolosText-Medium`}
                    >
                      {text}
                    </Text> 
                    
                    <Text className={` ${text.length>6 ? 'absolute bottom-2 right-2' : 'absolute bottom-2 right-2' } text-[10px] text-gray-400`}>{formattedDate}</Text>
                  </View>
                </View>
            );
          }}
          initialScrollIndex={messages.length > 0 ? messages.length - 1 : 0}
          getItemLayout={(data, index) => ({
            length: 80,
            offset: 100 * index,
            index,
          })}
          ListEmptyComponent={() => (
            <View className="flex-1 items-center justify-center mt-10">
              <Text className="text-gray-500 mb-4 text-[16px] font-GolosText-Medium">
                Começa a conversar
              </Text>
              <Image source={icons.chat} className="w-[40px] h-[40px] opacity-30" resizeMode="contain"/>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 20 }} 
          onContentSizeChange={() => {

            flatListRef.current?.scrollToEnd({ animated: true });
          }}
        />

        <View className="flex-row items-center justify-between p-5 mx-4 mb-5 bg-interface h-auto rounded-lg">
          <TextInput 
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type a message"
            multiline={true}
            onContentSizeChange={handleContentSizeChange}
            className={`text-darkBlue text-[18px] font-GolosText-SemiBold max-h-36 h-${Math.max(16, height)} w-[80%]`}
          />
          <TouchableOpacity onPress={SendMessage} activeOpacity={0.8}>
            <Image 
              source={icons.send}
              className={`w-[25px] h-[25px] ${newMessage.trim() === "" ? 'opacity-35' : 'opacity-100'}`}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>
      </>)}
      {/* Custom Dialog for leaving Ride */}
      <Dialog.Container visible={dialogVisibleL}>
        <Dialog.Title>Leave Ride</Dialog.Title>
        <Dialog.Description>Are you sure you want to leave this Ride?</Dialog.Description>
        <Dialog.Button label="Cancel" className="font-GolosText-SemiBold" color={'#000000'} onPress={() => leaveRide(false)} />
        <Dialog.Button label="Leave" className="font-GolosText-SemiBold" color={'#ef4444'} onPress={() => leaveRide(true)} />
      </Dialog.Container>
    </SafeAreaView>
  );
};

export default ChatScreen;
