export const { getStateFromPath, getPathFromState } = jest.requireActual('@react-navigation/native')
import { useEffect } from 'react'

export const addListener = jest.fn()
export const canGoBack = jest.fn()
export const dispatch = jest.fn()
export const getParent = jest.fn()
export const getState = jest.fn()
export const goBack = jest.fn()
export const isFocused = jest.fn()
export const navigate = jest.fn()
export const pop = jest.fn()
export const popToTop = jest.fn()
export const push = jest.fn()
export const removeListener = jest.fn()
export const replace = jest.fn()
export const reset = jest.fn()
export const setOptions = jest.fn()
export const setParams = jest.fn()
export const useLinkProps = jest.fn()

export const navigation = {
  addListener,
  canGoBack,
  dispatch,
  getParent,
  getState,
  goBack,
  isFocused,
  navigate,
  pop,
  popToTop,
  push,
  removeListener,
  replace,
  reset,
  setOptions,
  setParams,
  useLinkProps,
}
export const useNavigation = () => navigation
export const createNavigationContainerRef = () => ({
  ...navigation,
  isReady: () => true,
  current: navigation,
})

export const useIsFocused = jest.fn()
export const useRoute = jest.fn().mockReturnValue({ params: {} })
export const useFocusEffect = useEffect
export const NavigationContainer = jest.fn()
export const useNavigationState = jest.fn()
export const useScrollToTop = jest.fn()
