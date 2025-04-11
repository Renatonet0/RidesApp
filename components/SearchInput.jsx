import { View, TextInput, Text } from 'react-native';
import React, { useState } from 'react'


const SearchInput = ({value,placeholder,handleChangeText,title}) => {

  const [showPassword, setShowPassword] = useState(false)

  return (
    <View className="space-y-2">

      <View className="w-[170px] h-[60px] mr-2 ml-2 px-4 bg-interface rounded-[15px] items-center flex-row"> 
        <View className="w-full">
          <Text className="text-gray-800 mt-2 text-[12px] font-GolosText-Medium">{title}</Text>
          <TextInput 
            className="flex-1 text-darkBlue text-[18px] font-GolosText-SemiBold"
            value={value}
            placeholder={placeholder}
            placeholderTextColor="#7b7b8b"
            onChangeText={handleChangeText}
          />
        </View>
      </View>
    </View>
  );
};

export default SearchInput;
