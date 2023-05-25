import { NavigationContainer } from '@react-navigation/native'
import { rest } from 'msw'
import React from 'react'

import { useMustUpdateApp } from 'features/forceUpdate/helpers/useMustUpdateApp'
import { useCurrentRoute } from 'features/navigation/helpers'
import { env } from 'libs/environment'
import { useSplashScreenContext } from 'libs/splashscreen'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { render, screen } from 'tests/utils/web'

import { RootNavigator } from './RootNavigator'

const mockUseSplashScreenContext = jest.mocked(useSplashScreenContext)
const mockedUseMustUpdateApp = jest.mocked(useMustUpdateApp)
const mockUseCurrentRoute = jest.mocked(useCurrentRoute)

jest.mock('features/share/helpers/useShareOffer')
jest.mock('features/cookies/helpers/useIsCookiesListUpToDate')
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
jest.mock('features/navigation/helpers')
jest.mock('features/navigation/navigationRef')
jest.mock('libs/splashscreen')

server.use(
  rest.get(env.API_BASE_URL + '/native/v1/me/favorites/count', (_req, res, ctx) =>
    res(ctx.status(200), ctx.json({ count: 2 }))
  )
)

describe('<RootNavigator />', () => {
  beforeEach(() => {
    mockUseCurrentRoute.mockReturnValue({ name: 'TabNavigator', key: 'key' })
  })

  it('should NOT display PrivacyPolicy if splash screen is not yet hidden', async () => {
    mockUseSplashScreenContext.mockReturnValueOnce({ isSplashScreenHidden: false })
    renderRootNavigator()

    const privacyPolicyTitle = screen.queryByText('Respect de ta vie privée')
    expect(privacyPolicyTitle).toBeFalsy()
  })

  it('should display PrivacyPolicy if splash screen is hidden', async () => {
    mockUseSplashScreenContext.mockReturnValueOnce({ isSplashScreenHidden: true })

    renderRootNavigator()

    const privacyPolicyTitle = await screen.findByText('Respect de ta vie privée')
    expect(privacyPolicyTitle).toBeTruthy()
  })

  it('should display quick access button if show tabBar and current route is TabNavigator', async () => {
    mockUseSplashScreenContext.mockReturnValueOnce({ isSplashScreenHidden: true })

    renderRootNavigator()

    expect(await screen.findByText('Accéder au menu de navigation')).toBeTruthy()
  })

  it('should not display quick access button if current route is not TabNavigator', async () => {
    mockUseSplashScreenContext.mockReturnValueOnce({ isSplashScreenHidden: true })
    mockUseCurrentRoute.mockReturnValueOnce({ name: 'Offer', key: 'key' })

    renderRootNavigator()

    await screen.findByText('Respect de ta vie privée')

    const quickAccessButton = screen.queryByText('Accéder au menu de navigation')
    expect(quickAccessButton).toBeNull()
  })
})

describe('ForceUpdate display logic', () => {
  it('should display force update page when global variable is set', async () => {
    mockUseCurrentRoute.mockReturnValueOnce({ name: 'TabNavigator', key: 'key' })
    mockedUseMustUpdateApp.mockReturnValueOnce(true)

    renderRootNavigator()

    await screen.findByText('Respect de ta vie privée')

    expect(screen.queryAllByText("Mise à jour de l'application")).toBeTruthy()
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
