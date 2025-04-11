import { View, Text, Image, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { deleteRide, addPassanger } from '../lib/appwrite';
import { icons } from '../constants';
import Dialog from 'react-native-dialog';
import { useRouter } from 'expo-router';
import { useGlobalContext } from '../context/GlobalProvider';

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
}

const RideCard = ({ ride, user, isVisible, onToggle }) => {
    const { fetchDataP, fetchDataR, fetchDataGuest, fetchRide, user: userId } = useGlobalContext();
    const router = useRouter();
    const abreviarUsername = username => username.length <= 13 ? username : username.split(" ")[0][0] + "." + username.split(" ")[1];
    const { de, para, data, pessoas, passengersId, ocupado, rideId, creator: { username, avatar, accountId, carBrand } } = ride;
    const dh = formatarDataHora(data);
    const isCreator = accountId === userId?.accountId;
    const full = pessoas === ocupado;

    const [dialogVisibleD, setDialogVisibleD] = useState(false);
    const [dialogVisibleE, setDialogVisibleE] = useState(false);

    const handleDelete = async () => {
        try {
            setDialogVisibleD(true);
        } catch (error) {
            alert('Erro', 'Falha ao deletar a viagem. Tente novamente.');
        }
    };

    const confirmDelete = async (confirmed) => {
        if (confirmed) {
            try {
                await deleteRide(rideId);
                fetchDataR();
                fetchDataP();
            } catch (error) {
                alert('Erro', 'Falha ao deletar a viagem. Tente novamente.');
            }
        }
        setDialogVisibleD(false);
    };

    const handleChat = async () => {
        try {
            await fetchRide(rideId); 
            router.push('/accountChange/ChatScreen');
        } catch (error) {
            console.error("Erro ao buscar a corrida:", error);
        }
    };

    const handleEnter = async () => {
        try {
            setDialogVisibleE(true);
        } catch (error) {
            alert('Erro', 'Falha ao deletar a viagem. Tente novamente.');
        }
    };

    const confirmEnter = async (confirmed) => {
        if (confirmed) {
            try {
                addPassanger(rideId)
                handleChat()
            } catch (error) {
                alert('Erro', 'Falha ao deletar a viagem. Tente novamente.');
            }
        }
        setDialogVisibleE(false);
    };

    return (
        <View >
            <View className="mb-4 mt-4">
                <TouchableOpacity
                    className={`flex-row bg-interface ml-4 mr-4 border-darkBlue shadow-md ${isVisible ? 'rounded-t-lg' : 'rounded-lg'}`}
                    onPress={() => {
                        if (passengersId.includes(userId?.accountId) || isCreator) {
                            handleChat();
                        } else {
                            onToggle();
                        }
                      }}
                    activeOpacity={0.8}
                >
                    {/* Left Side - Profile Section */}
                    <View className={`items-center justify-center bg-whiteBack p-5 ${isVisible ? 'rounded-t-lg' : 'rounded-lg'}`}>
                        <TouchableOpacity
                            onPress={() => {
                            if (userId?.accountId === accountId) {
                                router.push('/(tabs)/profile');
                            } else {
                                router.push('/accountChange/profileGuest');
                                fetchDataGuest(accountId);
                            }
                            }}
                            className="rounded-lg"
                        >
                            <Image source={{ uri: avatar }} className="w-16 h-16 rounded-lg" />
                        </TouchableOpacity>
                        <Text className="text-sm font-GolosText-Bold mt-2">{abreviarUsername(username)}</Text>
                        <Text className="text-gray-500 font-GolosText-Medium text-xs">{carBrand}</Text>
                    </View>

                    {/* Right Side - Ride Details */}
                    <View className="flex-1 ml-4 mr-4 justify-center">
                        <View className="flex-row items-center justify-between">
                            <Text className="text-[20px] font-GolosText-Bold text-darkBlue">{de}</Text>

                            <View className="flex-1 ms-2 me-2 h-1 bg-darkBlue rounded-lg opacity-20" />

                            <View className="flex-row items-center">
                                <Image source={icons.carSide} resizeMode="contain" className="w-[20px] h-[20px] opacity-20" />
                                <Text className="text-[20px] font-GolosText-Bold text-darkBlue ml-2">{para}</Text>
                            </View>
                        </View>

                        <View className="flex-row mr-5 items-center justify-between">
                            <View className="mt-4">
                                <Text className="text-[18px] text-center font-GolosText-Medium text-darkBlue">{dh.data}</Text>
                                <Text className="text-[16px] text-center font-GolosText-SemiBold text-darkBlue">{dh.hora}</Text>
                            </View>

                            <View className="flex-row items-center mt-2">
                                <Image source={icons.userActive} resizeMode="contain" className="w-[30px] h-[30px]" />
                                <Text className={` ml-2 font-GolosText-Bold text-[18px] ${full ? 'text-red-500' : 'text-gray-800'}`}>
                                    {ocupado}/{pessoas}
                                </Text>
                            </View>
                        </View>
                    </View>
                    {isCreator && (
                    <TouchableOpacity
                        onPress={handleDelete}
                        className="top-[106px] right-2 absolute bg-red-500 rounded-lg py-3 px-3"
                    >
                        <Image source={icons.trash} className="w-6 h-6 opacity-50"/>
                    </TouchableOpacity>
                    )}
                </TouchableOpacity>

                {/* Botão para entrar na Ride */}
                {isVisible && !full && !isCreator && !passengersId.includes(userId?.accountId) && (
                    <TouchableOpacity
                        className="ml-4 mr-4 bg-darkBlue rounded-b-lg py-6 px-4"
                        onPress={handleEnter}
                        activeOpacity={0.8}
                    >
                        <Text className="text-white text-center text-[20px] font-GolosText-SemiBold">Enter Ride</Text>
                    </TouchableOpacity>
                )}

                {!isCreator && passengersId.includes(userId?.accountId) && (
                    <View
                        className="ml-4 mr-4 bg-green-200 rounded-b-lg py-2 px-4"
                    >
                        <Text className="text-darkBlue text-center text-[20px] font-GolosText-SemiBold">You are in this ride</Text>
                    </View>
                )}

            </View>
            {/* Custom Dialog for Deleting Ride */}
            <Dialog.Container visible={dialogVisibleD}>
                <Dialog.Title>Delete Ride</Dialog.Title>
                <Dialog.Description>Are you sure you want to delete this Ride?</Dialog.Description>
                <Dialog.Button label="Cancel" className="font-GolosText-SemiBold" color={'#000000'} onPress={() => confirmDelete(false)} />
                <Dialog.Button label="Delete" className="font-GolosText-SemiBold" color={'#ef4444'} onPress={() => confirmDelete(true)} />
            </Dialog.Container>

            {/* Custom Dialog for Entering Ride */}
            <Dialog.Container visible={dialogVisibleE}>
                <Dialog.Title>Enter Ride</Dialog.Title>
                <Dialog.Description>Are you sure you want to enter this Ride?</Dialog.Description>
                <Dialog.Button label="Cancel" className="font-GolosText-SemiBold" color={'#000000'} onPress={() => confirmEnter(false)} />
                <Dialog.Button label="Enter" className="font-GolosText-SemiBold" color={'#4ade80'} onPress={() => confirmEnter(true)} />
            </Dialog.Container>
        </View>
    );
};

export default RideCard;
