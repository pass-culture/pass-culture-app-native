import { render } from '@testing-library/react'
import React from 'react'
import { ThemeProvider as WebThemeProvider } from 'styled-components'
import { ThemeProvider } from 'styled-components/native'

import { useAuthContext } from 'features/auth/AuthContext'
import { useUserProfileInfo } from 'features/home/api'
import { TabNavigationStateProvider } from 'features/navigation/TabBar/TabNavigationStateContext'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { theme } from 'theme'

import { Header } from '../Header'

const mockedUseAuthContext = useAuthContext as jest.Mock
jest.mock('features/auth/AuthContext', () => ({ useAuthContext: jest.fn() }))

const mockedUseUserProfileInfo = useUserProfileInfo as jest.Mock
jest.mock('features/home/api', () => ({ useUserProfileInfo: jest.fn() }))

describe('Header', () => {
  it('should render Header without Bookings item for non-beneficiary and logged out users', () => {
    const { queryByText } = renderHeader({ isLoggedIn: false, isBeneficiary: false })
    expect(queryByText('Accueil')).toBeTruthy()
    expect(queryByText('Recherche')).toBeTruthy()
    expect(queryByText('Réservations')).toBeFalsy()
    expect(queryByText('Favoris')).toBeTruthy()
    expect(queryByText('Profil')).toBeTruthy()
  })

  it('should render Header without Bookings item for non-beneficiary and logged in users', () => {
    const { queryByText } = renderHeader({ isLoggedIn: true, isBeneficiary: false })
    expect(queryByText('Accueil')).toBeTruthy()
    expect(queryByText('Recherche')).toBeTruthy()
    expect(queryByText('Réservations')).toBeFalsy()
    expect(queryByText('Favoris')).toBeTruthy()
    expect(queryByText('Profil')).toBeTruthy()
  })

  it('should render Header for beneficiary and logged in users', () => {
    const { queryByText } = renderHeader({ isLoggedIn: true, isBeneficiary: true })
    expect(queryByText('Accueil')).toBeTruthy()
    expect(queryByText('Recherche')).toBeTruthy()
    expect(queryByText('Réservations')).toBeTruthy()
    expect(queryByText('Favoris')).toBeTruthy()
    expect(queryByText('Profil')).toBeTruthy()
  })
})

function renderHeader({
  isLoggedIn,
  isBeneficiary,
}: {
  isLoggedIn: boolean
  isBeneficiary: boolean
}) {
  mockedUseAuthContext.mockReturnValue({ isLoggedIn })
  mockedUseUserProfileInfo.mockReturnValue({ data: { isBeneficiary } })

  return render(
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    reactQueryProviderHOC(
      <WebThemeProvider theme={{ ...theme, showTabBar: false }}>
        <ThemeProvider theme={{ ...theme, showTabBar: false }}>
          <TabNavigationStateProvider>
            <Header />
          </TabNavigationStateProvider>
        </ThemeProvider>
      </WebThemeProvider>
    )
  )
}
