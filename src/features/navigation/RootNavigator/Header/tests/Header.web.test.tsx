import { render } from '@testing-library/react'
import React from 'react'
import { ThemeProvider as WebThemeProvider } from 'styled-components'
import { ThemeProvider } from 'styled-components/native'

import { useAuthContext } from 'features/auth/AuthContext'
import { TabNavigationStateProvider } from 'features/navigation/TabBar/TabNavigationStateContext'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { theme } from 'theme'

import { Header } from '../Header'

const mockedUseAuthContext = useAuthContext as jest.Mock
jest.mock('features/auth/AuthContext')

describe('Header', () => {
  it('should render Header without Bookings item for non-beneficiary and logged out users', () => {
    mockedUseAuthContext.mockReturnValueOnce({
      user: { isBeneficiary: false },
      isLoggedIn: false,
    })
    const { queryByText } = renderHeader({ isLoggedIn: false })
    expect(queryByText('Accueil')).toBeTruthy()
    expect(queryByText('Recherche')).toBeTruthy()
    expect(queryByText('Réservations')).toBeFalsy()
    expect(queryByText('Favoris')).toBeTruthy()
    expect(queryByText('Profil')).toBeTruthy()
  })

  it('should render Header without Bookings item for non-beneficiary and logged in users', () => {
    mockedUseAuthContext.mockReturnValueOnce({
      user: { isBeneficiary: false },
      isLoggedIn: false,
    })
    const { queryByText } = renderHeader({ isLoggedIn: true })
    expect(queryByText('Accueil')).toBeTruthy()
    expect(queryByText('Recherche')).toBeTruthy()
    expect(queryByText('Réservations')).toBeFalsy()
    expect(queryByText('Favoris')).toBeTruthy()
    expect(queryByText('Profil')).toBeTruthy()
  })

  it('should render Header for beneficiary and logged in users', () => {
    mockedUseAuthContext.mockReturnValueOnce({
      user: { isBeneficiary: true },
      isLoggedIn: true,
    })
    const { queryByText } = renderHeader({ isLoggedIn: true })
    expect(queryByText('Accueil')).toBeTruthy()
    expect(queryByText('Recherche')).toBeTruthy()
    expect(queryByText('Réservations')).toBeTruthy()
    expect(queryByText('Favoris')).toBeTruthy()
    expect(queryByText('Profil')).toBeTruthy()
  })

  it('should identify one tab as current page', () => {
    mockedUseAuthContext.mockReturnValueOnce({
      user: { isBeneficiary: true },
      isLoggedIn: true,
    })
    const { getByTestId } = renderHeader({ isLoggedIn: true })
    expect(getByTestId('Home tab')?.getAttribute('aria-current')).toEqual('page')
    expect(getByTestId('Search tab')?.getAttribute('aria-current')).toBeNull()
    expect(getByTestId('Bookings tab')?.getAttribute('aria-current')).toBeNull()
    expect(getByTestId('Favorites tab')?.getAttribute('aria-current')).toBeNull()
    expect(getByTestId('Profile tab')?.getAttribute('aria-current')).toBeNull()
  })
})

function renderHeader({ isLoggedIn }: { isLoggedIn: boolean }) {
  mockedUseAuthContext.mockReturnValue({ isLoggedIn, user: { isBeneficiary: true } })

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
