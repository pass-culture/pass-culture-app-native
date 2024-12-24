import { NavigationContainer } from '@react-navigation/native'
import React from 'react'

import { useMustUpdateApp } from 'features/forceUpdate/helpers/useMustUpdateApp'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { storage } from 'libs/storage'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, render, screen, waitFor } from 'tests/utils'

import { RootNavigator } from './RootNavigator'

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
    mockedUseMustUpdateApp.mockReturnValue(true)
    storage.clear('logged_in_session_count')
  })

  it('should NOT display PrivacyPolicy', async () => {
    mockedUseMustUpdateApp.mockReturnValueOnce(false)
    renderRootNavigator()

    const privacyPolicyTitle = screen.queryByText('Respect de ta vie privée')

    await waitFor(() => expect(privacyPolicyTitle).not.toBeOnTheScreen())
  })

  it('should display PrivacyPolicy', async () => {
    mockedUseMustUpdateApp.mockReturnValueOnce(false)

    renderRootNavigator({ showPrivacyPolicy: true })
    await act(async () => {})
    const privacyPolicyTitle = screen.getByText('Respect de ta vie privée')

    expect(privacyPolicyTitle).toBeOnTheScreen()
  })

  it('should not display quick access button in native', async () => {
    renderRootNavigator({ showPrivacyPolicy: true })

    await act(async () => {})

    screen.getByText('Respect de ta vie privée')

    const quickAccessButton = screen.queryByText('Accéder au menu de navigation')

    expect(quickAccessButton).not.toBeOnTheScreen()
  })

  it('should increment logged in session count when user is logged in', async () => {
    renderRootNavigator({ showPrivacyPolicy: true })

    await screen.findByText('Respect de ta vie privée')

    expect(await storage.readObject<number>('logged_in_session_count')).toEqual(1)
  })

  it('should not increment logged in session count when user is not logged in', async () => {
    mockUseAuthContext.mockReturnValueOnce({ isLoggedIn: false })
    renderRootNavigator({ showPrivacyPolicy: true })

    await screen.findByText('Respect de ta vie privée')

    expect(await storage.readObject<number>('logged_in_session_count')).toBeNull()
  })
})

function renderRootNavigator(props?: { showPrivacyPolicy: boolean }) {
  render(
    reactQueryProviderHOC(
      <NavigationContainer>
        <RootNavigator showPrivacyPolicy={props?.showPrivacyPolicy} />
      </NavigationContainer>
    )
  )
}
