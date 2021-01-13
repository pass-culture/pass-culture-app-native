import { act, fireEvent, render } from '@testing-library/react-native'
import { rest } from 'msw'
import React from 'react'
import waitForExpect from 'wait-for-expect'

import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import { NavigateToHomeWithoutModalOptions, usePreviousRoute } from 'features/navigation/helpers'
import { env } from 'libs/environment'
import { server } from 'tests/server'

import { useSignIn } from '../api'
import { AuthContext } from '../AuthContext'

import { Login } from './Login'

server.use(
  rest.post(env.API_BASE_URL + '/native/v1/signin', async (req, res, ctx) => res(ctx.status(401)))
)

jest.mock('features/navigation/helpers')
jest.mock('features/auth/api')

const mockUsePreviousRoute = usePreviousRoute as jest.Mock
const mockUseSignIn = useSignIn as jest.Mock

function renderLogin() {
  return render(
    <AuthContext.Provider value={{ isLoggedIn: true, setIsLoggedIn: jest.fn() }}>
      <Login />
    </AuthContext.Provider>
  )
}

describe('<Login/>', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUsePreviousRoute.mockReturnValue(null)
    useRoute.mockImplementation(() => ({
      params: {},
    }))
  })

  it('should redirect to home page WHEN signin is successful', async () => {
    mockUseSignIn.mockImplementationOnce(() => () => {
      return { isSuccess: true, content: undefined }
    })

    const { findByText } = renderLogin()

    const connexionButton = await findByText('Se connecter')
    await act(async () => {
      fireEvent.press(connexionButton)
    })

    await waitForExpect(() => {
      expect(navigate).toHaveBeenNthCalledWith(1, 'Home', NavigateToHomeWithoutModalOptions)
    })
  })

  it(
    'should redirect to SignupConfirmationEmailSent page' +
      ' WHEN signin has failed with EMAIL_NOT_VALIDATED code',
    async () => {
      mockUseSignIn.mockImplementationOnce(() => () => {
        return {
          isSuccess: false,
          content: {
            code: 'EMAIL_NOT_VALIDATED',
            general: ["L'email n'a pas été validé."],
          },
        }
      })

      const { findByText } = renderLogin()

      const connexionButton = await findByText('Se connecter')
      await act(async () => {
        fireEvent.press(connexionButton)
      })

      await waitForExpect(() => {
        expect(navigate).toHaveBeenNthCalledWith(1, 'SignupConfirmationEmailSent', {
          email: undefined,
        })
      })
    }
  )

  it('should show error message and error inputs AND not redirect to home page WHEN signin has failed', async () => {
    mockUseSignIn.mockImplementationOnce(() => () => {
      return { isSuccess: false, content: undefined }
    })

    const { findByText, toJSON } = renderLogin()
    const notErrorSnapshot = toJSON()

    const connexionButton = await findByText('Se connecter')
    await act(async () => {
      fireEvent.press(connexionButton)
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
