import { signOut, User } from 'firebase/auth'
import { create } from 'zustand'
import { auth } from '../../../firebase'

interface UseUserStoreType {
    isLoading: boolean
    user: User | null
    setUserData: (user?: User | null) => void
    logout: () => void
}

export const useUserStore = create<UseUserStoreType>()((set, get) => ({
    isLoading: true,
    user: null,
    setUserData: (user) => set({ user, isLoading: false }),
    logout: async () => {
        await signOut(auth)

        set({ user: null })
    }
}))
