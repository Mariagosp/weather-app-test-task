import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import { ICON_BASE } from '../../shared/const/api'
import { WeatherApiResponse } from '../../types/weather'
import { COLORS } from '../../shared/const/colors'

type Props = {
    weather: WeatherApiResponse
    error: string | null
    openDetails: () => void
}

export default function WeatherCard({ weather, error, openDetails }: Props) {
    return (
        <Pressable style={({ pressed }) => [styles.weatherCard, pressed && styles.weatherCardPressed]} onPress={openDetails}>
            <View style={styles.cardHeader}>
                <Text style={styles.city}>{weather.name}</Text>
                <Text style={styles.country}>{weather.sys.country}</Text>
            </View>
            <View style={styles.mainRow}>
                <Image source={{ uri: `${ICON_BASE}/${weather.weather[0].icon}@2x.png` }} style={styles.weatherIcon} />
                <View style={styles.tempBlock}>
                    <Text style={styles.temp}>{Math.round(weather.main.temp)}°</Text>
                    <Text style={styles.feels}>Feels like {Math.round(weather.main.feels_like)}°</Text>
                </View>
            </View>
            <Text style={styles.description}>{weather.weather[0].description}</Text>
            <View style={styles.miniStats}>
                <Text style={styles.miniStat}>💧 {weather.main.humidity}%</Text>
                <Text style={styles.miniStat}>💨 {weather.wind.speed} m/s</Text>
            </View>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </Pressable>
    )
}

const styles = StyleSheet.create({
    weatherCard: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: 'rgba(248, 250, 252, 0.06)',
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: 'rgba(248, 250, 252, 0.08)'
    },
    weatherCardPressed: {
        opacity: 0.92
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 8,
        marginBottom: 20
    },
    city: {
        fontSize: 24,
        fontWeight: '800',
        color: COLORS.text
    },
    country: {
        fontSize: 16,
        color: COLORS.textSecondary,
        fontWeight: '500'
    },
    mainRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12
    },
    weatherIcon: {
        width: 80,
        height: 80,
        marginRight: 16
    },
    tempBlock: {},
    temp: {
        fontSize: 48,
        fontWeight: '800',
        color: COLORS.text,
        letterSpacing: -1
    },
    feels: {
        fontSize: 15,
        color: COLORS.textSecondary,
        marginTop: 4
    },
    description: {
        fontSize: 17,
        color: COLORS.text,
        textTransform: 'capitalize',
        marginBottom: 16
    },
    miniStats: {
        flexDirection: 'row',
        gap: 20
    },
    miniStat: {
        fontSize: 14,
        color: COLORS.textSecondary
    },
    errorText: {
        marginTop: 12,
        fontSize: 14,
        color: '#f87171'
    }
})
