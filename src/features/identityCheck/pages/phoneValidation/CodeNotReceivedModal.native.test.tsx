import React from 'react'
import { mocked } from 'ts-jest/utils'

import { navigate } from '__mocks__/@react-navigation/native'
import { ApiError } from 'api/apiHelpers'
import { usePhoneValidationRemainingAttempts } from 'features/identityCheck/api/usePhoneValidationRemainingAttempts'
import {
  CodeNotReceivedModal,
  CodeNotReceivedModalProps,
} from 'features/identityCheck/pages/phoneValidation/CodeNotReceivedModal'
import { analytics } from 'libs/firebase/analytics'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, waitFor } from 'tests/utils'
import { SNACK_BAR_TIME_OUT } from 'ui/components/snackBar/SnackBarContext'
import { SnackBarHelperSettings } from 'ui/components/snackBar/types'

const mockShowErrorSnackBar = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showErrorSnackBar: jest.fn((props: SnackBarHelperSettings) => mockShowErrorSnackBar(props)),
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

const mockedUsePhoneValidationRemainingAttempts = mocked(usePhoneValidationRemainingAttempts)

describe('<CodeNotReceivedModal />', () => {
  const mockFetch = jest.spyOn(global, 'fetch')

  it('should match snapshot', () => {
    const renderAPI = renderCodeNotReceivedModal()

    expect(renderAPI).toMatchSnapshot()
  })

  it('should have a different color if one attempt remaining', () => {
    mockedUsePhoneValidationRemainingAttempts.mockReturnValueOnce({
      remainingAttempts: 1,
      counterResetDatetime: 'time',
      isLastAttempt: true,
    })
    const renderAPI = renderCodeNotReceivedModal()

    expect(renderAPI).toMatchSnapshot()
  })

  it('should call dismissModal upon pressing on Close', () => {
    const dismissModalMock = jest.fn()
    const { getByTestId } = renderCodeNotReceivedModal({ dismissModal: dismissModalMock })

    const closeButton = getByTestId('Fermer la modale')
    fireEvent.press(closeButton)

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
    const { getByTestId } = renderCodeNotReceivedModal({ dismissModal: dismissModalMock })

    const requestNewCodeButton = getByTestId('Demander un autre code')
    fireEvent.press(requestNewCodeButton)

    await waitFor(() => expect(dismissModalMock).toHaveBeenCalledTimes(1))
  })

  it('should dismiss modal if request fails', async () => {
    mockFetch.mockRejectedValueOnce(
      new ApiError(400, {
        code: 'SOME_CODE',
        message: 'some message',
      })
    )
    const dismissModalMock = jest.fn()
    const { getByTestId } = renderCodeNotReceivedModal({ dismissModal: dismissModalMock })

    const requestNewCodeButton = getByTestId('Demander un autre code')
    fireEvent.press(requestNewCodeButton)

    await waitFor(() => expect(dismissModalMock).toHaveBeenCalledTimes(1))
  })

  it('should show toaster with error message if request fails', async () => {
    mockFetch.mockRejectedValueOnce(
      new ApiError(400, {
        code: 'SOME_CODE',
        message: 'some message',
      })
    )
    const { getByTestId } = renderCodeNotReceivedModal()

    const requestNewCodeButton = getByTestId('Demander un autre code')
    fireEvent.press(requestNewCodeButton)

    await waitFor(() =>
      expect(mockShowErrorSnackBar).toHaveBeenCalledWith({
        message: 'some message',
        timeout: SNACK_BAR_TIME_OUT,
      })
    )
  })

  it('should navigate to SetPhoneNumberTooManySMSSent page if request fails with TOO_MANY_SMS_SENT code', async () => {
    mockFetch.mockRejectedValueOnce(
      new ApiError(400, {
        code: 'TOO_MANY_SMS_SENT',
        message: 'Le nombre de tentatives maximal est dépassé',
      })
    )
    const { getByTestId } = renderCodeNotReceivedModal()

    const requestNewCodeButton = getByTestId('Demander un autre code')
    fireEvent.press(requestNewCodeButton)

    await waitFor(() => expect(navigate).toHaveBeenCalledWith('PhoneValidationTooManySMSSent'))
  })

  it('should log event when pressing "Demander un autre code" button', async () => {
    const { getByTestId } = renderCodeNotReceivedModal()

    const requestNewCodeButton = getByTestId('Demander un autre code')
    fireEvent.press(requestNewCodeButton)

    await waitFor(() => expect(analytics.logHasRequestedCode).toHaveBeenCalledTimes(1))
  })
})

function renderCodeNotReceivedModal(props?: Partial<CodeNotReceivedModalProps>) {
  return render(<CodeNotReceivedModal isVisible dismissModal={jest.fn()} {...props} />, {
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
}
