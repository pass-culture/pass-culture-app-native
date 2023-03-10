import { render } from '@testing-library/react'
import React from 'react'
import { ThemeProvider as WebThemeProvider } from 'styled-components'
import { ThemeProvider } from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { TabNavigationStateProvider } from 'features/navigation/TabBar/TabNavigationStateContext'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { screen } from 'tests/utils/web'
import { theme } from 'theme'

import { Header } from './Header'

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

describe('Header', () => {
  it('should render Header without Bookings item for non-beneficiary and logged out users', () => {
    renderHeader({ isLoggedIn: false, isBeneficiary: false })
    expect(screen.queryByText('Accueil')).toBeTruthy()
    expect(screen.queryByText('Recherche')).toBeTruthy()
    expect(screen.queryByText('Réservations')).toBeFalsy()
    expect(screen.queryByText('Favoris')).toBeTruthy()
    expect(screen.queryByText('Profil')).toBeTruthy()
  })

  it('should render Header without Bookings item for non-beneficiary and logged in users', () => {
    renderHeader({ isLoggedIn: false, isBeneficiary: false })
    expect(screen.queryByText('Accueil')).toBeTruthy()
    expect(screen.queryByText('Recherche')).toBeTruthy()
    expect(screen.queryByText('Réservations')).toBeFalsy()
    expect(screen.queryByText('Favoris')).toBeTruthy()
    expect(screen.queryByText('Profil')).toBeTruthy()
  })

  it('should render Header for beneficiary and logged in users', () => {
    renderHeader({ isLoggedIn: true, isBeneficiary: true })
    expect(screen.queryByText('Accueil')).toBeTruthy()
    expect(screen.queryByText('Recherche')).toBeTruthy()
    expect(screen.queryByText('Réservations')).toBeTruthy()
    expect(screen.queryByText('Favoris')).toBeTruthy()
    expect(screen.queryByText('Profil')).toBeTruthy()
  })

  it('should identify one tab as current page', () => {
    renderHeader({ isLoggedIn: true, isBeneficiary: true })
    expect(screen.getByTestId('Home tab')?.getAttribute('aria-current')).toEqual('page')
    expect(screen.getByTestId('Search tab')?.getAttribute('aria-current')).toBeNull()
    expect(screen.getByTestId('Bookings tab')?.getAttribute('aria-current')).toBeNull()
    expect(screen.getByTestId('Favorites tab')?.getAttribute('aria-current')).toBeNull()
    expect(screen.getByTestId('Profile tab')?.getAttribute('aria-current')).toBeNull()
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
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
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
