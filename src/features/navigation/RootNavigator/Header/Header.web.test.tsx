import { render } from '@testing-library/react'
import { rest } from 'msw'
import React from 'react'
import { ThemeProvider as WebThemeProvider } from 'styled-components'
import { ThemeProvider } from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { TabNavigationStateProvider } from 'features/navigation/TabBar/TabNavigationStateContext'
import { env } from 'libs/environment'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { screen, act } from 'tests/utils/web'
import { theme } from 'theme'

import { Header } from './Header'

const mockedUseAuthContext = useAuthContext as jest.Mock
jest.mock('features/auth/context/AuthContext')

server.use(
  rest.get(env.API_BASE_URL + '/native/v1/me/favorites/count', (_req, res, ctx) =>
    res(ctx.status(200), ctx.json({ count: 2 }))
  )
)

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

    const tabs = ['Search tab', 'Bookings tab', 'Favorites tab', 'Profile tab'].map((tabId) =>
      screen.getByTestId(tabId)
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
