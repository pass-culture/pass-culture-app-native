import React from 'react'

import { dispatch, navigate } from '__mocks__/@react-navigation/native'
import { ApiError } from 'api/ApiError'
import {
  SetPhoneValidationCode,
  hasCodeCorrectFormat,
} from 'features/identityCheck/pages/phoneValidation/SetPhoneValidationCode'
import { analytics } from 'libs/analytics/provider'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, screen, userEvent, waitFor } from 'tests/utils'

jest.mock('libs/jwt/jwt')

const mockDispatch = jest.fn()
jest.mock('features/identityCheck/context/SubscriptionContextProvider', () => ({
  useSubscriptionContext: () => ({
    dispatch: mockDispatch,
    phoneValidation: {
      phoneNumber: '0612345678',
      country: { callingCode: '33', countryCode: 'FR' },
    },
  }),
}))

jest.mock('features/identityCheck/queries/usePhoneValidationRemainingAttemptsQuery', () => {
  return {
    usePhoneValidationRemainingAttemptsQuery: jest.fn().mockReturnValue({
      remainingAttempts: 5,
      counterResetDatetime: 'time',
      isLastAttempt: false,
    }),
  }
})

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()

jest.useFakeTimers()

describe('SetPhoneValidationCode', () => {
  const mockFetch = jest.spyOn(global, 'fetch')

  beforeEach(() => {
    mockServer.postApi('/v1/validate_phone_number', {})
  })

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

    expect(screen.queryByText('Demander un autre code')).not.toBeOnTheScreen()

    await user.press(screen.getByText('Code non reçu\u00a0?'))

    expect(screen.getByText('Demander un autre code')).toBeOnTheScreen()
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

    const input = screen.getByPlaceholderText('012345')
    fireEvent.changeText(input, '000000')

    await user.press(screen.getByTestId('Continuer'))

    expect(
      screen.getByText(
        'Le code est invalide. Saisis le dernier code reçu par SMS. Il te reste 4 tentatives.',
        { hidden: true }
      )
    ).toBeOnTheScreen()
  })

  it('should navigate to TooManyAttempts if too many attempts', async () => {
    mockFetch.mockRejectedValueOnce(
      new ApiError(400, {
        message: 'Le nombre de tentatives maximal est dépassé',
        code: 'TOO_MANY_VALIDATION_ATTEMPTS',
      })
    )
    renderSetPhoneValidationCode()

    const input = screen.getByPlaceholderText('012345')
    fireEvent.changeText(input, '000000')

    await user.press(screen.getByTestId('Continuer'))

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('SubscriptionStackNavigator', {
        params: undefined,
        screen: 'PhoneValidationTooManyAttempts',
      })
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

    const input = screen.getByPlaceholderText('012345')
    fireEvent.changeText(input, '000000')

    await user.press(screen.getByTestId('Continuer'))

    expect(dispatch).toHaveBeenCalledWith({
      payload: {
        index: 1,
        routes: [
          { name: 'TabNavigator' },
          {
            name: 'SubscriptionStackNavigator',
            state: {
              routes: [
                {
                  name: 'Stepper',
                },
              ],
            },
          },
        ],
      },
      type: 'RESET',
    })
  })

  it('should log event when pressing "Code non reçu ?" button', async () => {
    renderSetPhoneValidationCode()

    await user.press(screen.getByText('Code non reçu ?'))

    expect(analytics.logHasClickedMissingCode).toHaveBeenCalledTimes(1)
  })
})

function renderSetPhoneValidationCode() {
  return render(<SetPhoneValidationCode />, {
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
}
