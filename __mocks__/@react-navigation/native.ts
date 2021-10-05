export { getStateFromPath, getPathFromState } from '@react-navigation/native'
import { useEffect } from 'react'

export const addListener = jest.fn()
export const removeListener = jest.fn()
export const navigate = jest.fn()
export const replace = jest.fn()
export const reset = jest.fn()
export const goBack = jest.fn()
export const canGoBack = jest.fn()
export const useNavigation = () => ({
  addListener,
  removeListener,
  navigate,
  replace,
  reset,
  goBack,
  canGoBack,
})
export const useRoute = jest.fn()
export const useFocusEffect = useEffect
export const NavigationContainer = jest.fn()
export const useNavigationState = jest.fn()
