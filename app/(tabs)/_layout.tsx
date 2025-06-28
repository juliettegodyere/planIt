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
            tabBarActiveTintColor: '#FF6347',
            tabBarInactiveTintColor: '#555555',
           sceneStyle: {backgroundColor:"#F1F1F1"},
            tabBarLabelStyle: {
                fontWeight: '500',
                fontSize: 11,
              },
        }}
        >
        <Tabs.Screen
                name="index"
                options={{
                    tabBarIcon: ({ color }) => <AntDesignIcon size={22} name="home" color={color} />,
                    header: () => <SearchItems />, 
                    headerTitleAlign: "center", 
                }}
            />
            <Tabs.Screen
                name="history"
                options={{
                    tabBarIcon: ({ color }) => <AntDesignIcon size={22} name="clockcircleo" color={color} />,
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="notification"
                options={{
                    tabBarIcon: ({ color }) => <AntDesignIcon size={22} name="bells" color={color} />,
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="setting"
                options={{
                    tabBarIcon: ({ color }) => <AntDesignIcon size={22} name="setting" color={color} />,
                }}
            />
    </Tabs>
  )
}

// Suggested Color Palette
// Primary Color (Tomato Red): #FF6347

// Secondary Color (Pink): #FFC0CB

// Accent Color (Deep Pink): #FF1493

// Neutral Background: #FFFFFF (White)

// Text Color: #333333 (Dark Gray)

