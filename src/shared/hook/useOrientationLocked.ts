import AsyncStorage from '@react-native-async-storage/async-storage'
import { useCallback, useEffect, useState } from 'react'
import { AppState, AppStateStatus } from 'react-native'
import Orientation from 'react-native-orientation-locker'

const STORAGE_KEY = 'orientationLocked'

export const useOrientationLocked = () => {
  const [isOrientationLocked, setIsOrientationLocked] = useState(false)

  const applyOrientationLock = useCallback((locked: boolean) => {
    if (locked) {
      Orientation.lockToPortrait()
    } else {
      Orientation.unlockAllOrientations()
    }
  }, [])

  useEffect(() => {
    let mounted = true

    const init = async () => {
      const storedValue = await AsyncStorage.getItem(STORAGE_KEY)
      const locked = storedValue === 'true'

      if (!mounted) return

      setIsOrientationLocked(locked)
      applyOrientationLock(locked)
    }

    void init()

    return () => {
      mounted = false
    }
  }, [applyOrientationLock])

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state: AppStateStatus) => {
      if (state === 'active' && isOrientationLocked) {
        Orientation.lockToPortrait()
      }
    })

    return () => subscription.remove()
  }, [isOrientationLocked])

  useEffect(() => {
    const handler = (orientation: string) => {
      if (
        isOrientationLocked &&
        (orientation === 'LANDSCAPE-LEFT' || orientation === 'LANDSCAPE-RIGHT')
      ) {
        Orientation.lockToPortrait()
      }
    }

    Orientation.addOrientationListener(handler)

    return () => {
      Orientation.removeOrientationListener(handler)
    }
  }, [isOrientationLocked])

  const toggleOrientationLocked = useCallback(async () => {
    const nextValue = !isOrientationLocked

    setIsOrientationLocked(nextValue)
    await AsyncStorage.setItem(STORAGE_KEY, String(nextValue))

    applyOrientationLock(nextValue)
  }, [applyOrientationLock, isOrientationLocked])

  return [isOrientationLocked, toggleOrientationLocked] as const
}
