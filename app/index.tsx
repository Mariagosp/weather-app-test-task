import { Redirect } from 'expo-router'
import { useUserStore } from '../shared/store'
import { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase'

export default function Index() {
    const { user, isLoading, setUserData } = useUserStore()

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUserData(firebaseUser)
        })

        return unsubscribe
    }, [])

    if (isLoading) return null

    if (!user) return <Redirect href='/(auth)/get-started' />

    return <Redirect href='/(tabs)/home' />
}
