import React from 'react'

import { dispatch, navigate } from '__mocks__/@react-navigation/native'
import { ApiError } from 'api/apiHelpers'
import { usePhoneValidationRemainingAttempts } from 'features/identityCheck/api/usePhoneValidationRemainingAttempts'
import { SetPhoneNumber } from 'features/identityCheck/pages/phoneValidation/SetPhoneNumber'
import { analytics } from 'libs/analytics'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, waitFor, screen } from 'tests/utils'
import { theme } from 'theme'
import * as useModalAPI from 'ui/components/modals/useModal'

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
    phoneValidation: { phoneNumber: undefined, country: undefined },
  }),
}))

const mockedUsePhoneValidationRemainingAttempts = jest.mocked(usePhoneValidationRemainingAttempts)

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

    await waitFor(() => {
      expect(SetPhoneNumberPage).toMatchSnapshot()
    })
  })

  it('should show modal on first render', async () => {
    renderSetPhoneNumber()
    await waitFor(() => expect(screen.getByText('J’ai compris')).toBeTruthy())
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

    renderSetPhoneNumber()
    const remainingAttemptsText = screen.getByText('1 demande')
    await waitFor(() => {
      expect(remainingAttemptsText.props.style[0].color).toEqual(theme.colors.error)
    })
  })

  it('should log screen view when the screen is mounted', async () => {
    renderSetPhoneNumber()

    await waitFor(() => expect(analytics.logScreenViewSetPhoneNumber).toHaveBeenCalledTimes(1))
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
      renderSetPhoneNumber()
      const button = screen.getByTestId('Continuer')

      await waitFor(() => expect(button).toBeDisabled())

      const input = screen.getByTestId('Entrée pour le numéro de téléphone')
      fireEvent.changeText(input, '612345678')

      expect(button).toBeEnabled()
    })

    it.each([
      '', // empty
      '03', // too short (min 6)
      '62435463579', // too long (max 10)
      '33224354m', // includes char
    ])('should disable the button when the phone number is not valid (%s)', async (phoneNumber) => {
      renderSetPhoneNumber()
      const button = screen.getByTestId('Continuer')

      await waitFor(() => expect(button).toBeDisabled())

      const input = screen.getByTestId('Entrée pour le numéro de téléphone')
      fireEvent.changeText(input, phoneNumber)

      expect(button).toBeDisabled()
    })

    it('should call navigateForwardToStepper on /send_phone_validation_code request success', async () => {
      renderSetPhoneNumber()

      const continueButton = screen.getByTestId('Continuer')
      const input = screen.getByTestId('Entrée pour le numéro de téléphone')
      fireEvent.changeText(input, '612345678')
      fireEvent.press(continueButton)

      expect(screen.getByTestId('Continuer')).toBeTruthy()
      expect(screen.getByTestId('Entrée pour le numéro de téléphone')).toBeTruthy()

      await waitFor(() => {
        expect(dispatch).toHaveBeenCalledTimes(1)
      })
    })

    it('should display input error message if validate phone number request fails', async () => {
      mockFetch.mockRejectedValueOnce(
        new ApiError(400, {
          code: 'INVALID_PHONE_NUMBER',
          message: 'Le numéro est invalide.',
        })
      )
      renderSetPhoneNumber()

      const continueButton = screen.getByTestId('Continuer')
      const input = screen.getByTestId('Entrée pour le numéro de téléphone')
      fireEvent.changeText(input, '600000000')

      fireEvent.press(continueButton)

      await waitFor(() => {
        expect(screen.getByText('Le numéro est invalide.')).toBeTruthy()
      })
    })

    it('should navigate to SetPhoneNumberTooManySMSSent page if request fails with TOO_MANY_SMS_SENT code', async () => {
      mockFetch.mockRejectedValueOnce(
        new ApiError(400, {
          code: 'TOO_MANY_SMS_SENT',
          message: 'Le nombre de tentatives maximal est dépassé',
        })
      )

      renderSetPhoneNumber()

      const continueButton = screen.getByTestId('Continuer')
      const input = screen.getByTestId('Entrée pour le numéro de téléphone')
      fireEvent.changeText(input, '612345678')
      fireEvent.press(continueButton)

      await waitFor(() => expect(navigate).toHaveBeenCalledWith('PhoneValidationTooManySMSSent'))
    })

    it('should log event HasRequestedCode when pressing "Continuer" button', async () => {
      renderSetPhoneNumber()

      const continueButton = screen.getByTestId('Continuer')
      const input = screen.getByTestId('Entrée pour le numéro de téléphone')
      fireEvent.changeText(input, '612345678')
      fireEvent.press(continueButton)

      await waitFor(() => expect(analytics.logHasRequestedCode).toHaveBeenCalledTimes(1))
    })

    it('should log analytics when pressing "Continuer" button', async () => {
      renderSetPhoneNumber()

      const input = screen.getByTestId('Entrée pour le numéro de téléphone')
      fireEvent.changeText(input, '612345678')
      fireEvent.press(screen.getByText('Continuer'))

      await waitFor(() => expect(analytics.logPhoneNumberClicked).toHaveBeenCalledTimes(1))
    })
  })
})

function renderSetPhoneNumber() {
  return render(<SetPhoneNumber />, {
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
}
