import { Stack } from "expo-router";
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { StatusBar } from 'expo-status-bar';
import {ShoppingListProvider, useShoppingListContext} from '../service/stateManager'

export default function RootLayout() {
  return (
    <GluestackUIProvider>
      <ShoppingListProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false, title: 'Home' }} />
      </Stack>
      <StatusBar style="auto" />
      </ShoppingListProvider>
    </GluestackUIProvider>
  )
}
