import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
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
  flushAllPromises,
  render,
  superFlushWithAct,
  useMutationFactory,
} from 'tests/utils/web'
import * as ModalModule from 'ui/components/modals/useModal'

// eslint-disable-next-line local-rules/no-allow-console
allowConsole({ error: true })

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

describe('SetPhoneValidationCode', () => {
  beforeEach(() => {
    // @ts-expect-error ts(2345)
    mockedUseMutation.mockImplementationOnce(useMutationFactory(useMutationCallbacks))
  })

  describe('modal header', () => {
    it('should open the quit modal on press right icon', () => {
      const visible = false
      const showModal = jest.fn()
      const uselessFunction = jest.fn()

      const useModalMock = jest.spyOn(ModalModule, 'useModal').mockReturnValue({
        visible,
        showModal,
        hideModal: uselessFunction,
        toggleModal: uselessFunction,
      })

      const { getByTestId } = renderSetPhoneValidationCode()

      const rightIconButton = getByTestId("Revenir sur l'écran d'envoi de SMS")

      fireEvent.click(rightIconButton)
      expect(showModal).toBeCalled()

      useModalMock.mockRestore()
    })

    it('should call onGoBack property on press left arrow', async () => {
      mockGoBack.mockImplementationOnce(() => true)
      const { getByTestId } = renderSetPhoneValidationCode()

      const leftArrow = getByTestId('Revenir en arrière')
      fireEvent.click(leftArrow)
      await waitForExpect(() => {
        expect(mockGoBack).toHaveBeenCalled()
      })
    })
  })

  describe('Contact support button', () => {
    it('should open mail app when clicking on contact support button', async () => {
      const { getByText } = renderSetPhoneValidationCode()

      const contactSupportButton = getByText('Contacter le support')
      fireEvent.click(contactSupportButton)

      await waitForExpect(() => {
        expect(contactSupport.forPhoneNumberConfirmation).toHaveBeenCalled()
      })
    })
  })

  describe('Continue button', () => {
    it('should enable continue button if input is valid and complete', async () => {
      const renderAPI = renderModalWithFilledCodeInput('123456')
      const continueButton = renderAPI.getByTestId('Continuer')
      await waitForExpect(() => {
        expect(continueButton).toHaveProperty('disabled', false)
      })
    })

    it.each([
      ['empty', '', true],
      ['includes string', 's09453', false], // numeric input on the web will leave blank the input value
      ['is too short', '54', true],
    ])(
      'should not enable continue button when "%s"',
      async (_reason: string, codeTyped: string, isNumericInput: boolean) => {
        const renderAPI = renderModalWithFilledCodeInput(codeTyped)
        const continueButton = renderAPI.getByTestId('Continuer')
        await waitForExpect(() => {
          expect(continueButton).toHaveProperty('disabled', isNumericInput)
        })
      }
    )

    it('should navigate to nextBeneficiaryValidationStep if validate phone number request succeeds', async () => {
      const setError = jest.fn()
      const {
        navigateToNextBeneficiaryValidationStep: mockedNavigateToNextBeneficiaryValidationStep,
      } = useBeneficiaryValidationNavigation(setError)
      const { getByTestId } = renderModalWithFilledCodeInput('123456')
      const continueButton = getByTestId('Continuer')
      fireEvent.click(continueButton)
      useMutationCallbacks.onSuccess()
      await flushAllPromises()
      expect(mockedNavigateToNextBeneficiaryValidationStep).toBeCalled()
    })

    it('should display input error message if validate phone number request fails', async () => {
      const response = {
        content: { code: 'INVALID_VALIDATION_CODE', message: 'Le code est invalide' },
        name: 'ApiError',
      }

      const { getByTestId, getByText } = renderModalWithFilledCodeInput('123456')
      const continueButton = getByTestId('Continuer')

      fireEvent.click(continueButton)

      await act(async () => {
        useMutationCallbacks.onError(response)
      })

      const errorMessage = getByText('Le code est invalide')
      await waitForExpect(() => {
        expect(errorMessage).toBeTruthy()
      })
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

      fireEvent.click(continueButton)

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
      fireEvent.click(retryButton)

      expect(sendPhoneValidationCode).toHaveBeenCalled()
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
  const navigationProps = {
    route: {
      params: {
        phoneNumber: '0612345678',
        countryCode: 'FR',
      },
    },
  } as StackScreenProps<RootStackParamList, 'SetPhoneValidationCode'>
  return render(
    <SafeAreaProvider>
      <SetPhoneValidationCode {...navigationProps} />
    </SafeAreaProvider>
  )
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
  fireEvent.change(input, { target: { value: code } })
  renderAPI.rerender(
    <SafeAreaProvider>
      <SetPhoneValidationCode {...navigationProps} />
    </SafeAreaProvider>
  )
  return renderAPI
}
