import { StackScreenProps } from '@react-navigation/stack'
import { CountryCode } from 'libphonenumber-js'
import React from 'react'
import { useMutation, UseMutationResult } from 'react-query'
import { mocked } from 'ts-jest/utils'
import waitForExpect from 'wait-for-expect'

import { navigate } from '__mocks__/@react-navigation/native'
import * as AuthApi from 'features/auth/api'
import {
  formatPhoneNumber,
  SetPhoneValidationCode,
} from 'features/auth/signup/PhoneValidation/SetPhoneValidationCode'
import { useBeneficiaryValidationNavigation } from 'features/auth/signup/useBeneficiaryValidationNavigation'
import { contactSupport } from 'features/auth/support.services'
import { mockGoBack } from 'features/navigation/__mocks__/useGoBack'
import { RootStackParamList } from 'features/navigation/RootNavigator'
import { EmptyResponse } from 'libs/fetch'
import {
  act,
  fireEvent,
  render,
  superFlushWithAct,
  useMutationFactory,
  flushAllPromises,
} from 'tests/utils'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

// eslint-disable-next-line local-rules/no-allow-console
// allowConsole({ error: true })

jest.mock('react-query')
jest.mock('features/auth/settings')
jest.mock('features/auth/signup/useBeneficiaryValidationNavigation')
jest.mock('features/home/api', () => ({
  useUserProfileInfo: jest.fn(() => ({
    refetch: jest.fn(() =>
      Promise.resolve({
        data: {
          email: 'christophe.dupont@example.com',
          firstName: 'Christophe',
          lastName: 'Dupont',
        },
      })
    ),
  })),
}))

jest.mock('@pass-culture/react-native-profiling', () => ({
  profileDevice: jest.fn(),
}))

const mockedUseMutation = mocked(useMutation)
const useMutationCallbacks: { onError: (error: unknown) => void; onSuccess: () => void } = {
  onSuccess: () => {},
  onError: () => {},
}

const navigationProps = {
  route: {
    params: {
      phoneNumber: '0612345678',
      countryCode: 'FR',
    },
  },
} as StackScreenProps<RootStackParamList, 'SetPhoneValidationCode'>

const formattedPhoneNumber = formatPhoneNumber(
  navigationProps.route.params.phoneNumber,
  navigationProps.route.params.countryCode as CountryCode
).replace(/ /g, '\u00a0')

