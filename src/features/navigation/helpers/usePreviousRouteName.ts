import { useNavigationState } from '@react-navigation/native'

export const usePreviousRouteName = () => {
  return useNavigationState((state) => {
    if (state.index > 0) {
      return state.routes[state.index - 1]?.name
    }
    return null
  })
}
