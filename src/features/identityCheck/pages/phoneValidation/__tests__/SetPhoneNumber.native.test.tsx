import React from 'react'
import { mocked } from 'ts-jest/utils'

import { navigate } from '__mocks__/@react-navigation/native'
import { ApiError } from 'api/apiHelpers'
import { usePhoneValidationRemainingAttempts } from 'features/identityCheck/api/api'
import { SetPhoneNumber } from 'features/identityCheck/pages/phoneValidation/SetPhoneNumber'
import { analytics } from 'libs/firebase/analytics'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, flushAllPromisesWithAct, render, waitFor } from 'tests/utils'
import * as useModalAPI from 'ui/components/modals/useModal'

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
const mockDispatch = jest.fn()
jest.mock('features/identityCheck/context/SubscriptionContextProvider', () => ({
  useSubscriptionContext: () => ({
    dispatch: mockDispatch,
    phoneValidation: { phoneNumber: undefined, country: undefined },
  }),
}))

const mockNavigateToNextScreen = jest.fn()
jest.mock('features/identityCheck/useSubscriptionNavigation', () => ({
  useSubscriptionNavigation: () => ({
    navigateToNextScreen: mockNavigateToNextScreen,
  }),
}))

const mockedUsePhoneValidationRemainingAttempts = mocked(usePhoneValidationRemainingAttempts)

describe('SetPhoneNumber', () => {
  // FIXME(anoukhello): find a way to get snapshot with modal animation
  // when keeping visible to true, snapshot is different on every test run on modal animation props opacity and translateY
  it('should match snapshot without modal appearance', async () => {
    jest.spyOn(useModalAPI, 'useModal').mockReturnValueOnce({
      visible: false,
      showModal: jest.fn(),
      hideModal: jest.fn(),
      toggleModal: jest.fn(),
    })
    mockedUsePhoneValidationRemainingAttempts.mockReturnValueOnce({
      remainingAttempts: 4,
      counterResetDatetime: 'time',
      isLastAttempt: false,
    })
    const SetPhoneNumberPage = renderSetPhoneNumber()

    await flushAllPromisesWithAct()
    expect(SetPhoneNumberPage).toMatchSnapshot()
  })

  it('should show modal on first render', async () => {
    const { getByText } = renderSetPhoneNumber()
    await waitFor(() => expect(getByText("J'ai compris")).toBeTruthy())
  })
  it('should have a different color if 1 attempt is remaining', async () => {
    jest.spyOn(useModalAPI, 'useModal').mockReturnValueOnce({
      visible: false,
      showModal: jest.fn(),
      hideModal: jest.fn(),
      toggleModal: jest.fn(),
    })
    mockedUsePhoneValidationRemainingAttempts.mockReturnValueOnce({
      remainingAttempts: 1,
      counterResetDatetime: 'time',
      isLastAttempt: true,
    })
    const SetPhoneNumberPage = renderSetPhoneNumber()

    await flushAllPromisesWithAct()
    expect(SetPhoneNumberPage).toMatchSnapshot()
  })

  describe('continue button', () => {
    const mockFetch = jest.spyOn(global, 'fetch')
    mockFetch.mockResolvedValue(
      new Response(JSON.stringify({}), {
        headers: {
          'content-type': 'application/json',
        },
        status: 200,
      })
    )

    it('should enable the button when the phone number is valid', async () => {
      const { getByTestId } = renderSetPhoneNumber()
      const button = getByTestId('Continuer')

      await waitFor(() => expect(button).toBeDisabled())

      const input = getByTestId('Entrée pour le numéro de téléphone')
      fireEvent.changeText(input, '612345678')

      expect(button).toBeEnabled()
    })

    it.each([
      '', // empty
      '03', // too short (min 6)
      '62435463579', // too long (max 10)
      '33224354m', // includes char
    ])('should disable the button when the phone number is not valid (%s)', async (phoneNumber) => {
      const { getByTestId } = renderSetPhoneNumber()
      const button = getByTestId('Continuer')

      await waitFor(() => expect(button).toBeDisabled())

      const input = getByTestId('Entrée pour le numéro de téléphone')
      fireEvent.changeText(input, phoneNumber)

      expect(button).toBeDisabled()
    })

    it('should call navigateToNextScreen on /send_phone_validation_code request success', async () => {
      const { getByTestId } = renderSetPhoneNumber()

      const continueButton = getByTestId('Continuer')
      const input = getByTestId('Entrée pour le numéro de téléphone')
      fireEvent.changeText(input, '612345678')
      fireEvent.press(continueButton)

      await waitFor(() => {
        expect(mockNavigateToNextScreen).toHaveBeenCalledTimes(1)
      })
    })

    it('should display input error message if validate phone number request fails', async () => {
      mockFetch.mockRejectedValueOnce(
        new ApiError(400, {
          code: 'INVALID_PHONE_NUMBER',
          message: 'Le numéro est invalide.',
        })
      )
      const { getByTestId, getByText } = renderSetPhoneNumber()

      const continueButton = getByTestId('Continuer')
      const input = getByTestId('Entrée pour le numéro de téléphone')
      fireEvent.changeText(input, '600000000')

      fireEvent.press(continueButton)

      await waitFor(() => {
        expect(getByText('Le numéro est invalide.')).toBeTruthy()
      })
    })

    it('should navigate to SetPhoneNumberTooManySMSSent page if request fails with TOO_MANY_SMS_SENT code', async () => {
      mockFetch.mockRejectedValueOnce(
        new ApiError(400, {
          code: 'TOO_MANY_SMS_SENT',
          message: 'Le nombre de tentatives maximal est dépassé',
        })
      )

      const { getByTestId } = renderSetPhoneNumber()

      const continueButton = getByTestId('Continuer')
      const input = getByTestId('Entrée pour le numéro de téléphone')
      fireEvent.changeText(input, '612345678')
      fireEvent.press(continueButton)

      await waitFor(() => expect(navigate).toHaveBeenCalledWith('PhoneValidationTooManySMSSent'))
    })

    it('should log event HasRequestedCode when pressing "Continuer" button', async () => {
      const { getByTestId } = renderSetPhoneNumber()

      const continueButton = getByTestId('Continuer')
      const input = getByTestId('Entrée pour le numéro de téléphone')
      fireEvent.changeText(input, '612345678')
      fireEvent.press(continueButton)

      await waitFor(() => expect(analytics.logHasRequestedCode).toHaveBeenCalledTimes(1))
    })
  })
})

function renderSetPhoneNumber() {
  return render(<SetPhoneNumber />, {
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
}
