import { navigationRef } from 'features/navigation/navigationRef'
import { RootStackParamList } from 'features/navigation/RootNavigator/types'

export const expectCurrentRouteToBe = (expectedRoute: keyof RootStackParamList) => {
  const state = navigationRef.getState()

  return expect(state.routes[state.index]?.name).toBe(expectedRoute)
}
