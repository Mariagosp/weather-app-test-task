import { useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Pressable,
    ActivityIndicator,
    Image,
    ScrollView,
    KeyboardAvoidingView,
    Platform
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { COLORS } from '../../../shared/const/colors'
import { useWeatherStore } from '../../../shared/store'
import type { WeatherApiResponse } from '../../../types/weather'
import Header from '../../../components/Header'
import { fetchWeatherByCity } from '../../../service/weatherService'
import { ICON_BASE } from '../../../shared/const/api'
import WeatherCard from '../../../components/WeatherCard'

const SEARCH_SUBTITLE = 'Search weather by city'

export default function SearchPage() {
    const insets = useSafeAreaInsets()
    const setCurrentWeather = useWeatherStore((s) => s.setCurrentWeather)
    const [query, setQuery] = useState('')
    const [weather, setWeather] = useState<WeatherApiResponse | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const search = async () => {
        if (!query.trim()) return
        setError(null)
        setWeather(null)
        setLoading(true)
        try {
            const data = await fetchWeatherByCity(query)
            setWeather(data)
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    const openDetails = () => {
        if (!weather) return
        setCurrentWeather(weather)
        router.push('/weather-details')
    }

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={0}>
            <Header subtitle={SEARCH_SUBTITLE} />
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
                keyboardShouldPersistTaps='handled'
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.searchRow}>
                    <View style={styles.inputWrap}>
                        <Ionicons name='search' size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder='City name (e.g. London, Tokyo)'
                            placeholderTextColor={COLORS.textSecondary}
                            value={query}
                            onChangeText={(t) => {
                                setQuery(t)
                                setError(null)
                            }}
                            onSubmitEditing={search}
                            returnKeyType='search'
                            autoCapitalize='words'
                            autoCorrect={false}
                        />
                        {query.length > 0 && (
                            <Pressable onPress={() => setQuery('')} hitSlop={8} style={styles.clearBtn}>
                                <Ionicons name='close-circle' size={20} color={COLORS.textSecondary} />
                            </Pressable>
                        )}
                    </View>
                    <Pressable
                        style={({ pressed }) => [styles.searchBtn, pressed && styles.searchBtnPressed]}
                        onPress={search}
                        disabled={loading || !query.trim()}
                    >
                        {loading ? (
                            <ActivityIndicator size='small' color={COLORS.main} />
                        ) : (
                            <Ionicons name='arrow-forward' size={22} color={COLORS.main} />
                        )}
                    </Pressable>
                </View>

                {error && (
                    <View style={styles.errorCard}>
                        <Ionicons name='warning-outline' size={24} color='#f87171' />
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                )}

                {!weather && !loading && !error && (
                    <View style={styles.placeholder}>
                        <View style={styles.placeholderIconWrap}>
                            <Ionicons name='cloud-outline' size={48} color={COLORS.textSecondary} />
                        </View>
                        <Text style={styles.placeholderTitle}>Search for a city</Text>
                        <Text style={styles.placeholderText}>Enter a city name and tap search to see the weather.</Text>
                    </View>
                )}

                {weather && <WeatherCard weather={weather} error={null} openDetails={openDetails} />}
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.main
    },
    scroll: {
        flex: 1
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 24
    },
    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 24
    },
    inputWrap: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(248, 250, 252, 0.06)',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(248, 250, 252, 0.08)',
        paddingHorizontal: 16,
        minHeight: 52
    },
    inputIcon: {
        marginRight: 12
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: COLORS.text,
        paddingVertical: 14
    },
    clearBtn: {
        padding: 4
    },
    searchBtn: {
        width: 52,
        height: 52,
        borderRadius: 16,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(248, 250, 252, 0.08)'
    },
    searchBtnPressed: {
        opacity: 0.9
    },
    errorCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: 'rgba(248, 113, 113, 0.1)',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(248, 113, 113, 0.2)',
        marginBottom: 24
    },
    errorText: {
        flex: 1,
        fontSize: 15,
        color: '#f87171'
    },
    placeholder: {
        alignItems: 'center',
        paddingVertical: 48,
        paddingHorizontal: 24
    },
    placeholderIconWrap: {
        width: 88,
        height: 88,
        borderRadius: 44,
        backgroundColor: 'rgba(248, 250, 252, 0.06)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20
    },
    placeholderTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: 8,
        textAlign: 'center'
    },
    placeholderText: {
        fontSize: 15,
        color: COLORS.textSecondary,
        textAlign: 'center',
        lineHeight: 22
    },
    weatherCard: {
        width: '100%',
        maxWidth: 360,
        alignSelf: 'center',
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
    tapHint: {
        fontSize: 13,
        color: COLORS.textSecondary,
        marginTop: 12
    }
})
