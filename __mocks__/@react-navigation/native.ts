export { getStateFromPath, getPathFromState } from '@react-navigation/native'
import { useEffect } from 'react'

export const addListener = jest.fn()
export const removeListener = jest.fn()
export const navigate = jest.fn()
export const replace = jest.fn()
export const reset = jest.fn()
export const goBack = jest.fn()
export const canGoBack = jest.fn()

const navigation = {
  addListener,
  removeListener,
  navigate,
  replace,
  reset,
  goBack,
  canGoBack,
}
export const useNavigation = () => navigation
export const createNavigationContainerRef = () => ({
  ...navigation,
  isReady: () => true,
  current: navigation,
})

export const useRoute = jest.fn()
export const useFocusEffect = useEffect
export const NavigationContainer = jest.fn()
export const useNavigationState = jest.fn()
