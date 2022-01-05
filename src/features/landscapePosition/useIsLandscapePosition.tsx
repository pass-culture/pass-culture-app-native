import { useWindowDimensions } from 'react-native'

export const useIsLandscapePosition = (): boolean => {
  const { width, height } = useWindowDimensions()
  return width >= height
}
