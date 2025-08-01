import { Stack } from 'expo-router';
import React from 'react';

export default function HistoryLayout() {
  //  return <Stack />
  return (
    <Stack>
        <Stack.Screen name="index" options={{ headerShown: false, title: 'list' }} />
      </Stack>
  )
 }