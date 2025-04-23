import AsyncStorage from '@react-native-async-storage/async-storage'
import { useCallback, useEffect, useState } from 'react'
import Orientation from 'react-native-orientation-locker'

export const useOrientationLocked = () => {
  const [isOrientationLocked, setIsOrientationLocked] = useState(Orientation.isLocked())

  const fetchOrientationLocked = useCallback(async () => {
    const storedValue = await AsyncStorage.getItem('orientationLocked')
    const shouldLock = storedValue === null || storedValue === 'true'

    setIsOrientationLocked(shouldLock)

    if (shouldLock) Orientation.lockToPortrait()
    else Orientation.unlockAllOrientations()
  }, [])

  useEffect(() => {
    fetchOrientationLocked()
    Orientation.addLockListener(() => setIsOrientationLocked(Orientation.isLocked()))
    return () => Orientation.removeAllListeners()
  }, [fetchOrientationLocked])

  const toggleOrientationLocked = useCallback(async () => {
    await AsyncStorage.setItem('orientationLocked', (!Orientation.isLocked()).toString())
    Orientation.isLocked() ? Orientation.unlockAllOrientations() : Orientation.lockToPortrait()
  }, [])

  return [isOrientationLocked, toggleOrientationLocked] as const
}
