import AsyncStorage from '@react-native-async-storage/async-storage'
import type { WeatherApiResponse } from '../types/weather'
import { CACHE_KEYS, type CachedHomeWeather } from '../shared/const/cache'

const CACHE_KEY = CACHE_KEYS.HOME_WEATHER

export async function getCachedHomeWeather(): Promise<CachedHomeWeather | null> {
  try {
    console.log('getCachedHomeWeather working', CACHE_KEY)

    const raw = await AsyncStorage.getItem(CACHE_KEY)

    if (!raw) return null

    const parsed = JSON.parse(raw) as CachedHomeWeather

    if (!parsed?.data || typeof parsed.savedAt !== 'number') return null

    console.log('getCachedHomeWeather working', parsed)

    return parsed
  } catch {
    return null
  }
}

export async function setCachedHomeWeather(data: WeatherApiResponse): Promise<void> {
  try {
    const payload: CachedHomeWeather = { data, savedAt: Date.now() }

    console.log('setCachedHomeWeather working', payload)

    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(payload))
  } catch (e) {
    console.warn('Failed to cache home weather', e)
  }
}