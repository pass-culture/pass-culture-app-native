import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { ApiError } from 'api/apiHelpers'
import { SetPhoneValidationCode } from 'features/identityCheck/pages/phoneValidation/SetPhoneValidationCode'
import { IdentityCheckRootStackParamList } from 'features/navigation/RootNavigator'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, waitFor } from 'tests/utils'

const navigationProps = {
  route: {
    params: {
      phoneNumber: '0612345678',
      countryCode: 'FR',
    },
  },
} as StackScreenProps<IdentityCheckRootStackParamList, 'SetPhoneValidationCode'>

jest.mock('features/auth/settings')

jest.mock('features/identityCheck/api/api', () => {
  const ActualIdentityCheckAPI = jest.requireActual('features/identityCheck/api/api')
  return {
    ...ActualIdentityCheckAPI,
    usePhoneValidationRemainingAttempts: jest.fn().mockReturnValue({
      remainingAttempts: 5,
      counterResetDatetime: 'time',
      isLastAttempt: false,
    }),
  }
})

describe('SetPhoneValidationCode', () => {
  const mockFetch = jest.spyOn(global, 'fetch')

  it('should match snapshot', () => {
    const SetPhoneValidationCodePage = renderSetPhoneValidationCode()
    expect(SetPhoneValidationCodePage).toMatchSnapshot()
  })

  it("should have modal closed on render, and open modal when clicking on 'code non reçu'", async () => {
    const CodePage = renderSetPhoneValidationCode()

    expect(CodePage.queryByText('Demander un autre code')).toBeNull()

    fireEvent.press(CodePage.getByText('Code non reçu\u00a0?'))

    expect(CodePage.queryByText('Demander un autre code')).toBeTruthy()
  })
  it('should display input error message if code request fails', async () => {
    mockFetch.mockRejectedValueOnce(
      new ApiError(400, {
        message:
          'Le code est invalide. Saisis le dernier code reçu par SMS. Il te reste 4 tentatives.',
        code: 'INVALID_VALIDATION_CODE',
      })
    )
    const { getByTestId, getByPlaceholderText, getByText } = renderSetPhoneValidationCode()

    const continueButton = getByTestId('Continuer')
    const input = getByPlaceholderText('012345')
    fireEvent.changeText(input, '000000')

    fireEvent.press(continueButton)

    await waitFor(() => {
      expect(
        getByText(
          'Le code est invalide. Saisis le dernier code reçu par SMS. Il te reste 4 tentatives.'
        )
      ).toBeTruthy()
    })
  })
  it('should dnavigate to TooManyAttempts if too many attempts', async () => {
    mockFetch.mockRejectedValueOnce(
      new ApiError(400, {
        message: 'Le nombre de tentatives maximal est dépassé',
        code: 'TOO_MANY_VALIDATION_ATTEMPTS',
      })
    )
    const { getByTestId, getByPlaceholderText } = renderSetPhoneValidationCode()

    const continueButton = getByTestId('Continuer')
    const input = getByPlaceholderText('012345')
    fireEvent.changeText(input, '000000')

    fireEvent.press(continueButton)

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('PhoneValidationTooManyAttempts')
    })
  })
  it('should navigate to IdentityCheckStepper if validation succeeds', async () => {
    mockFetch.mockResolvedValueOnce(
      new Response(JSON.stringify({}), {
        headers: {
          'content-type': 'application/json',
        },
        status: 200,
      })
    )
    const { getByTestId, getByPlaceholderText } = renderSetPhoneValidationCode()

    const continueButton = getByTestId('Continuer')
    const input = getByPlaceholderText('012345')
    fireEvent.changeText(input, '000000')

    fireEvent.press(continueButton)

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('IdentityCheckStepper')
    })
  })
})

function renderSetPhoneValidationCode() {
  return render(<SetPhoneValidationCode {...navigationProps} />, {
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
}
