import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { ApiError } from 'api/apiHelpers'
import {
  hasCodeCorrectFormat,
  SetPhoneValidationCode,
} from 'features/identityCheck/pages/phoneValidation/SetPhoneValidationCode'
import { amplitude } from 'libs/amplitude'
import { analytics } from 'libs/firebase/analytics'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, waitFor } from 'tests/utils'

const mockDispatch = jest.fn()
jest.mock('features/identityCheck/context/SubscriptionContextProvider', () => ({
  useSubscriptionContext: () => ({
    dispatch: mockDispatch,
    phoneValidation: {
      phoneNumber: '0612345678',
      country: { callingCodes: ['33'], countryCode: 'FR' },
    },
  }),
}))

jest.mock('features/identityCheck/api/usePhoneValidationRemainingAttempts', () => {
  return {
    usePhoneValidationRemainingAttempts: jest.fn().mockReturnValue({
      remainingAttempts: 5,
      counterResetDatetime: 'time',
      isLastAttempt: false,
    }),
  }
})

const mockNavigateToNextScreen = jest.fn()
jest.mock('features/identityCheck/pages/helpers/useSubscriptionNavigation', () => ({
  useSubscriptionNavigation: () => ({
    navigateToNextScreen: mockNavigateToNextScreen,
  }),
}))

describe('SetPhoneValidationCode', () => {
  const mockFetch = jest.spyOn(global, 'fetch')

  it('should match snapshot', () => {
    const SetPhoneValidationCodePage = renderSetPhoneValidationCode()
    expect(SetPhoneValidationCodePage).toMatchSnapshot()
  })

  it.each(['111 111', '11111', 'BLABLA', '0909O9', '123456 ', ' 123456'])(
    'should reject an ill-formatted code: %s',
    (code) => {
      const isValid = hasCodeCorrectFormat(code)
      expect(isValid).toEqual(false)
    }
  )
  it.each(['000000', '123456'])('should accept a well-formatted code: %s', (code) => {
    const isValid = hasCodeCorrectFormat(code)
    expect(isValid).toEqual(true)
  })
  it("should have 'Continue' button enabled according to code format", () => {
    const { getByTestId, getByPlaceholderText } = renderSetPhoneValidationCode()
    const continueButton = getByTestId('Continuer')
    expect(continueButton).toBeDisabled()

    const input = getByPlaceholderText('012345')
    fireEvent.changeText(input, '000000 ')
    expect(continueButton).toBeDisabled()

    fireEvent.changeText(input, '000000')
    expect(continueButton).not.toBeDisabled()
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
  it('should call navigateToNextScreen if validation succeeds', async () => {
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

  it('should log event when pressing "Code non reçu ?" button', async () => {
    const { getByText } = renderSetPhoneValidationCode()
    const button = getByText('Code non reçu ?')

    fireEvent.press(button)

    expect(analytics.logHasClickedMissingCode).toHaveBeenCalledTimes(1)
  })

  it('should send a amplitude event when the screen is mounted', async () => {
    renderSetPhoneValidationCode()

    await waitFor(() =>
      expect(amplitude.logEvent).toHaveBeenNthCalledWith(1, 'screen_view_set_phone_validation_code')
    )
  })

  it('should log an amplitude event phone_validation_code_clicked on press continue', async () => {
    const { getByTestId, getByPlaceholderText } = renderSetPhoneValidationCode()

    const continueButton = getByTestId('Continuer')
    const input = getByPlaceholderText('012345')
    fireEvent.changeText(input, '000000')

    fireEvent.press(continueButton)

    await waitFor(() => {
      // first call will be the event screen_view_set_phone_validation_code on mount
      expect(amplitude.logEvent).toHaveBeenNthCalledWith(2, 'phone_validation_code_clicked')
    })
  })
})

function renderSetPhoneValidationCode() {
  return render(<SetPhoneValidationCode />, {
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
}
