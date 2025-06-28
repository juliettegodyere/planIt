import { Stack } from 'expo-router';
import React from 'react';

export default function CartLayout() {
   return <Stack >
     <Stack.Screen name="index" options={{ headerShown: true, title: 'History' }} />
     <Stack.Screen name="[id]" options={{ headerShown: true, title: 'Details' }} />
     <Stack.Screen name="HistoryList" options={{ headerShown: true, title: 'Lists' }} />
   </Stack>;
 }