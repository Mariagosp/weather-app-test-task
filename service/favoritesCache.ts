import AsyncStorage from '@react-native-async-storage/async-storage'
import type { WeatherApiResponse } from '../types/weather'
import { CACHE_KEYS, CachedHomeWeather, FavoritesWeatherCache } from '../shared/const/cache'

const FAVORITES_KEY = CACHE_KEYS.FAVORITES
const FAVORITES_WEATHER_KEY = CACHE_KEYS.FAVORITES_WEATHER

export async function getPersistedFavoriteIds(): Promise<number[]> {
    try {
        console.log('getPersistedFavoriteIds workinggg')
        const raw = await AsyncStorage.getItem(FAVORITES_KEY)

        if (!raw) {
            return []
        }

        const parsed = JSON.parse(raw)

        return Array.isArray(parsed) ? parsed.filter((n) => typeof n === 'number') : []
    } catch {
        return []
    }
}

export async function setPersistedFavoriteIds(ids: number[]): Promise<void> {
    console.log('setPersistedFavoriteIds workinggg')

    try {
        await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(ids))
    } catch (e) {
        console.warn('Failed to persist favorite ids', e)
    }
}

export async function getCachedFavoritesWeather(cityIds: number[]): Promise<WeatherApiResponse[]> {
    if (cityIds.length === 0) {
        return []
    }

    console.log('getCachedFavoritesWeather workinggg')

    try {
        const raw = await AsyncStorage.getItem(FAVORITES_WEATHER_KEY)

        if (!raw) {
            return []
        }

        const cache = JSON.parse(raw) as FavoritesWeatherCache

        console.log('cache from getCachedFavoritesWeather', cache)

        const result: WeatherApiResponse[] = []

        for (const id of cityIds) {
            const item = cache[String(id)] as CachedHomeWeather | undefined

            if (item?.data) {
                result.push(item.data)
            }
        }

        return result
    } catch {
        return []
    }
}

export async function setCachedFavoriteWeather(cityId: number, data: WeatherApiResponse): Promise<void> {
    try {
        console.log('setCachedFavoriteWeather workinggg')

        const raw = await AsyncStorage.getItem(FAVORITES_WEATHER_KEY)
        const cache: FavoritesWeatherCache = raw ? JSON.parse(raw) : {}

        cache[String(cityId)] = { data, savedAt: Date.now() }

        await AsyncStorage.setItem(FAVORITES_WEATHER_KEY, JSON.stringify(cache))
    } catch (e) {
        console.warn('Failed to cache favorite weather', e)
    }
}

export async function setCachedFavoritesWeatherList(items: WeatherApiResponse[]): Promise<void> {
    if (items.length === 0) return

    try {
        console.log('setCachedFavoritesWeatherList workinggg')
        const raw = await AsyncStorage.getItem(FAVORITES_WEATHER_KEY)
        const cache: FavoritesWeatherCache = raw ? JSON.parse(raw) : {}

        const now = Date.now()

        for (const data of items) {
            cache[String(data.id)] = { data, savedAt: now }
        }

        await AsyncStorage.setItem(FAVORITES_WEATHER_KEY, JSON.stringify(cache))
    } catch (e) {
        console.warn('Failed to cache favorites weather list', e)
    }
}

export async function removeCachedFavoriteWeather(cityId: number): Promise<void> {
    try {
        console.log('removeCachedFavoriteWeather workinggg')

        const raw = await AsyncStorage.getItem(FAVORITES_WEATHER_KEY)

        if (!raw) return

        const cache = JSON.parse(raw) as FavoritesWeatherCache
        delete cache[String(cityId)]

        await AsyncStorage.setItem(FAVORITES_WEATHER_KEY, JSON.stringify(cache))
    } catch (e) {
        console.warn('Failed to remove cached favorite weather', e)
    }
}
