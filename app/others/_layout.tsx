import { Stack } from 'expo-router';
import React from 'react';

export default function OtherLayout() {
    return (
        <Stack>
            <Stack.Screen name="HistoryList" options={{ headerShown: false, title: 'list' }} />
            <Stack.Screen name="[id]" options={{ headerShown: false, title: 'details' }} />
          </Stack>
      )
 }