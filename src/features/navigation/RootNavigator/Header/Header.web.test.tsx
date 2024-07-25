import { render } from '@testing-library/react'
import React from 'react'
import { ThemeProvider as WebThemeProvider } from 'styled-components'
import { ThemeProvider } from 'styled-components/native'

import { FavoritesCountResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { TabNavigationStateProvider } from 'features/navigation/TabBar/TabNavigationStateContext'
import { initialSearchState } from 'features/search/context/reducer'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, screen } from 'tests/utils/web'
import { theme } from 'theme'

import { Header } from './Header'

jest.mock('libs/jwt/jwt')
jest.mock('features/favorites/context/FavoritesWrapper')

const mockedUseAuthContext = useAuthContext as jest.Mock
jest.mock('features/auth/context/AuthContext')

jest.mock('features/navigation/RootNavigator/routes', () => ({
  routes: [
    {
      name: 'TabNavigator',
      component: () => null,
      pathConfig: {
        initialRouteName: 'Home',
        screens: {
          Home: undefined,
        },
      },
    },
  ],
}))

const useFeatureFlagSpy = jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(false)
const mockSearchState = initialSearchState
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
  }),
}))
jest.mock('libs/firebase/remoteConfig/remoteConfig.services')
jest.mock('libs/firebase/analytics/analytics')

describe('Header', () => {
  beforeEach(() => {
    mockServer.getApi<FavoritesCountResponse>(`/v1/me/favorites/count`, { count: 2 })
  })

  it('should render correctly', async () => {
    const { container } = renderHeader({ isLoggedIn: true, isBeneficiary: true })

    await screen.findByText('Favoris')

    expect(container).toMatchSnapshot()
  })

  it('should render correctly when FF is enabled', async () => {
    useFeatureFlagSpy.mockReturnValueOnce(true)
    const { container } = renderHeader({ isLoggedIn: true, isBeneficiary: true })

    await screen.findByText('Favoris')
    await screen.findByText('2')

    expect(container).toMatchSnapshot()
  })

  it('should render Header without Bookings item for non-beneficiary and logged out users', () => {
    renderHeader({ isLoggedIn: false, isBeneficiary: false })

    expect(screen.getByText('Accueil')).toBeInTheDocument()
    expect(screen.getByText('Recherche')).toBeInTheDocument()
    expect(screen.queryByText('Réservations')).not.toBeInTheDocument()
    expect(screen.getByText('Favoris')).toBeInTheDocument()
    expect(screen.getByText('Profil')).toBeInTheDocument()
  })

  it('should render Header without Bookings item for non-beneficiary and logged in users', () => {
    renderHeader({ isLoggedIn: false, isBeneficiary: false })

    expect(screen.getByText('Accueil')).toBeInTheDocument()
    expect(screen.getByText('Recherche')).toBeInTheDocument()
    expect(screen.queryByText('Réservations')).not.toBeInTheDocument()
    expect(screen.getByText('Favoris')).toBeInTheDocument()
    expect(screen.getByText('Profil')).toBeInTheDocument()
  })

  it('should render Header for beneficiary and logged in users', async () => {
    renderHeader({ isLoggedIn: true, isBeneficiary: true })

    await act(async () => {}) // Warning: An update to BicolorFavoriteCount inside a test was not wrapped in act(...).

    expect(screen.getByText('Accueil')).toBeInTheDocument()
    expect(screen.getByText('Recherche')).toBeInTheDocument()
    expect(screen.getByText('Réservations')).toBeInTheDocument()
    expect(screen.getByText('Favoris')).toBeInTheDocument()
    expect(screen.getByText('Profil')).toBeInTheDocument()
  })

  it('should identify one tab as current page', async () => {
    renderHeader({ isLoggedIn: true, isBeneficiary: true })

    await act(async () => {}) // Warning: An update to BicolorFavoriteCount inside a test was not wrapped in act(...).

    const tabs = ['SearchStackNavigator tab', 'Bookings tab', 'Favorites tab', 'Profile tab'].map(
      (tabId) => screen.getByTestId(tabId)
    )

    expect(screen.getByTestId('Home tab').getAttribute('aria-current')).toEqual('page')

    tabs.forEach((tab) => expect(tab.getAttribute('aria-current')).toBeNull())
  })
})

function renderHeader({
  isLoggedIn,
  isBeneficiary,
}: {
  isLoggedIn: boolean
  isBeneficiary: boolean
}) {
  // We mock the authContext 3 times due to multiple rerenders
  mockedUseAuthContext.mockReturnValueOnce({
    isLoggedIn,
    user: { isBeneficiary },
  })
  mockedUseAuthContext.mockReturnValueOnce({
    isLoggedIn,
    user: { isBeneficiary },
  })
  mockedUseAuthContext.mockReturnValueOnce({
    isLoggedIn,
    user: { isBeneficiary },
  })

  return render(
    reactQueryProviderHOC(
      <WebThemeProvider theme={{ ...theme, showTabBar: false }}>
        <ThemeProvider theme={{ ...theme, showTabBar: false }}>
          <TabNavigationStateProvider>
            <Header mainId="" />
          </TabNavigationStateProvider>
        </ThemeProvider>
      </WebThemeProvider>
    )
  )
}
