import { useEffect, useRef } from 'react'
import { useRouter } from 'expo-router'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase'
import { useUserStore } from '../shared/store'

type Props = {
    children: React.ReactNode
}

export default function AuthProvider({ children }: Props) {
    const router = useRouter()
    const user = useUserStore((s) => s.user)
    const isLoading = useUserStore((s) => s.isLoading)
    const setUserData = useUserStore((s) => s.setUserData)
    const prevUserRef = useRef<typeof user>(undefined)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUserData(firebaseUser)
        })
        return unsubscribe
    }, [setUserData])

    useEffect(() => {
        if (isLoading) return

        if (prevUserRef.current === user) return

        prevUserRef.current = user
        router.replace(user ? '/(tabs)/home' : '/(auth)/get-started')
    }, [user, isLoading, router])

    return <>{children}</>
}
