import { useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Pressable,
    ActivityIndicator,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
    TouchableWithoutFeedback
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { COLORS } from '../../../shared/const/colors'
import { useWeatherStore } from '../../../shared/store'
import type { WeatherApiResponse } from '../../../types/weather'
import Header from '../../../components/Header'
import { fetchSuggestions, fetchWeatherByCity } from '../../../service/weatherService'
import WeatherCard from '../../../components/WeatherCard'
import SuggestionsList from '../../../components/SuggestionsList'

const SEARCH_SUBTITLE = 'Search weather by city'

export default function SearchPage() {
    const insets = useSafeAreaInsets()
    const setCurrentWeather = useWeatherStore((s) => s.setCurrentWeather)
    const [query, setQuery] = useState('')
    const [weather, setWeather] = useState<WeatherApiResponse | null>(null)
    const [suggestions, setSuggestions] = useState<string[]>([])
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
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View style={styles.keyboardDismissArea}>
                    <Header subtitle={SEARCH_SUBTITLE} />
                    <ScrollView
                        style={styles.scroll}
                        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
                        keyboardShouldPersistTaps='handled'
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.searchBlock}>
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
                                            fetchSuggestions(t, setSuggestions)
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
                                    onPress={() => {
                                        search()
                                        Keyboard.dismiss()
                                    }}
                                    disabled={loading || !query.trim()}
                                >
                                    {loading ? (
                                        <ActivityIndicator size='small' color={COLORS.main} />
                                    ) : (
                                        <Ionicons name='arrow-forward' size={22} color={COLORS.main} />
                                    )}
                                </Pressable>
                            </View>

                            {suggestions.length > 0 && (
                                <SuggestionsList
                                    suggestions={suggestions}
                                    handlePress={(city) => {
                                        setQuery(city)
                                        setSuggestions([])
                                        search()
                                        Keyboard.dismiss()
                                    }}
                                />
                            )}
                        </View>

                        {error && (
                            <View style={styles.errorCard}>
                                <Ionicons name='warning-outline' size={24} color={COLORS.error} />
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
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.main
    },
    keyboardDismissArea: {
        flex: 1
    },
    scroll: {
        flex: 1
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 24
    },
    searchBlock: {
        position: 'relative',
        marginBottom: 24
    },
    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12
    },
    inputWrap: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.glassWhiteSoft,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.glassWhite,
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
        borderColor: COLORS.glassWhite
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
        color: COLORS.error
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
        backgroundColor: COLORS.glassWhiteSoft,
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
        backgroundColor: COLORS.glassWhiteSoft,
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: COLORS.glassWhite
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
    },
})
