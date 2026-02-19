import { create } from 'zustand'

type FavoritesStore = {
    favoriteCityIds: number[]
    toggleFavorite: (cityId: number) => void
    isFavorite: (cityId: number) => boolean
}

export const useFavoritesStore = create<FavoritesStore>((set, get) => ({
    favoriteCityIds: [],
    toggleFavorite: (cityId) =>
      set((state) => {
        const has = state.favoriteCityIds.includes(cityId)
        return {
          favoriteCityIds: has
            ? state.favoriteCityIds.filter((id) => id !== cityId)
            : [...state.favoriteCityIds, cityId]
        }
      }),
    isFavorite: (cityId) => get().favoriteCityIds.includes(cityId)
}))
