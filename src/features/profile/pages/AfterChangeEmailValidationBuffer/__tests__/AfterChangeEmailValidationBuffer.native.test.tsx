import React from 'react'
import { mocked } from 'ts-jest/utils'
import waitForExpect from 'wait-for-expect'

import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import {
  useValidateEmailChangeMutation,
  UseValidateEmailChangeMutationProps,
} from 'features/profile/mutations'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render } from 'tests/utils'

import { AfterChangeEmailValidationBuffer } from '../AfterChangeEmailValidationBuffer'

jest.mock('react-query')
jest.mock('features/profile/mutations')
const mockedUseValidateEmailChangeMutation = mocked(useValidateEmailChangeMutation)

const mockSignOut = jest.fn()
jest.mock('features/auth/AuthContext', () => ({
  useLogoutRoutine: () => mockSignOut,
  useAuthContext: jest.fn().mockReturnValue({
    isLoggedIn: true,
  }),
}))

describe('<AfterChangeEmailValidationBuffer/>', () => {
  beforeAll(() => {
    useRoute.mockImplementation(() => ({
      params: {
        token: 'reerereskjlmkdlsf',
        expirationTimestamp: 45465546445,
        email: 'john@wick.com',
      },
    }))
  })

  it('should render correctly', () => {
    const renderAPI = renderPage()
    expect(renderAPI.toJSON()).toMatchSnapshot()
  })

  it('should navigate to the login page if the token validation succeeds', async () => {
    renderPage()

    await waitForExpect(() => {
      expect(mockSignOut).toBeCalled()
      expect(navigate).toBeCalledWith('Login')
    })
  })

  it('should navigate to error page if the token validation fails', async () => {
    mockedUseValidateEmailChangeMutation.mockImplementationOnce(
      // @ts-ignore we don't use the other properties of UseMutationResult (such as failureCount)
      ({ onError }: UseValidateEmailChangeMutationProps) => ({
        mutate: () => onError(),
      })
    )

    renderPage()

    await waitForExpect(() => {
      expect(navigate).toBeCalledWith('ChangeEmailExpiredLink', { email: 'john@wick.com' })
    })
  })
})

// eslint-disable-next-line local-rules/no-react-query-provider-hoc
const renderPage = () => render(reactQueryProviderHOC(<AfterChangeEmailValidationBuffer />))
// const renderPage = () => render(<AfterChangeEmailValidationBuffer />)
