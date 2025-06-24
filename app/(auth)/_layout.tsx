import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack>
        <Stack.Screen name="index" options={{ headerShown: true, title: 'Login' }} />
        <Stack.Screen name="select-country" options={{ headerShown: true, title: 'Select Country' }} />
      </Stack>
  )
}
