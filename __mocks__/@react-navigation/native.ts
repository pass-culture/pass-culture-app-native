export const navigate = jest.fn()
export const reset = jest.fn()
export const goBack = jest.fn()
export const canGoBack = jest.fn()

export const useNavigation = () => ({
  navigate,
  reset,
  goBack,
  canGoBack,
})

export const useRoute = jest.fn()

export const useFocusEffect = () => {}
