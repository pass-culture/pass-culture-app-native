import { NavigationContainer } from '@react-navigation/native'
import React from 'react'

import { MustUpdateAppState, useMustUpdateApp } from 'features/forceUpdate/helpers/useMustUpdateApp'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { useSplashScreenContext } from 'libs/splashscreen'
import { storage } from 'libs/storage'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, render, screen } from 'tests/utils'

import { RootNavigator } from './RootNavigator'

const mockUseSplashScreenContext = jest.mocked(useSplashScreenContext)
const mockedUseMustUpdateApp = jest.mocked(useMustUpdateApp)

jest.mock('features/navigation/navigationRef')
jest.mock('features/forceUpdate/helpers/useMustUpdateApp')
jest.unmock('@react-navigation/native')

const mockUseAuthContext = jest.fn().mockReturnValue({ isLoggedIn: true })
jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: () => mockUseAuthContext(),
}))

jest.mock('react-error-boundary', () => ({
  withErrorBoundary: (component: React.ReactNode, _: unknown) => component,
}))
jest.mock('features/navigation/TabBar/TabNavigator', () => ({
  TabNavigator: () => null,
}))
jest.mock('features/navigation/RootNavigator/useInitialScreenConfig', () => ({
  useInitialScreen: () => 'TabNavigator',
}))
jest.mock('features/navigation/helpers/useCurrentRoute', () => ({
  useCurrentRoute: () => ({ name: 'TabNavigator', key: 'key' }),
}))
jest.mock('libs/splashscreen')

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

describe('<RootNavigator />', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  beforeEach(() => {
    mockedUseMustUpdateApp.mockReturnValue(MustUpdateAppState.SHOULD_NOT_UPDATE)
    storage.clear('logged_in_session_count')
  })

  it('should NOT display PrivacyPolicy if splash screen is not yet hidden', async () => {
    mockedUseMustUpdateApp.mockReturnValueOnce(MustUpdateAppState.SHOULD_NOT_UPDATE)
    mockUseSplashScreenContext.mockReturnValueOnce({ isSplashScreenHidden: false })
    renderRootNavigator()

    const privacyPolicyTitle = screen.queryByText('Respect de ta vie privée')

    expect(privacyPolicyTitle).not.toBeOnTheScreen()
  })

  it('should display PrivacyPolicy if splash screen is hidden', async () => {
    mockedUseMustUpdateApp.mockReturnValueOnce(MustUpdateAppState.SHOULD_NOT_UPDATE)
    mockUseSplashScreenContext.mockReturnValueOnce({ isSplashScreenHidden: true })

    renderRootNavigator()
    await act(async () => {})
    const privacyPolicyTitle = screen.getByText('Respect de ta vie privée')

    expect(privacyPolicyTitle).toBeOnTheScreen()
  })

  it('should not display quick access button in native', async () => {
    mockUseSplashScreenContext.mockReturnValueOnce({ isSplashScreenHidden: true })

    renderRootNavigator()

    await act(async () => {})

    screen.getByText('Respect de ta vie privée')

    const quickAccessButton = screen.queryByText('Accéder au menu de navigation')

    expect(quickAccessButton).not.toBeOnTheScreen()
  })

  it('should increment logged in session count when user is logged in', async () => {
    renderRootNavigator()

    await screen.findByText('Respect de ta vie privée')

    expect(await storage.readObject<number>('logged_in_session_count')).toEqual(1)
  })

  it('should not increment logged in session count when user is not logged in', async () => {
    mockUseAuthContext.mockReturnValueOnce({ isLoggedIn: false })
    renderRootNavigator()

    await screen.findByText('Respect de ta vie privée')

    expect(await storage.readObject<number>('logged_in_session_count')).toBeNull()
  })
})

function renderRootNavigator() {
  render(
    reactQueryProviderHOC(
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    )
  )
}
