import AsyncStorage from '@react-native-async-storage/async-storage'
import { useCallback, useEffect, useState } from 'react'
import Orientation from 'react-native-orientation-locker'

export const useOrientationLocked = () => {
  const [isOrientationLocked, setIsOrientationLocked] = useState(Orientation.isLocked())

  const fetchOrientationLocked = useCallback(async () => {
    const storedValue = await AsyncStorage.getItem('orientationLocked')
    if (storedValue !== null) setIsOrientationLocked(storedValue === 'true')
    if (isOrientationLocked) Orientation.lockToPortrait()
  }, [isOrientationLocked])

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
