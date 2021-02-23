import { NavigationContainer } from '@react-navigation/native'
import { act, render } from '@testing-library/react-native'
import React from 'react'
import SplashScreen from 'react-native-splash-screen'

import { AcceptCgu } from 'features/auth/signup/AcceptCgu'
import { AccountCreated } from 'features/auth/signup/AccountCreated'
import { DEFAULT_SPLASHSCREEN_DELAY } from 'libs/splashscreen'
import { storage } from 'libs/storage'
import { flushAllPromises } from 'tests/utils'

import { homeNavigateConfig } from '../helpers'
import { navigationRef } from '../navigationRef'
import { RootNavigator, Route, wrapRoute } from '../RootNavigator'
import { useGetInitialScreenConfig } from '../RootNavigator/useGetInitialScreenConfig'

const mockedUseGetInitialScreenConfig = useGetInitialScreenConfig as jest.MockedFunction<
  typeof useGetInitialScreenConfig
>
mockedUseGetInitialScreenConfig.mockReturnValue(homeNavigateConfig)
jest.mock('../RootNavigator/useGetInitialScreenConfig', () => ({
  useGetInitialScreenConfig: jest.fn(),
}))
jest.mock('features/navigation/navigationRef')
jest.mock('@react-navigation/native', () => jest.requireActual('@react-navigation/native'))
jest.mock('features/auth/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ isLoggedIn: true })),
}))
jest.mock('react-error-boundary', () => ({
  withErrorBoundary: (component: React.ReactNode, _: unknown) => component,
}))
jest.mock('features/navigation/TabBar/TabNavigator', () => ({
  TabNavigator: () => null,
}))
jest.mock('features/firstTutorial/pages/FirstTutorial/FirstTutorial', () => ({
  FirstTutorial: () => null,
}))

describe('<RootNavigator />', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
    jest.clearAllMocks()
    mockedUseGetInitialScreenConfig.mockReturnValue(homeNavigateConfig)
    storage.clear('has_seen_tutorials')
  })

  it('show initial screen given by useGetInitialRouteName()', async () => {
    mockedUseGetInitialScreenConfig.mockReturnValue(homeNavigateConfig)
    let renderAPI = renderRootNavigator()
    await act(flushAllPromises)

    expect(navigationRef.current?.navigate).toHaveBeenNthCalledWith(
      1,
      homeNavigateConfig.screen,
      homeNavigateConfig.params
    )
    renderAPI.unmount()

    mockedUseGetInitialScreenConfig.mockReturnValue({
      screen: 'FirstTutorial',
      params: undefined,
    })
    renderAPI = renderRootNavigator()
    await act(flushAllPromises)

    expect(navigationRef.current?.navigate).toHaveBeenNthCalledWith(2, 'FirstTutorial', undefined)
    renderAPI.unmount()
  })

  it('should call SplashScreen.hide() after 200ms', async () => {
    expect.assertions(2)
    const renderAPI = renderRootNavigator()
    await act(flushAllPromises)

    expect(SplashScreen.hide).toBeCalledTimes(0)

    await waitForSplashScreenDelay()

    expect(SplashScreen.hide).toBeCalledTimes(1)
    renderAPI.unmount()
  })

  it('should NOT display PrivacyPolicy if splash screen is not yet hidden', async () => {
    expect.assertions(2)
    const renderAPI = renderRootNavigator()
    await act(flushAllPromises)

    expect(SplashScreen.hide).toBeCalledTimes(0)
    const privacyPolicyTitle = renderAPI.queryByText('Respect de ta vie privée')
    expect(privacyPolicyTitle).toBeFalsy()
    renderAPI.unmount()
  })

  it('should display PrivacyPolicy if splash screen is hidden', async () => {
    expect.assertions(2)
    const renderAPI = renderRootNavigator()
    await act(flushAllPromises)

    await waitForSplashScreenDelay()

    expect(SplashScreen.hide).toBeCalledTimes(1)
    const privacyPolicyTitle = renderAPI.queryByText('Respect de ta vie privée')
    expect(privacyPolicyTitle).toBeTruthy()
    renderAPI.unmount()
  })
})

describe('wrapRoute()', () => {
  const hoc = jest.fn()

  beforeEach(() => {
    hoc.mockClear()
  })

  it('should wrap a route when declared with hocs wrapper', () => {
    const routeWithHoc: Route = {
      name: 'AcceptCgu',
      component: AcceptCgu,
      hoc,
    }
    wrapRoute(routeWithHoc)
    expect(hoc).toBeCalledWith(AcceptCgu)
  })

  it('should not wrap a route when not declared with hocs wrapper', () => {
    const routeWithoutHoc: Route = {
      name: 'AccountCreated',
      component: AccountCreated,
    }
    wrapRoute(routeWithoutHoc)
    expect(hoc).not.toBeCalledWith(AccountCreated)
  })
})

async function waitForSplashScreenDelay() {
  act(() => {
    jest.advanceTimersByTime(DEFAULT_SPLASHSCREEN_DELAY)
  })
  await act(flushAllPromises)
}

function renderRootNavigator() {
  return render(
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  )
}
