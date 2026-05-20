import { render } from '@testing-library/react'
import React from 'react'
import { ThemeProvider as WebThemeProvider } from 'styled-components'
import { ThemeProvider } from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { useTabBarItemBadges } from 'features/navigation/helpers/useTabBarItemBadges'
import { TabNavigationStateProvider } from 'features/navigation/TabBar/TabNavigationStateContext'
import { initialSearchState } from 'features/search/context/reducer'
import { UserProfile } from 'features/share/types'
import { beneficiaryUserV2, nonBeneficiaryUserV2 } from 'fixtures/user'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
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

const mockSearchState = initialSearchState
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
  }),
}))

jest.mock('libs/firebase/analytics/analytics')

describe('Header', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  beforeAll(() => {
    mockUseTabBarItemBadges.mockReturnValue({
      Bookings: 999,
    })
  })

  it('should render correctly', async () => {
    renderHeader({ isLoggedIn: true, user: beneficiaryUserV2 })

    expect(await screen.findByText('Favoris')).toBeInTheDocument()
    expect(await screen.findByText('99+')).toBeInTheDocument()
  })

  it('should render Header without Bookings item for non-beneficiary and logged out users', () => {
    renderHeader({ isLoggedIn: false, user: nonBeneficiaryUserV2 })

    expect(screen.getByText('Accueil')).toBeInTheDocument()
    expect(screen.getByText('Recherche')).toBeInTheDocument()
    expect(screen.queryByText('Réservations')).not.toBeInTheDocument()
    expect(screen.getByText('Favoris')).toBeInTheDocument()
    expect(screen.getByText('Profil')).toBeInTheDocument()
  })

  it('should render Header without Bookings item for non-beneficiary and logged in users', () => {
    renderHeader({ isLoggedIn: false, user: nonBeneficiaryUserV2 })

    expect(screen.getByText('Accueil')).toBeInTheDocument()
    expect(screen.getByText('Recherche')).toBeInTheDocument()
    expect(screen.queryByText('Réservations')).not.toBeInTheDocument()
    expect(screen.getByText('Favoris')).toBeInTheDocument()
    expect(screen.getByText('Profil')).toBeInTheDocument()
  })

  it('should render Header for beneficiary and logged in users', () => {
    renderHeader({ isLoggedIn: true, user: beneficiaryUserV2 })

    expect(screen.getByText('Accueil')).toBeInTheDocument()
    expect(screen.getByText('Recherche')).toBeInTheDocument()
    expect(screen.getByText('Réservations')).toBeInTheDocument()
    expect(screen.getByText('Favoris')).toBeInTheDocument()
    expect(screen.getByText('Profil')).toBeInTheDocument()
  })

  it('should identify one tab as current page', () => {
    renderHeader({ isLoggedIn: true, user: beneficiaryUserV2 })

    const tabs = [
      'Accueil',
      'Rechercher des offres',
      'Mes réservations',
      'Mes favoris',
      'Mon profil',
    ].map((tabId) => screen.getByTestId(tabId))

    expect(screen.getByTestId('Accueil').getAttribute('aria-current')).toEqual('page')

    tabs
      .filter((tab) => tab.getAttribute('aria-current') !== 'page')
      .forEach((tab) => expect(tab.getAttribute('aria-current')).toBeNull())
  })
})

function renderHeader({ isLoggedIn, user }: { isLoggedIn: boolean; user: UserProfile }) {
  mockedUseAuthContext.mockReturnValueOnce({
    isLoggedIn,
    user,
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
