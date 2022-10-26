import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { useRoute } from '__mocks__/@react-navigation/native'
import { render } from 'tests/utils/web'
import { SnackBarProvider } from 'ui/components/snackBar/SnackBarContext'

import { AuthContext } from '../AuthContext'

import { Login } from './Login'

jest.mock('react-query')

const mockIdentityCheckDispatch = jest.fn()
jest.mock('features/identityCheck/context/SubscriptionContextProvider', () => ({
  useSubscriptionContext: jest.fn(() => ({ dispatch: mockIdentityCheckDispatch })),
}))

describe('<Login/>', () => {
  it('should display forced login help message when the query param is given', () => {
    useRoute.mockReturnValueOnce({ params: { displayForcedLoginHelpMessage: true } })
    const { queryByRole } = renderLogin()

    const snackBar = queryByRole('status')

    expect(snackBar).toHaveTextContent(
      'Pour sécuriser ton pass Culture, tu dois confirmer tes identifiants tous les 30 jours.'
    )
  })

  it('should not display the login help message when the query param is not given', () => {
    useRoute.mockReturnValueOnce({})
    const { queryByRole } = renderLogin()

    const snackBar = queryByRole('status')

    expect(snackBar).not.toHaveTextContent(
      'Pour sécuriser ton pass Culture, tu dois confirmer tes identifiants tous les 30 jours.'
    )
  })
})

function renderLogin() {
  return render(
    <SafeAreaProvider>
      <SnackBarProvider>
        <AuthContext.Provider value={{ isLoggedIn: true, setIsLoggedIn: jest.fn() }}>
          <Login />
        </AuthContext.Provider>
      </SnackBarProvider>
    </SafeAreaProvider>
  )
}
