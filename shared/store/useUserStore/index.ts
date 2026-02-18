import { User } from 'firebase/auth'
import { create } from 'zustand'

interface UseUserStoreType {
    isLoading: boolean
    user: User | null
    setUserData: (user?: User | null) => void
}

export const useUserStore = create<UseUserStoreType>()((set, get) => ({
    isLoading: true,
    user: null,
    setUserData: (user) => set({ user, isLoading: false })
}))
