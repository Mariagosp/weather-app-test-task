import { Dispatch, SetStateAction } from 'react'
import { WeatherApiResponse } from '../types/weather'

const apiKey = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY
const UNITS = 'metric'

export async function fetchWeatherByCity(query: string): Promise<WeatherApiResponse> {
    if (!apiKey) throw new Error('EXPO_PUBLIC_OPENWEATHER_API_KEY is not set')
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(query.trim())}&APPID=${apiKey}&units=${UNITS}`
    const res = await fetch(url)
    const data = await res.json()
    if (!res.ok || data.cod !== 200) {
        const msg = data?.message === 'city not found' ? 'City not found' : data?.message || 'Failed to load weather'
        throw new Error(msg)
    }
    return data as WeatherApiResponse
}

export async function fetchWeatherByCoords(lat: number, lon: number): Promise<WeatherApiResponse> {
    if (!apiKey) throw new Error('EXPO_PUBLIC_OPENWEATHER_API_KEY is not set')
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${apiKey}&units=${UNITS}`
    const res = await fetch(url)
    if (!res.ok) throw new Error('Weather request failed')
    const data = (await res.json()) as WeatherApiResponse
    if (data.cod !== 200) throw new Error(data.message || 'Invalid response')
    return data
}

export const fetchSuggestions = async (input: string, setSuggestions: Dispatch<SetStateAction<string[]>>) => {
    if (!input.trim()) {
        setSuggestions([])
        return
    }

    try {
        const res = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${input}&limit=5&appid=${apiKey}`)
        const data = await res.json()
        const names = data.map((item: any) =>
            item.state ? `${item.name}, ${item.state}, ${item.country}` : `${item.name}, ${item.country}`
        )
        setSuggestions(names)
    } catch (e) {
        console.log('Suggestions error', e)
        setSuggestions([])
    }
}

export const fetchWeatherById = async (cityId: number) => {
    if (!apiKey) throw new Error('EXPO_PUBLIC_OPENWEATHER_API_KEY is not set')
    const url = `https://api.openweathermap.org/data/2.5/weather?id=${cityId}&appid=${apiKey}&units=metric`
    const res = await fetch(url)
    const data = await res.json()
    console.log('data from backend', data)

    if (!res.ok || data.cod !== 200) {
        const msg = data?.message === 'city not found' ? 'City not found' : data?.message || 'Failed to load weather'
        throw new Error(msg)
    }
    return data as WeatherApiResponse
}
