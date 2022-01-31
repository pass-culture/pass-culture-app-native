import { NavigationContainer } from '@react-navigation/native'
import React from 'react'
import { mocked } from 'ts-jest/utils'
import waitForExpect from 'wait-for-expect'

import { useMustUpdateApp } from 'features/forceUpdate/useMustUpdateApp'
import { useCurrentRoute } from 'features/navigation/helpers'
import { useSplashScreenContext } from 'libs/splashscreen'
import { storage } from 'libs/storage'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render } from 'tests/utils/web'

import { RootNavigator } from '../RootNavigator'

jest.mock('features/forceUpdate/useMustUpdateApp')
const mockedUseMustUpdateApp = mocked(useMustUpdateApp)
jest.mock('@react-navigation/native', () => jest.requireActual('@react-navigation/native'))
jest.mock('features/home/api') // for useUserProfileInfo()
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
const mockUseCurrentRoute = mocked(useCurrentRoute)

jest.mock('libs/splashscreen')
const mockUseSplashScreenContext = mocked(useSplashScreenContext)

// eslint-disable-next-line local-rules/no-allow-console
allowConsole({
  warn: true,
  error: true,
})

describe('<RootNavigator />', () => {
  beforeEach(() => {
    mockUseCurrentRoute.mockReturnValue({ name: 'TabNavigator', key: 'key' })
  })

  afterEach(async () => {
    await storage.clear('has_accepted_cookie')
  })

  it('should NOT display PrivacyPolicy if splash screen is not yet hidden', async () => {
    // eslint-disable-next-line local-rules/independant-mocks
    mockUseSplashScreenContext.mockReturnValue({ isSplashScreenHidden: false })
    const renderAPI = await renderRootNavigator()

    const privacyPolicyTitle = renderAPI.queryByText('Respect de ta vie privée')
    expect(privacyPolicyTitle).toBeFalsy()
    renderAPI.unmount()
  })

  it('should display PrivacyPolicy if splash screen is hidden', async () => {
    // eslint-disable-next-line local-rules/independant-mocks
    mockUseSplashScreenContext.mockReturnValue({ isSplashScreenHidden: true })

    const renderAPI = await renderRootNavigator()

    await waitForExpect(() => {
      const privacyPolicyTitle = renderAPI.getByText('Respect de ta vie privée')
      expect(privacyPolicyTitle).toBeTruthy()
    })
    renderAPI.unmount()
  })
})

describe('ForceUpdate display logic', () => {
  afterEach(async () => {
    await storage.clear('has_accepted_cookie')
  })

  it('should display force update page when global variable is set', async () => {
    await storage.saveObject('has_accepted_cookie', false)
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

  return renderAPI
}
