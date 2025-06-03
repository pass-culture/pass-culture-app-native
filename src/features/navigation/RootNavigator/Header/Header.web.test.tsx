import { render } from '@testing-library/react'
import React from 'react'
import { ThemeProvider as WebThemeProvider } from 'styled-components'
import { ThemeProvider } from 'styled-components/native'

import { FavoritesCountResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { useTabBarItemBadges } from 'features/navigation/helpers/useTabBarItemBadges'
import { TabNavigationStateProvider } from 'features/navigation/TabBar/TabNavigationStateContext'
import { initialSearchState } from 'features/search/context/reducer'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { screen } from 'tests/utils/web'
import { theme } from 'theme'

import { Header } from './Header'

jest.mock('libs/jwt/jwt')
jest.mock('features/favorites/context/FavoritesWrapper')

jest.mock('features/navigation/helpers/useTabBarItemBadges')
const mockUseTabBarItemBadges = useTabBarItemBadges as jest.Mock

const mockedUseAuthContext = useAuthContext as jest.Mock
jest.mock('features/auth/context/AuthContext')

jest.mock('features/navigation/RootNavigator/rootRoutes', () => ({
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

const mockSearchState = initialSearchState
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
  }),
}))

jest.mock('libs/firebase/analytics/analytics')

describe('Header', () => {
  beforeEach(() => {
    mockServer.getApi<FavoritesCountResponse>(`/v1/me/favorites/count`, { count: 2 })
    setFeatureFlags()
  })

  beforeAll(() => {
    mockUseTabBarItemBadges.mockReturnValue({
      Bookings: 999,
    })
  })

  it('should render correctly', async () => {
    renderHeader({ isLoggedIn: true, isBeneficiary: true })

    expect(await screen.findByText('Favoris')).toBeInTheDocument()
  })

  it('should render correctly when FF is enabled', async () => {
    setFeatureFlags([RemoteStoreFeatureFlags.WIP_REACTION_FEATURE])
    renderHeader({ isLoggedIn: true, isBeneficiary: true })

    expect(await screen.findByText('Favoris')).toBeInTheDocument()
    expect(await screen.findByText('99+')).toBeInTheDocument()
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

  it('should render Header for beneficiary and logged in users', () => {
    renderHeader({ isLoggedIn: true, isBeneficiary: true })

    expect(screen.getByText('Accueil')).toBeInTheDocument()
    expect(screen.getByText('Recherche')).toBeInTheDocument()
    expect(screen.getByText('Réservations')).toBeInTheDocument()
    expect(screen.getByText('Favoris')).toBeInTheDocument()
    expect(screen.getByText('Profil')).toBeInTheDocument()
  })

  it('should identify one tab as current page', () => {
    renderHeader({ isLoggedIn: true, isBeneficiary: true })

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
