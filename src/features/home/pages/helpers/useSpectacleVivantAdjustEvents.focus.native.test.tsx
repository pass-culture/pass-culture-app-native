import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'

import { ConsentState, CookieNameEnum } from 'features/cookies/enums'
import { useCookiesConsentStore } from 'features/cookies/store/cookiesConsentStore'
import { useSpectacleVivantAdjustEvents } from 'features/home/pages/helpers/useSpectacleVivantAdjustEvents'
import { Adjust } from 'libs/adjust/adjust'
import { env } from 'libs/environment/env'
import { AdjustEvents } from 'shared/adjust/adjustEvents'
import { act, render } from 'tests/utils'

// The global mock replaces useFocusEffect with useEffect: the real navigation keeps the home mounted but blurred
// while another screen is displayed, like in the app
jest.unmock('@react-navigation/native')
jest.unmock('@react-navigation/native-stack')

jest.mock('react-native-safe-area-context', () => ({
  ...jest.requireActual('react-native-safe-area-context'),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

jest.mock('libs/adjust/adjust')
const AdjustMock = Adjust as jest.Mocked<typeof Adjust>

const TESTING_SPECTACLE_VIVANT_HOME_ID = '3S4UGnN2tfPIV1ANpdUYs6'

type StackParamList = {
  SpectacleVivantHome: undefined
  OtherScreen: undefined
}
const Stack = createNativeStackNavigator<StackParamList>()
const navigationRef = createNavigationContainerRef<StackParamList>()

const SpectacleVivantHome = () => {
  useSpectacleVivantAdjustEvents(TESTING_SPECTACLE_VIVANT_HOME_ID)
  return null
}
const OtherScreen = () => null

const renderNavigation = () =>
  render(
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName="SpectacleVivantHome">
        <Stack.Screen name="SpectacleVivantHome" component={SpectacleVivantHome} />
        <Stack.Screen name="OtherScreen" component={OtherScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )

const acceptAdjustCookies = () =>
  useCookiesConsentStore.getState().setCookiesConsentState({
    state: ConsentState.HAS_CONSENT,
    value: { mandatory: [], accepted: [CookieNameEnum.ADJUST], refused: [] },
  })

describe('useSpectacleVivantAdjustEvents with the navigation', () => {
  beforeEach(() => {
    env.CONTENTFUL_ENVIRONMENT = 'testing'
    useCookiesConsentStore.getState().setCookiesConsentState({ state: ConsentState.UNKNOWN })
  })

  it('should log spectacleVivant once the home is focused again when the Adjust cookies are accepted from another screen', () => {
    renderNavigation()
    act(() => navigationRef.navigate('OtherScreen'))

    act(acceptAdjustCookies)

    expect(AdjustMock.logEvent).not.toHaveBeenCalled()

    act(() => navigationRef.goBack())

    expect(AdjustMock.logEvent).toHaveBeenCalledTimes(1)
    expect(AdjustMock.logEvent).toHaveBeenCalledWith(AdjustEvents.SPECTACLE_VIVANT)
  })

  it('should log spectacleVivant at each arrival on the home, Adjust counting the unique users', () => {
    acceptAdjustCookies()
    renderNavigation()
    act(() => navigationRef.navigate('OtherScreen'))

    act(() => navigationRef.goBack())

    expect(AdjustMock.logEvent).toHaveBeenCalledTimes(2)
  })
})
