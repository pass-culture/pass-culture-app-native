import { NavigationContainer } from '@react-navigation/native'
import React from 'react'
import { mocked } from 'ts-jest/utils'

import { useMustUpdateApp } from 'features/forceUpdate/useMustUpdateApp'
import { useCurrentRoute } from 'features/navigation/helpers'
import { useSplashScreenContext } from 'libs/splashscreen'
import { storage } from 'libs/storage'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { flushAllPromisesWithAct, render } from 'tests/utils/web'

import { RootNavigator } from '../RootNavigator'

const mockUseSplashScreenContext = mocked(useSplashScreenContext)
const mockedUseMustUpdateApp = mocked(useMustUpdateApp)
const mockUseCurrentRoute = mocked(useCurrentRoute)
const mockSettings = jest.fn().mockReturnValue({
  data: { appEnableCookiesV2: false },
})

jest.mock('features/cookies/helpers/useIsCookiesListUpToDate')
jest.mock('features/forceUpdate/useMustUpdateApp')
jest.mock('@react-navigation/native', () => jest.requireActual('@react-navigation/native'))
jest.mock('features/profile/api') // for useUserProfileInfo()
jest.mock('features/auth/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ isLoggedIn: true })),
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
jest.mock('features/navigation/helpers')
jest.mock('features/auth/settings', () => ({
  useAppSettings: jest.fn(() => mockSettings()),
}))
jest.mock('libs/splashscreen')

describe('<RootNavigator />', () => {
  beforeEach(() => {
    mockUseCurrentRoute.mockReturnValue({ name: 'TabNavigator', key: 'key' })
  })

  afterEach(async () => {
    await storage.clear('has_accepted_cookie')
  })

  it('should NOT display PrivacyPolicy if splash screen is not yet hidden', async () => {
    mockUseSplashScreenContext.mockReturnValueOnce({ isSplashScreenHidden: false })
    const renderAPI = await renderRootNavigator()

    const privacyPolicyTitle = renderAPI.queryByText('Respect de ta vie privée')
    expect(privacyPolicyTitle).toBeFalsy()
    renderAPI.unmount()
  })

  it('should display PrivacyPolicy if splash screen is hidden', async () => {
    mockUseSplashScreenContext.mockReturnValueOnce({ isSplashScreenHidden: true })

    const renderAPI = await renderRootNavigator()

    const privacyPolicyTitle = renderAPI.getByText('Respect de ta vie privée')
    expect(privacyPolicyTitle).toBeTruthy()
    renderAPI.unmount()
  })

  it('should display quick access button if show tabBar and current route is TabNavigator', async () => {
    mockUseSplashScreenContext.mockReturnValueOnce({ isSplashScreenHidden: true })

    const renderAPI = await renderRootNavigator()

    const quickAccessButton = renderAPI.queryByText('Accéder au menu de navigation')
    expect(quickAccessButton).toBeTruthy()
  })

  it('should not display quick access button if current route is not TabNavigator', async () => {
    mockUseSplashScreenContext.mockReturnValueOnce({ isSplashScreenHidden: true })
    mockUseCurrentRoute.mockReturnValueOnce({ name: 'Offer', key: 'key' })

    const renderAPI = await renderRootNavigator()

    const quickAccessButton = renderAPI.queryByText('Accéder au menu de navigation')
    expect(quickAccessButton).toBeNull()
  })
})

describe('ForceUpdate display logic', () => {
  it('should display force update page when global variable is set', async () => {
    await storage.saveObject('has_accepted_cookie', false)
    mockUseCurrentRoute.mockReturnValueOnce({ name: 'TabNavigator', key: 'key' })
    mockedUseMustUpdateApp.mockReturnValueOnce(true)

    const rootNavigator = await renderRootNavigator()

    expect(rootNavigator).toMatchSnapshot()
    expect(rootNavigator.queryAllByText("Mise à jour de l'application")).toBeTruthy()
  })
})

async function renderRootNavigator() {
  const renderAPI = render(
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    reactQueryProviderHOC(
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    )
  )

  await flushAllPromisesWithAct()
  return renderAPI
}
