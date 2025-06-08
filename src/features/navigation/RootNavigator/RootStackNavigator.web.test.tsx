import { NavigationContainer } from '@react-navigation/native'
import React from 'react'

import { FavoritesCountResponse, SubcategoriesResponseModelv2 } from 'api/gen'
import * as CookiesUpToDate from 'features/cookies/helpers/useIsCookiesListUpToDate'
import { useCurrentRoute } from 'features/navigation/helpers/useCurrentRoute'
import { initialSearchState } from 'features/search/context/reducer'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { useSplashScreenContext } from 'libs/splashscreen'
import { subcategoriesDataTest } from 'libs/subcategories/fixtures/subcategoriesResponse'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, render, screen } from 'tests/utils/web'

import { RootNavigator } from './RootStackNavigator'

const mockUseSplashScreenContext = jest.mocked(useSplashScreenContext)
const mockUseCurrentRoute = jest.mocked(useCurrentRoute)

jest
  .spyOn(CookiesUpToDate, 'useIsCookiesListUpToDate')
  .mockReturnValue({ isCookiesListUpToDate: true, cookiesLastUpdate: undefined, isLoading: false })
jest.mock('features/forceUpdate/helpers/useMustUpdateApp')
jest.unmock('@react-navigation/native')
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
jest.mock('features/navigation/helpers/useCurrentRoute')
jest.mock('features/navigation/navigationRef')
jest.mock('libs/splashscreen')

const mockSearchState = initialSearchState
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
    hideSuggestions: jest.fn(),
  }),
}))

jest.mock('libs/firebase/analytics/analytics')

describe('<RootNavigator />', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  beforeEach(() => {
    mockUseCurrentRoute.mockReturnValue({ name: 'TabNavigator', key: 'key' })
    mockServer.getApi<FavoritesCountResponse>('/v1/me/favorites/count', { count: 2 })
    mockServer.getApi<SubcategoriesResponseModelv2>('/v1/subcategories/v2', subcategoriesDataTest)
  })

  it('should NOT display PrivacyPolicy if splash screen is not yet hidden', async () => {
    mockUseSplashScreenContext.mockReturnValueOnce({ isSplashScreenHidden: false })
    renderRootNavigator()
    await act(async () => {}) // Warning: An update to BicolorFavoriteCount inside a test was not wrapped in act(...).
    const privacyPolicyTitle = screen.queryByText('Respect de ta vie privée')

    expect(privacyPolicyTitle).not.toBeInTheDocument()
  })

  it('should display PrivacyPolicy if splash screen is hidden', async () => {
    mockUseSplashScreenContext.mockReturnValueOnce({ isSplashScreenHidden: true })

    renderRootNavigator()

    const privacyPolicyTitle = await screen.findByText('Respect de ta vie privée')

    expect(privacyPolicyTitle).toBeInTheDocument()
  })

  it('should display quick access button if show tabBar and current route is TabNavigator', async () => {
    mockUseSplashScreenContext.mockReturnValueOnce({ isSplashScreenHidden: true })

    renderRootNavigator()
    await act(async () => {})

    expect(await screen.findByText('Accéder au menu de navigation')).toBeInTheDocument()
  })

  it('should not display quick access button if current route is not TabNavigator', async () => {
    mockUseSplashScreenContext.mockReturnValueOnce({ isSplashScreenHidden: true })
    mockUseCurrentRoute.mockReturnValueOnce({ name: 'Offer', key: 'key' })

    renderRootNavigator()

    await screen.findByText('Respect de ta vie privée')

    const quickAccessButton = screen.queryByText('Accéder au menu de navigation')

    expect(quickAccessButton).not.toBeInTheDocument()
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
