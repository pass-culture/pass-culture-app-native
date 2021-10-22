import { render } from '@testing-library/react'
import React from 'react'
import { ThemeProvider } from 'styled-components/native'

import { useAuthContext } from 'features/auth/AuthContext'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { theme } from 'theme'

import { Header } from '../Header'

const mockedUseAuthContext = useAuthContext as jest.Mock

jest.mock('features/auth/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ isLoggedIn: true })),
}))

describe('Header', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })
  afterEach(() => {
    jest.clearAllMocks()
    jest.useRealTimers()
  })

  it('should render Header for non authed account', () => {
    const { queryByText } = renderHeader(false)

    jest.advanceTimersByTime(1000)
    expect(queryByText('Accueil')).toBeTruthy()
    expect(queryByText('Recherche')).toBeTruthy()
    expect(queryByText('Réservations')).toBeFalsy()
    expect(queryByText('Favoris')).toBeTruthy()
    expect(queryByText('Profil')).toBeTruthy()
  })

  it('should render Header for authed account', () => {
    const { queryByText } = renderHeader(true)

    jest.advanceTimersByTime(1000)
    expect(queryByText('Accueil')).toBeTruthy()
    expect(queryByText('Recherche')).toBeTruthy()
    expect(queryByText('Réservations')).toBeTruthy()
    expect(queryByText('Favoris')).toBeTruthy()
    expect(queryByText('Profil')).toBeTruthy()
  })
})

function renderHeader(isLoggedIn: boolean) {
  // mock connection state
  mockedUseAuthContext.mockImplementationOnce(() => ({ isLoggedIn }))

  const wrapper = render(
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    reactQueryProviderHOC(
      <ThemeProvider theme={{ ...theme, isDesktop: true }}>
        <Header />
      </ThemeProvider>
    )
  )

  return wrapper
}
