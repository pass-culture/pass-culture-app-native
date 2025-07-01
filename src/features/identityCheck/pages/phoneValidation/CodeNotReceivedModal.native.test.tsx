import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { ApiError } from 'api/ApiError'
import {
  CodeNotReceivedModal,
  CodeNotReceivedModalProps,
} from 'features/identityCheck/pages/phoneValidation/CodeNotReceivedModal'
import { usePhoneValidationRemainingAttemptsQuery } from 'features/identityCheck/queries/usePhoneValidationRemainingAttemptsQuery'
import { analytics } from 'libs/analytics/provider'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'
import { SNACK_BAR_TIME_OUT } from 'ui/components/snackBar/SnackBarContext'
import { SnackBarHelperSettings } from 'ui/components/snackBar/types'

jest.mock('libs/jwt/jwt')

const mockShowErrorSnackBar = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showErrorSnackBar: jest.fn((props: SnackBarHelperSettings) => mockShowErrorSnackBar(props)),
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

const mockedUsePhoneValidationRemainingAttempts = jest.mocked(
  usePhoneValidationRemainingAttemptsQuery
)

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()
jest.useFakeTimers()

describe('<CodeNotReceivedModal />', () => {
  const mockFetch = jest.spyOn(global, 'fetch')

  it('should match snapshot', () => {
    renderCodeNotReceivedModal()

    expect(screen).toMatchSnapshot()
  })

  it('should have a different color if one attempt remaining', () => {
    mockedUsePhoneValidationRemainingAttempts.mockReturnValueOnce({
      remainingAttempts: 1,
      counterResetDatetime: 'time',
      isLastAttempt: true,
    })
    renderCodeNotReceivedModal()

    expect(screen).toMatchSnapshot()
  })

  it('should call dismissModal upon pressing on Close', async () => {
    const dismissModalMock = jest.fn()
    renderCodeNotReceivedModal({ dismissModal: dismissModalMock })

    await user.press(screen.getByTestId('Fermer la modale'))

    expect(dismissModalMock).toHaveBeenCalledTimes(1)
  })

  it('should dismiss modal on /send_phone_validation_code request success', async () => {
    mockFetch.mockResolvedValueOnce(
      new Response(JSON.stringify({}), {
        headers: {
          'content-type': 'application/json',
        },
        status: 200,
      })
    )
    const dismissModalMock = jest.fn()
    renderCodeNotReceivedModal({ dismissModal: dismissModalMock })

    await user.press(screen.getByTestId('Demander un autre code'))

    expect(dismissModalMock).toHaveBeenCalledTimes(1)
  })

  it('should dismiss modal if request fails', async () => {
    mockFetch.mockRejectedValueOnce(
      new ApiError(400, {
        code: 'SOME_CODE',
        message: 'some message',
      })
    )
    const dismissModalMock = jest.fn()
    renderCodeNotReceivedModal({ dismissModal: dismissModalMock })

    await user.press(screen.getByTestId('Demander un autre code'))

    expect(dismissModalMock).toHaveBeenCalledTimes(1)
  })

  it('should show toaster with error message if request fails', async () => {
    mockFetch.mockRejectedValueOnce(
      new ApiError(400, {
        code: 'SOME_CODE',
        message: 'some message',
      })
    )
    renderCodeNotReceivedModal()

    await user.press(screen.getByTestId('Demander un autre code'))

    expect(mockShowErrorSnackBar).toHaveBeenCalledWith({
      message: 'some message',
      timeout: SNACK_BAR_TIME_OUT,
    })
  })

  it('should navigate to SetPhoneNumberTooManySMSSent page if request fails with TOO_MANY_SMS_SENT code', async () => {
    mockFetch.mockRejectedValueOnce(
      new ApiError(400, {
        code: 'TOO_MANY_SMS_SENT',
        message: 'Le nombre de tentatives maximal est dépassé',
      })
    )
    renderCodeNotReceivedModal()

    await user.press(screen.getByTestId('Demander un autre code'))

    expect(navigate).toHaveBeenCalledWith('PhoneValidationTooManySMSSent')
  })

  it('should log event when pressing "Demander un autre code" button', async () => {
    mockServer.postApi('/v1/send_phone_validation_code', { responseOptions: { statusCode: 200 } })

    renderCodeNotReceivedModal()

    await user.press(screen.getByTestId('Demander un autre code'))

    expect(analytics.logHasRequestedCode).toHaveBeenCalledTimes(1)
  })
})

function renderCodeNotReceivedModal(props?: Partial<CodeNotReceivedModalProps>) {
  return render(<CodeNotReceivedModal isVisible dismissModal={jest.fn()} {...props} />, {
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
}
