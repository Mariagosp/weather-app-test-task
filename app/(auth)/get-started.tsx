import { router } from 'expo-router'
import { View, Button, Text } from 'react-native'

export default function GetStarted() {
    return (
        <View>
            <Text>Welcome to Weather App 🌤</Text>
            <Button title='Login' onPress={() => router.push('/(auth)/login')} />
        </View>
    )
}
