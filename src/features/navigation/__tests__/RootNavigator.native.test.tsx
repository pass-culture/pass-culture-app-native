import { NavigationContainer } from '@react-navigation/native'
import React from 'react'
import { mocked } from 'ts-jest/utils'

import { useMustUpdateApp } from 'features/forceUpdate/useMustUpdateApp'
import { useSplashScreenContext } from 'libs/splashscreen'
import { render, flushAllPromisesWithAct } from 'tests/utils'

import { RootNavigator } from '../RootNavigator'

const mockUseSplashScreenContext = mocked(useSplashScreenContext)
const mockedUseMustUpdateApp = mocked(useMustUpdateApp)

jest.mock('features/forceUpdate/useMustUpdateApp')
jest.mock('@react-navigation/native', () => jest.requireActual('@react-navigation/native'))
jest.mock('features/auth/AuthContext')
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
    const renderAPI = await renderRootNavigator()

    const privacyPolicyTitle = renderAPI.queryByText('Respect de ta vie privée')
    expect(privacyPolicyTitle).toBeFalsy()
    renderAPI.unmount()
  })

  it('should display PrivacyPolicy if splash screen is hidden', async () => {
    mockedUseMustUpdateApp.mockReturnValueOnce(false)
    mockUseSplashScreenContext.mockReturnValueOnce({ isSplashScreenHidden: true })

    const renderAPI = await renderRootNavigator()

    const privacyPolicyTitle = renderAPI.queryByText('Respect de ta vie privée')
    expect(privacyPolicyTitle).toBeTruthy()
    renderAPI.unmount()
  })

  it('should not display quick access button in native', async () => {
    mockUseSplashScreenContext.mockReturnValueOnce({ isSplashScreenHidden: true })

    const renderAPI = await renderRootNavigator()

    const quickAccessButton = renderAPI.queryByText('Accéder au menu de navigation')
    expect(quickAccessButton).toBeNull()
  })
})

describe('ForceUpdate display logic', () => {
  it('should display force update page when global variable is set', async () => {
    const rootNavigator = await renderRootNavigator()

    expect(rootNavigator.queryAllByText('Mise à jour de l’application')).toBeTruthy()
  })
})

async function renderRootNavigator() {
  const renderAPI = render(
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  )

  await flushAllPromisesWithAct()
  return renderAPI
}
