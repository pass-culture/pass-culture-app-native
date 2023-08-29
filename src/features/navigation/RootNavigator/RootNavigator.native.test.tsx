import { NavigationContainer } from '@react-navigation/native'
import React from 'react'

import { useMustUpdateApp } from 'features/forceUpdate/helpers/useMustUpdateApp'
import { useSplashScreenContext } from 'libs/splashscreen'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, render, screen } from 'tests/utils'

import { RootNavigator } from './RootNavigator'

const mockUseSplashScreenContext = jest.mocked(useSplashScreenContext)
const mockedUseMustUpdateApp = jest.mocked(useMustUpdateApp)

jest.mock('features/navigation/navigationRef')
jest.mock('features/forceUpdate/helpers/useMustUpdateApp')
jest.mock('@react-navigation/native', () => jest.requireActual('@react-navigation/native'))
jest.mock('features/auth/context/AuthContext')
jest.mock('react-error-boundary', () => ({
  withErrorBoundary: (component: React.ReactNode, _: unknown) => component,
}))
jest.mock('features/navigation/TabBar/TabNavigator', () => ({
  TabNavigator: () => null,
}))
jest.mock('features/navigation/RootNavigator/useInitialScreenConfig', () => ({
  useInitialScreen: () => 'TabNavigator',
}))
jest.mock('features/navigation/helpers', () => ({
  useCurrentRoute: () => ({ name: 'TabNavigator', key: 'key' }),
}))
jest.mock('libs/splashscreen')

describe('<RootNavigator />', () => {
  beforeEach(() => mockedUseMustUpdateApp.mockReturnValue(true))

  it('should NOT display PrivacyPolicy if splash screen is not yet hidden', async () => {
    mockedUseMustUpdateApp.mockReturnValueOnce(false)
    mockUseSplashScreenContext.mockReturnValueOnce({ isSplashScreenHidden: false })
    renderRootNavigator()

    const privacyPolicyTitle = screen.queryByText('Respect de ta vie privée')
    expect(privacyPolicyTitle).toBeFalsy()
  })

  it('should display PrivacyPolicy if splash screen is hidden', async () => {
    mockedUseMustUpdateApp.mockReturnValueOnce(false)
    mockUseSplashScreenContext.mockReturnValueOnce({ isSplashScreenHidden: true })

    renderRootNavigator()
    await act(async () => {})
    const privacyPolicyTitle = screen.getByText('Respect de ta vie privée')
    expect(privacyPolicyTitle).toBeTruthy()
  })

  it('should not display quick access button in native', async () => {
    mockUseSplashScreenContext.mockReturnValueOnce({ isSplashScreenHidden: true })

    renderRootNavigator()

    await act(async () => {})

    screen.getByText('Respect de ta vie privée')

    const quickAccessButton = screen.queryByText('Accéder au menu de navigation')
    expect(quickAccessButton).toBeNull()
  })
})

function renderRootNavigator() {
  render(
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    reactQueryProviderHOC(
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    )
  )
}
