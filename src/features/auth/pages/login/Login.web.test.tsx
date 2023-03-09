import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { useRoute } from '__mocks__/@react-navigation/native'
import { AuthContext } from 'features/auth/context/AuthContext'
import { act, checkAccessibilityFor, render, screen } from 'tests/utils/web'
import { SnackBarProvider } from 'ui/components/snackBar/SnackBarContext'

import { Login } from './Login'

jest.mock('react-query')

jest.mock('uuid', () => {
  let value = 0
  return {
    v1: jest.fn(),
    v4: jest.fn(() => value++),
  }
})

const mockIdentityCheckDispatch = jest.fn()
jest.mock('features/identityCheck/context/SubscriptionContextProvider', () => ({
  useSubscriptionContext: jest.fn(() => ({ dispatch: mockIdentityCheckDispatch })),
}))

describe('<Login/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      useRoute.mockReturnValueOnce({ params: { displayForcedLoginHelpMessage: true } })
      const { container } = renderLogin()

      await act(async () => {
        const results = await checkAccessibilityFor(container)
        expect(results).toHaveNoViolations()
      })
    })
  })

  it('should display forced login help message when the query param is given', async () => {
    useRoute.mockReturnValueOnce({ params: { displayForcedLoginHelpMessage: true } })
    renderLogin()

    const snackBar = await screen.findByRole('status')

    expect(snackBar).toHaveTextContent(
      'Pour sécuriser ton pass Culture, tu dois confirmer tes identifiants tous les 30 jours.'
    )
  })

  it('should not display the login help message when the query param is not given', async () => {
    useRoute.mockReturnValueOnce({})
    renderLogin()

    const snackBar = await screen.findByRole('status')

    expect(snackBar).not.toHaveTextContent(
      'Pour sécuriser ton pass Culture, tu dois confirmer tes identifiants tous les 30 jours.'
    )
  })
})

function renderLogin() {
  return render(
    <SafeAreaProvider>
      <SnackBarProvider>
        <AuthContext.Provider
          value={{
            isLoggedIn: true,
            setIsLoggedIn: jest.fn(),
            isUserLoading: false,
            refetchUser: jest.fn(),
          }}>
          <Login />
        </AuthContext.Provider>
      </SnackBarProvider>
    </SafeAreaProvider>
  )
}
