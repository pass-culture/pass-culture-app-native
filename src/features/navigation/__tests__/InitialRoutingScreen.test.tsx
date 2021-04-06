import React from 'react'
import SplashScreen from 'react-native-splash-screen'

import { navigate } from '__mocks__/@react-navigation/native'
import { DEFAULT_SPLASHSCREEN_DELAY, SplashScreenProvider } from 'libs/splashscreen'
import { storage } from 'libs/storage'
import { flushAllPromises, act, render } from 'tests/utils'

import { homeNavigateConfig } from '../helpers'
import { InitialRoutingScreen } from '../RootNavigator/InitialRoutingScreen'
import { useGetInitialScreenConfig } from '../RootNavigator/useGetInitialScreenConfig'

const mockedUseGetInitialScreenConfig = useGetInitialScreenConfig as jest.MockedFunction<
  typeof useGetInitialScreenConfig
>
mockedUseGetInitialScreenConfig.mockReturnValue(homeNavigateConfig)
jest.mock('../RootNavigator/useGetInitialScreenConfig', () => ({
  useGetInitialScreenConfig: jest.fn(),
}))

jest.mock('features/auth/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ isLoggedIn: true })),
}))

describe('<InitialRoutingScreen />', () => {
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
    let renderAPI = await renderInitialRoutingScreen()
    await waitForSplashScreenDelay()

    expect(navigate).toHaveBeenNthCalledWith(
      1,
      homeNavigateConfig.screen,
      homeNavigateConfig.params
    )
    renderAPI.unmount()

    mockedUseGetInitialScreenConfig.mockReturnValue({
      screen: 'FirstTutorial',
      params: undefined,
    })
    renderAPI = await renderInitialRoutingScreen()
    await waitForSplashScreenDelay()

    expect(navigate).toHaveBeenNthCalledWith(2, 'FirstTutorial', undefined)
    renderAPI.unmount()
  })

  it('should call SplashScreen.hide() after 200ms', async () => {
    expect.assertions(2)
    const renderAPI = await renderInitialRoutingScreen()

    expect(SplashScreen.hide).toBeCalledTimes(0)

    await waitForSplashScreenDelay()

    expect(SplashScreen.hide).toBeCalledTimes(1)
    renderAPI.unmount()
  })
})

async function waitForSplashScreenDelay() {
  act(() => {
    jest.advanceTimersByTime(DEFAULT_SPLASHSCREEN_DELAY)
  })
  await act(flushAllPromises)
}

async function renderInitialRoutingScreen() {
  const renderAPI = render(
    <SplashScreenProvider>
      <InitialRoutingScreen />
    </SplashScreenProvider>
  )
  await act(flushAllPromises)
  return renderAPI
}
