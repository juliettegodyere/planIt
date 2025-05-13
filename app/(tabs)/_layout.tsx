import {Platform, View} from 'react-native'
import { Tabs } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import AntDesignIcon from "@expo/vector-icons/AntDesign";
import SearchItems from '../../components/SearchItem'

export default function TabsLayout() {
  return (
    <Tabs
        screenOptions={{
            headerShown: true,
            tabBarStyle: Platform.select({
            ios: {
                position: 'absolute',
            },
            default: {},
            }),
        }}
        >
        <Tabs.Screen
                name="index"
                options={{
                    tabBarIcon: ({ color }) => <AntDesignIcon size={28} name="home" color={color} />,
                    header: () => <SearchItems />, 
                    headerTitleAlign: "center", 
                }}
            />
            <Tabs.Screen
                name="history"
                options={{
                    tabBarIcon: ({ color }) => <AntDesignIcon size={28} name="clockcircleo" color={color} />,
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="setting"
                options={{
                    tabBarIcon: ({ color }) => <AntDesignIcon size={28} name="setting" color={color} />,
                }}
            />
    </Tabs>
  )
}

