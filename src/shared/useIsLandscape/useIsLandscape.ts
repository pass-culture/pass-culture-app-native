import { useEffect, useState } from 'react'
import { Dimensions } from 'react-native'
import DeviceInfo from 'react-native-device-info'

export const useIsLandscape = () => {
  const [isLandscape, setIsLandscape] = useState(false)

  const updateOrientation = async () => {
    const landscape = await DeviceInfo.isLandscape()
    setIsLandscape(landscape)
  }

  useEffect(() => {
    updateOrientation()
    const subscription = Dimensions.addEventListener('change', updateOrientation)
    return () => subscription?.remove()
  }, [])

  return isLandscape
}
