import React from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import { Tabs, Redirect } from 'expo-router';
import { StatusBar } from 'expo-status-bar'

import { icons } from '../../constants';

const TabIcon = ({icon, color, name, focused}) => {
    return (
        <View className="items-center mt-7 w-40 gap-2" >
            <Image 
                source={icon}
                resizeMode="contain"
                tintColor={color}
                className="w-9 h-9"
            />
            <Text
				style={{
					textAlign: 'center',
					fontSize: 14,
					fontFamily: focused ? 'GolosText-Bold' : 'GolosText-Regular',
					color: color,
				}}>
				{name}
			</Text>
        </View>
    )
}

const TabsLayout = () => {
  return (
<>
	<Tabs 
		screenOptions={{
		tabBarButton: (props) => <TouchableOpacity {...props} />,
		tabBarShowLabel: false,
		tabBarActiveTintColor: '#393939',
    	tabBarHideOnKeyboard: true,
		tabBarStyle: {
			backgroundColor: '#ffffff',
			height: 84,
			borderTopLeftRadius: 15,
			borderTopRightRadius: 15
		}
		}}
	>

	<Tabs.Screen 
		name="createRide"
		options={{
		headerShown: false,
		title: 'Create Ride',
		tabBarIcon: ({color, focused}) => (
			<TabIcon 
				icon={focused ? icons.trackActive : icons.track}
				color={color}
				name="Create Ride"
				focused={focused}
			/>)
		}}
	/>

    <Tabs.Screen 
			name="rides"
			options={{
			headerShown: false,
			title: 'Rides',
			tabBarIcon: ({color, focused}) => (
				<TabIcon 
				icon={focused ? icons.carActive : icons.car}
					color={color}
					name="Rides"
					focused={focused}
				/>)
			}}
		/>

		<Tabs.Screen 
			name="profile"
			options={{
			headerShown: false,
			title: 'Profile',
			tabBarIcon: ({color, focused}) => (
				<TabIcon 
					icon={focused ? icons.userActive : icons.user}
					color={color}
					name="Acount"
					focused={focused}
				/>)
			}}
		/>
	  </Tabs>
	  <StatusBar backgroundColor='#ffffff' />
  </>
  )
}

export default TabsLayout