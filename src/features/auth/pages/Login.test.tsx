import { StackScreenProps } from '@react-navigation/stack'
import { render, fireEvent, act } from '@testing-library/react-native'
import { rest } from 'msw'
import React from 'react'
import waitForExpect from 'wait-for-expect'

import { AllNavParamList, navigateToHomeWithoutModal } from 'features/navigation/RootNavigator'
import { env } from 'libs/environment'
import { navigationTestProps } from 'tests/navigation'
import { server } from 'tests/server'
import { flushAllPromises } from 'tests/utils'

import { AuthContext } from '../AuthContext'

import { Login } from './Login'

jest.mock('features/navigation/RootNavigator')

beforeEach(() => {
  jest.resetAllMocks()
})

const mockSignIn = jest.fn()

function renderLogin() {
  return render(
    <AuthContext.Provider value={{ isLoggedIn: true, signIn: mockSignIn, signOut: jest.fn() }}>
      <Login
        {...((navigationTestProps as unknown) as StackScreenProps<AllNavParamList, 'Login'>)}
      />
    </AuthContext.Provider>
  )
}

describe('<Login/>', () => {
  it('should redirect to home page WHEN signin is successful', async () => {
    const { findByText } = renderLogin()
    mockSignIn.mockImplementationOnce(() => true)

    const connexionButton = await findByText('Se connecter')
    fireEvent.press(connexionButton)

    await waitForExpect(() => {
      expect(mockSignIn).toBeCalledTimes(1)
      expect(navigateToHomeWithoutModal).toBeCalledTimes(1)
    })
  })

  it('should show error message and error inputs AND not redirect to home page WHEN signin has failed', async () => {
    server.use(
      rest.post(env.API_BASE_URL + '/native/v1/signin', async (req, res, ctx) =>
        res(ctx.status(401))
      )
    )
    const { findByText, toJSON } = renderLogin()
    const notErrorSnapshot = toJSON()

    const connexionButton = await findByText('Se connecter')
    await act(async () => {
      fireEvent.press(connexionButton)
      await flushAllPromises()
    })

    await waitForExpect(() => {
      const errorSnapshot = toJSON()
      expect(notErrorSnapshot).toMatchDiffSnapshot(errorSnapshot)
      expect(navigateToHomeWithoutModal).not.toBeCalled()
    })
  })

  it('should enable login button when both text inputs are filled', async () => {
    const { getByPlaceholderText, toJSON } = renderLogin()
    const disabledButtonSnapshot = toJSON()

    const emailInput = getByPlaceholderText('tonadresse@email.com')
    const passwordInput = getByPlaceholderText('Ton mot de passe')
    fireEvent.changeText(emailInput, 'email@gmail.com')
    fireEvent.changeText(passwordInput, 'mypassword')

    await waitForExpect(() => {
      const enabledButtonSnapshot = toJSON()
      expect(disabledButtonSnapshot).toMatchDiffSnapshot(enabledButtonSnapshot)
    })
  })
})