describe('SetPhoneValidationCode', () => {
  beforeEach(() => {
    // @ts-expect-error ts(2345)
    mockedUseMutation.mockImplementationOnce(useMutationFactory(useMutationCallbacks))
  })

  describe('modal header', () => {
    it('should open the quit modal on press right icon', () => {
      const { getByTestId } = renderSetPhoneValidationCode()

      act(() => {
        getByTestId("Revenir sur l'écran d'envoi de SMS").props.onClick()
      })

      getByTestId('modal-phone-validation-quit-signup')
    })

    it('should call onGoBack property on press left arrow', async () => {
      const { getByTestId } = renderSetPhoneValidationCode()

      const leftArrow = getByTestId('Revenir en arrière')
      fireEvent.press(leftArrow)
      await waitForExpect(() => {
        expect(mockGoBack).toBeCalled()
      })
    })
  })

  describe('Contact support button', () => {
    it('should open mail app when clicking on contact support button', async () => {
      const { findByText } = renderSetPhoneValidationCode()

      const contactSupportButton = await findByText('Contacter le support')
      fireEvent.press(contactSupportButton)

      await waitForExpect(() => {
        expect(contactSupport.forPhoneNumberConfirmation).toHaveBeenCalled()
      })
    })
  })

  describe('Continue button', () => {
    it('should enable continue button if input is valid and complete', async () => {
      const { getByTestId } = renderModalWithFilledCodeInput('123456')
      const continueButton = getByTestId('Continuer')
      await act(flushAllPromises)
      expect(continueButton.props.style.backgroundColor).toEqual(ColorsEnum.PRIMARY)
    })

    it.each([
      ['empty', ''],
      ['is too short', '54'],
    ])('should not enable continue button when "%s"', async (_reason, codeTyped) => {
      const { getByTestId } = renderModalWithFilledCodeInput(codeTyped)
      const continueButton = getByTestId('Continuer')
      await act(flushAllPromises)
      expect(continueButton.props.style.backgroundColor).toEqual(ColorsEnum.GREY_LIGHT)
    })

    it('should display input error message if validate phone number request fails', async () => {
      const response = {
        content: { code: 'INVALID_VALIDATION_CODE', message: 'Le code est invalide' },
        name: 'ApiError',
      }

      const { getByTestId, getByText } = renderModalWithFilledCodeInput('123456')
      const continueButton = getByTestId('Continuer')

      fireEvent.press(continueButton)

      await act(async () => {
        useMutationCallbacks.onError(response)
      })

      const errorMessage = getByText('Le code est invalide')
      await waitForExpect(() => {
        expect(errorMessage).toBeTruthy()
      })
    })

    it('should navigate to nextBeneficiaryValidationStep if validate phone number request succeeds', async () => {
      const setError = jest.fn()
      const {
        navigateToNextBeneficiaryValidationStep: mockedNavigateToNextBeneficiaryValidationStep,
      } = useBeneficiaryValidationNavigation(setError)
      const { getByTestId } = renderModalWithFilledCodeInput('123456')

      const continueButton = getByTestId('Continuer')
      fireEvent.press(continueButton)
      useMutationCallbacks.onSuccess()
      await flushAllPromises()
      expect(mockedNavigateToNextBeneficiaryValidationStep).toBeCalled()
    })

    it('should navigate to PhoneValidationTooManyAttempts page if request fails with TOO_MANY_VALIDATION_ATTEMPTS code', async () => {
      const response = {
        content: {
          code: 'TOO_MANY_VALIDATION_ATTEMPTS',
          message: 'Le nombre de tentatives maximal est dépassé',
        },
        name: 'ApiError',
      }

      const { getByTestId } = renderModalWithFilledCodeInput('123456')
      const continueButton = getByTestId('Continuer')

      fireEvent.press(continueButton)

      await act(async () => {
        useMutationCallbacks.onError(response)
      })

      await waitForExpect(() => {
        expect(navigate).toHaveBeenCalledWith('PhoneValidationTooManyAttempts')
      })
    })
  })

  describe('retry button', () => {
    it('should request new validation code on press', async () => {
      const sendPhoneValidationCode = jest.fn()
      // eslint-disable-next-line local-rules/independant-mocks
      jest.spyOn(AuthApi, 'useSendPhoneValidationMutation').mockReturnValue({
        mutate: sendPhoneValidationCode,
      } as unknown as UseMutationResult<EmptyResponse, unknown, string, unknown>)

      const { getByTestId } = renderSetPhoneValidationCode()
      await superFlushWithAct()

      const retryButton = getByTestId('Réessayer')
      fireEvent.press(retryButton)

      expect(sendPhoneValidationCode).toHaveBeenCalledWith(formattedPhoneNumber)
    })
  })

  describe('formatPhoneNumber helper', () => {
    it.each([
      ['+33612345678', '+33\u00a06\u00a012\u00a034\u00a056\u00a078'],
      ['+687723160', '+687\u00a072\u00a031\u00a060'],
    ])('should format number correctly"', (phoneNumber, expectedPhoneNumber) => {
      expect(formatPhoneNumber(phoneNumber, 'FR')).toEqual(expectedPhoneNumber)
    })
  })
})

function renderSetPhoneValidationCode() {
  return render(<SetPhoneValidationCode {...navigationProps} />)
}

function renderModalWithFilledCodeInput(code: string) {
  const renderAPI = renderSetPhoneValidationCode()
  const navigationProps = {
    route: {
      params: {
        phoneNumber: '0612345678',
        countryCode: 'FR',
      },
    },
  } as StackScreenProps<RootStackParamList, 'SetPhoneValidationCode'>
  const input = renderAPI.getByTestId('Entrée du code de confirmation')
  fireEvent.changeText(input, code)
  renderAPI.rerender(<SetPhoneValidationCode {...navigationProps} />)
  return renderAPI
}
