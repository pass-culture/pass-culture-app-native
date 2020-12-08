import { render, fireEvent, act } from '@testing-library/react-native'
import { rest } from 'msw'
import React from 'react'
import waitForExpect from 'wait-for-expect'

import { navigate } from '__mocks__/@react-navigation/native'
import { env } from 'libs/environment'
import { server } from 'tests/server'
import { flushAllPromises } from 'tests/utils'

import { AuthContext } from '../AuthContext'

import { Login } from './Login'

server.use(
  rest.post(env.API_BASE_URL + '/native/v1/signin', async (req, res, ctx) => res(ctx.status(401)))
)

const mockSignIn = jest.fn()

function renderLogin() {
  return render(
    <AuthContext.Provider
      value={{ isLoggedIn: true, signIn: mockSignIn, signUp: jest.fn(), signOut: jest.fn() }}>
      <Login />
    </AuthContext.Provider>
  )
}

describe('<Login/>', () => {
  beforeEach(() => jest.resetAllMocks())

  it('should redirect to home page WHEN signin is successful', async () => {
    const { findByText } = renderLogin()
    mockSignIn.mockImplementationOnce(() => true)

    const connexionButton = await findByText('Se connecter')
    fireEvent.press(connexionButton)

    await waitForExpect(() => {
      expect(mockSignIn).toBeCalledTimes(1)
      expect(navigate).toBeCalledTimes(1)
    })
  })

  it('should show error message and error inputs AND not redirect to home page WHEN signin has failed', async () => {
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
      expect(navigate).not.toBeCalled()
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
