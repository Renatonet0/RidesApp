import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react'

import { icons } from '../constants'


const FormField = ({title,value,placeholder,handleChangeText,otherStyles,secureTextEntry,...props}) => {

  const [showPassword, setShowPassword] = useState(false)

  return (
    <View className={`space-y-2 ${otherStyles} ${title}`}>
      <View className="w-[92vw] h-[9vh] px-4 bg-interface rounded-[15px] items-center flex-row">
        <View className="w-full">
          <Text className="text-gray-800 mt-2 text-[14px] font-GolosText-Medium">{title}</Text> 
            <View className="flex-1 flex-row items-start justify-between">
              <TextInput 
                className="flex-1 text-darkBlue mt-2 text-[18px] font-GolosText-SemiBold"
                value={value}
                placeholder={placeholder}
                placeholderTextColor="#7b7b8b"
                onChangeText={handleChangeText}
                secureTextEntry={title === 'Password' && !showPassword}
              />
              {title === 'Password'  && (
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Image source={!showPassword ? icons.eyeHide : icons.eye}
                    className="w-[6vw] h-[6vw] opacity-40" resizeMode='contain'
                  />
                </TouchableOpacity>
              )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default FormField;
