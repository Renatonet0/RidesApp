import { View, Text, Image, TouchableOpacity  } from 'react-native'
import { useRouter } from 'expo-router'
import React from 'react'

import { icons } from '../constants'

const EmptyState = () => {
  const router = useRouter();  

  const handleCreateRide = () => {
    router.replace('../(tabs)/createRide'); 
  };

  return (
    <View className="justify-center items-center px-4">
      <Image source={icons.glass} className="mt-16 w-[110px] h-[110px] opacity-15" resizeMethod='contain'>

      </Image>
      <Text className="text-darkBlue text-3xl mt-10 font-GolosText-SemiBold opacity-15">No Rides Found</Text>
    </View>
  )
}

export default EmptyState