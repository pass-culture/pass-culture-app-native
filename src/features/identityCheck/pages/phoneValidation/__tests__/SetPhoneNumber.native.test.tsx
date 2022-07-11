import React from 'react'
import { mocked } from 'ts-jest/utils'

import { navigate } from '__mocks__/@react-navigation/native'
import { ApiError } from 'api/apiHelpers'
import { usePhoneValidationRemainingAttempts } from 'features/identityCheck/api/api'
import { SetPhoneNumber } from 'features/identityCheck/pages/phoneValidation/SetPhoneNumber'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, waitFor } from 'tests/utils'
import * as useModalAPI from 'ui/components/modals/useModal'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

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
    await waitFor(() => expect(SetPhoneNumberPage).toMatchSnapshot())
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
    await waitFor(() => expect(SetPhoneNumberPage).toMatchSnapshot())
  })

  describe('continue button', () => {
    const mockFetch = jest.spyOn(global, 'fetch')

    it('should enable the button when the phone number is valid', async () => {
      const { getByTestId, getByPlaceholderText } = renderSetPhoneNumber()
      const button = getByTestId('Continuer')

      await waitFor(() => expect(button.props.style.backgroundColor).toEqual(ColorsEnum.GREY_LIGHT))

      const input = getByPlaceholderText('06 12 34 56 78')
      fireEvent.changeText(input, '612345678')

      expect(button.props.style.backgroundColor).toEqual(ColorsEnum.PRIMARY)
    })

    it.each([
      '', // empty
      '03', // too short (min 6)
      '62435463579', // too long (max 10)
      '33224354m', // includes char
    ])('should disable the button when the phone number is not valid (%s)', async (phoneNumber) => {
      const { getByTestId, getByPlaceholderText } = renderSetPhoneNumber()
      const button = getByTestId('Continuer')

      await waitFor(() => expect(button.props.style.backgroundColor).toEqual(ColorsEnum.GREY_LIGHT))

      const input = getByPlaceholderText('06 12 34 56 78')
      fireEvent.changeText(input, phoneNumber)

      expect(button.props.style.backgroundColor).toEqual(ColorsEnum.GREY_LIGHT)
    })

    it('should navigate to SetPhoneValidationCode on /send_phone_validation_code request success', async () => {
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({}), {
          headers: {
            'content-type': 'application/json',
          },
          status: 200,
        })
      )

      const { getByTestId, getByPlaceholderText } = renderSetPhoneNumber()

      const continueButton = getByTestId('Continuer')
      const input = getByPlaceholderText('06 12 34 56 78')
      fireEvent.changeText(input, '612345678')
      fireEvent.press(continueButton)

      await waitFor(() => {
        expect(navigate).toHaveBeenCalledWith('SetPhoneValidationCode', {
          countryCode: 'FR',
          phoneNumber: '612345678',
        })
      })
    })

    it('should display input error message if validate phone number request fails', async () => {
      mockFetch.mockRejectedValueOnce(
        new ApiError(400, {
          code: 'INVALID_PHONE_NUMBER',
          message: 'Le numéro est invalide.',
        })
      )
      const { getByTestId, getByPlaceholderText, getByText } = renderSetPhoneNumber()

      const continueButton = getByTestId('Continuer')
      const input = getByPlaceholderText('06 12 34 56 78')
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

      const { getByTestId, getByPlaceholderText } = renderSetPhoneNumber()

      const continueButton = getByTestId('Continuer')
      const input = getByPlaceholderText('06 12 34 56 78')
      fireEvent.changeText(input, '612345678')
      fireEvent.press(continueButton)

      await waitFor(() =>
        expect(navigate).toHaveBeenCalledWith('PhoneValidationTooManySMSSent', {
          countryCode: 'FR',
          phoneNumber: '612345678',
        })
      )
    })
  })

  // TODO(PC-14869): implement the check that modal is visible when going to SetPhoneValiditationCode then using GoBack
})

function renderSetPhoneNumber() {
  return render(<SetPhoneNumber />, {
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
}
