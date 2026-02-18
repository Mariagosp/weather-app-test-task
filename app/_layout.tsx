import { Redirect, Stack } from 'expo-router'

export default function RootLayout() {
  // const { user, isLoading } = useAuthStore();
  // const isTrue = true

  // if (isLoading) return null;

  // if (isTrue) {
  //     return <Redirect href='/(auth)/get-started' />
  // }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
