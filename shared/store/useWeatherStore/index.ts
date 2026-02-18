import { create } from 'zustand'
import type { WeatherApiResponse } from '../../../types/weather'

type WeatherStore = {
  currentWeather: WeatherApiResponse | null
  setCurrentWeather: (data: WeatherApiResponse | null) => void
}

export const useWeatherStore = create<WeatherStore>((set) => ({
  currentWeather: null,
  setCurrentWeather: (data) => set({ currentWeather: data }),
}))
