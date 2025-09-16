import {Platform} from 'react-native'
import { Tabs } from "expo-router";
import AntDesignIcon from "@expo/vector-icons/AntDesign";
import { Badge, BadgeText } from "@/components/ui/badge"
import { VStack } from '@/components/ui/vstack';
import { useShoppingListContext } from '@/service/store';
import React from 'react';
import { useNotification } from '@/db/context/NotificationProvider';

export default function TabsLayout() {
    const { state, dispatch } = useShoppingListContext();
    const {shoppingItemLists} = state
    const {
        reminders,
      } = useNotification();

    const firedCount = reminders.filter((item) => Boolean(item.fired)).length;
    const cartCount = shoppingItemLists.filter(
      (item) => item.selected && !item.purchased
    ).length;
    
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
                    tabBarLabel: "Home",
                    tabBarIcon: ({ color }) => <AntDesignIcon size={22} name="home" color={color} />,
                    //header: () => <SearchItems />, 
                    headerTitleAlign: "center", 
                    headerShown: false, // 🔥 hides the header entirely
                }}
            />
            <Tabs.Screen
                name="history"
                // options={{
                //     tabBarLabel: "Cart",
                //     tabBarIcon: ({ color }) => <AntDesignIcon size={22} name="shoppingcart" color={color} />,
                //     headerShown: true,
                // }}
                options={{
                    tabBarLabel: "Cart",
                    tabBarIcon: ({ color }) => {
                    return (
                        <VStack>
                        {cartCount > 0 && (
                            <Badge className="z-10 self-end bg-red-600 rounded-full -mb-3.5 -mr-3.5 px-2 min-w-[22px] min-h-[22px]">
                            <BadgeText className="text-white">{cartCount}</BadgeText>
                            </Badge>
                        )}
                        <AntDesignIcon size={22} name="shoppingcart" color={color} />
                        </VStack>
                    );
                    },
                    headerShown: false,
                }}
            />
           <Tabs.Screen
                name="notification"
                options={{
                    tabBarLabel: "Notifications",
                    tabBarIcon: ({ color }) => {
                    return (
                        <VStack>
                        {firedCount > 0 && (
                            <Badge className="z-10 self-end bg-red-600 rounded-full -mb-3.5 -mr-3.5 px-2 min-w-[22px] min-h-[22px]">
                            <BadgeText className="text-white">{firedCount}</BadgeText>
                            </Badge>
                        )}
                        <AntDesignIcon size={22} name="bells" color={color} />
                        </VStack>
                    );
                    },
                    headerShown: true,
                    headerTitle: "Notification"
                }}
                />
            <Tabs.Screen
                name="setting"
                options={{
                    tabBarLabel: "Settings",
                    tabBarIcon: ({ color }) => <AntDesignIcon size={22} name="setting" color={color} />,
                    headerShown: true,
                    headerTitle: "Setting"
                }}
            />
    </Tabs>
  )
}



