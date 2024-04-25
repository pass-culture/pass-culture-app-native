import React from 'react'

import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { navigateToHome } from 'features/navigation/helpers/navigateToHome'
import { ROUTE_PARAMS } from 'features/trustedDevice/fixtures/fixtures'
import { analytics } from 'libs/analytics'
import { fireEvent, render, screen } from 'tests/utils'

import { AccountSecurity } from './AccountSecurity'

jest.unmock('jwt-decode')
jest.mock('features/navigation/helpers/navigateToHome')
jest.mock('features/auth/context/AuthContext')
const mockUseAuthContext = useAuthContext as jest.Mock
const { user: globalMockUser } = mockUseAuthContext()

describe('<AccountSecurity/>', () => {
  describe('with route params', () => {
    beforeEach(() => {
      useRoute.mockReturnValueOnce({ params: ROUTE_PARAMS })
    })

    describe('when user is connected and has a password', () => {
      beforeEach(() => {
        mockUseAuthContext.mockReturnValueOnce({
          user: { ...globalMockUser, hasPassword: true },
          isLoggedIn: true,
        })
      })

      it('should match snapshot with valid token', () => {
        render(<AccountSecurity />)

        expect(screen).toMatchSnapshot()
      })

      it('should navigate to reinitialize password when choosing this option', () => {
        render(<AccountSecurity />)

        fireEvent.press(screen.getByText('Modifier mon mot de passe'))

        expect(navigate).toHaveBeenCalledWith('ReinitializePassword', {
          email: ROUTE_PARAMS.email,
          expiration_timestamp: ROUTE_PARAMS.reset_token_expiration_timestamp,
          token: ROUTE_PARAMS.reset_password_token,
          from: 'suspiciouslogin',
        })
      })

      it('should navigate to home password when choosing no security', () => {
        render(<AccountSecurity />)

        fireEvent.press(screen.getByText('Ne pas sécuriser mon compte'))

        expect(navigateToHome).toHaveBeenCalledTimes(1)
      })

      it('should log analytics when choosing no security', () => {
        render(<AccountSecurity />)

        fireEvent.press(screen.getByText('Ne pas sécuriser mon compte'))

        expect(analytics.logDismissAccountSecurity).toHaveBeenCalledTimes(1)
      })

      it('should navigate to account suspension confirmation when choosing this option', () => {
        render(<AccountSecurity />)

        fireEvent.press(screen.getByText('Suspendre mon compte'))

        expect(navigate).toHaveBeenCalledWith('SuspensionChoice', { token: ROUTE_PARAMS.token })
      })
    })

    describe('when user is connected and has no password (sso)', () => {
      beforeEach(() => {
        mockUseAuthContext.mockReturnValueOnce({
          user: { ...globalMockUser, hasPassword: false },
          isLoggedIn: true,
        })
      })

      it('should show alternative wording', () => {
        render(<AccountSecurity />)

        expect(screen).toMatchSnapshot()
      })

      it('should not show button to change the password', () => {
        render(<AccountSecurity />)

        expect(screen.queryByText('Modifier mon mot de passe')).toBeFalsy()
      })
    })

    describe('when user is disconnected', () => {
      it('should show button to change the password', () => {
        mockUseAuthContext.mockReturnValueOnce({
          isLoggedIn: false,
        })
        render(<AccountSecurity />)

        expect(screen.getByText('Modifier mon mot de passe')).toBeTruthy()
      })
    })
  })

  describe('without route params', () => {
    it('should match snapshot when no token', () => {
      mockUseAuthContext.mockReturnValueOnce({
        isLoggedIn: false,
      })

      render(<AccountSecurity />)

      expect(screen).toMatchSnapshot()
    })
  })
})
