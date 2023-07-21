import { rest } from 'msw'
import React from 'react'

import { navigate, dispatch, CommonActions } from '__mocks__/@react-navigation/native'
import { ApiError } from 'api/apiHelpers'
import { ValidatePhoneNumberRequest } from 'api/gen'
import {
  hasCodeCorrectFormat,
  SetPhoneValidationCode,
} from 'features/identityCheck/pages/phoneValidation/SetPhoneValidationCode'
import { analytics } from 'libs/analytics'
import { env } from 'libs/environment'
import { EmptyResponse } from 'libs/fetch'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { act, fireEvent, render, screen, waitFor } from 'tests/utils'

server.use(
  rest.post<ValidatePhoneNumberRequest, EmptyResponse>(
    env.API_BASE_URL + '/native/v1/validate_phone_number',
    (_req, res, ctx) => {
      return res(ctx.status(200), ctx.json({}))
    }
  )
)

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

describe('SetPhoneValidationCode', () => {
  const mockFetch = jest.spyOn(global, 'fetch')

  it('should match snapshot', () => {
    renderSetPhoneValidationCode()
    expect(screen).toMatchSnapshot()
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
    renderSetPhoneValidationCode()
    const continueButton = screen.getByTestId('Continuer')
    expect(continueButton).toBeDisabled()

    const input = screen.getByPlaceholderText('012345')
    fireEvent.changeText(input, '000000 ')
    expect(continueButton).toBeDisabled()

    fireEvent.changeText(input, '000000')
    expect(continueButton).not.toBeDisabled()
  })

  it("should have modal closed on render, and open modal when clicking on 'code non reçu'", async () => {
    renderSetPhoneValidationCode()

    expect(screen.queryByText('Demander un autre code')).toBeNull()

    fireEvent.press(screen.getByText('Code non reçu\u00a0?'))

    expect(screen.queryByText('Demander un autre code')).toBeTruthy()
  })
  it('should display input error message if code request fails', async () => {
    mockFetch.mockRejectedValueOnce(
      new ApiError(400, {
        message:
          'Le code est invalide. Saisis le dernier code reçu par SMS. Il te reste 4 tentatives.',
        code: 'INVALID_VALIDATION_CODE',
      })
    )
    renderSetPhoneValidationCode()

    const continueButton = screen.getByTestId('Continuer')
    const input = screen.getByPlaceholderText('012345')
    fireEvent.changeText(input, '000000')

    fireEvent.press(continueButton)

    await waitFor(() => {
      expect(
        screen.getByText(
          'Le code est invalide. Saisis le dernier code reçu par SMS. Il te reste 4 tentatives.'
        )
      ).toBeTruthy()
    })
  })
  it('should navigate to TooManyAttempts if too many attempts', async () => {
    mockFetch.mockRejectedValueOnce(
      new ApiError(400, {
        message: 'Le nombre de tentatives maximal est dépassé',
        code: 'TOO_MANY_VALIDATION_ATTEMPTS',
      })
    )
    renderSetPhoneValidationCode()

    const continueButton = screen.getByTestId('Continuer')
    const input = screen.getByPlaceholderText('012345')
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
    renderSetPhoneValidationCode()

    const continueButton = screen.getByTestId('Continuer')
    const input = screen.getByPlaceholderText('012345')
    fireEvent.changeText(input, '000000')

    fireEvent.press(continueButton)

    await waitFor(() => {
      expect(dispatch).toHaveBeenCalledTimes(1)
      expect(CommonActions.reset).toHaveBeenCalledWith({
        index: 1,
        routes: [{ name: 'TabNavigator' }, { name: 'Stepper' }],
      })
    })
  })

  it('should log event when pressing "Code non reçu ?" button', async () => {
    renderSetPhoneValidationCode()
    const button = screen.getByText('Code non reçu ?')

    fireEvent.press(button)

    expect(analytics.logHasClickedMissingCode).toHaveBeenCalledTimes(1)
  })

  it('should log screen view when the screen is mounted', async () => {
    renderSetPhoneValidationCode()

    await waitFor(() =>
      expect(analytics.logScreenViewSetPhoneValidationCode).toHaveBeenCalledTimes(1)
    )
  })

  it('should log analytics on press continue', async () => {
    renderSetPhoneValidationCode()

    const continueButton = screen.getByTestId('Continuer')
    const input = screen.getByPlaceholderText('012345')

    await act(async () => {
      fireEvent.changeText(input, '000000')
    })

    await act(async () => {
      fireEvent.press(continueButton)
    })

    await waitFor(() => {
      expect(analytics.logPhoneValidationCodeClicked).toHaveBeenCalledTimes(1)
    })
  })
})

function renderSetPhoneValidationCode() {
  return render(<SetPhoneValidationCode />, {
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
}
