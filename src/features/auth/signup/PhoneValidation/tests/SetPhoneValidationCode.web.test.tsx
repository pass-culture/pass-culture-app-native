import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { useMutation, UseMutationResult } from 'react-query'
import { mocked } from 'ts-jest/utils'
import waitForExpect from 'wait-for-expect'

import { navigate, canGoBack, goBack } from '__mocks__/@react-navigation/native'
import * as AuthApi from 'features/auth/api'
import {
  formatPhoneNumber,
  SetPhoneValidationCode,
} from 'features/auth/signup/PhoneValidation/SetPhoneValidationCode'
import { contactSupport } from 'features/auth/support.services'
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
jest.mock('features/home/api', () => ({
  useUserProfileInfo: jest.fn(() => ({
    refetch: jest.fn(() =>
      Promise.resolve({
        data: {
          email: 'christophe.dupont@example.com',
          firstName: 'Christophe',
          lastName: 'Dupont',
          nextBeneficiaryValidationStep: 'id-check',
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

      const rightIconButton = getByTestId('rightIconButton')

      fireEvent.click(rightIconButton)
      expect(showModal).toBeCalled()

      useModalMock.mockRestore()
    })

    it('should call onGoBack property on press left arrow', async () => {
      canGoBack.mockImplementationOnce(() => true)
      const { getByTestId } = renderSetPhoneValidationCode()

      const leftArrow = getByTestId('leftIconButton')
      fireEvent.click(leftArrow)
      await waitForExpect(() => {
        expect(canGoBack).toHaveBeenCalled()
        expect(goBack).toHaveBeenCalled()
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
      const { getByTestId } = renderModalWithFilledCodeInput('123456')
      const continueButton = getByTestId('Continuer')

      await waitForExpect(() => {
        expect(continueButton.style.backgroundColor).toEqual('rgb(245, 245, 245)')
      })
    })

    it.each([
      ['empty', ''],
      ['includes string', 's09453'],
      ['is too short', '54'],
    ])('should not enable continue button when "%s"', async (_reason, codeTyped) => {
      const { getByTestId } = renderModalWithFilledCodeInput(codeTyped)
      const continueButton = getByTestId('Continuer')

      await waitForExpect(() => {
        expect(continueButton.style.backgroundColor).toEqual('rgb(245, 245, 245)')
      })
    })

    it('should navigate to id-check if validate phone number request succeeds', async () => {
      const { getByTestId } = renderModalWithFilledCodeInput('123456')
      const continueButton = getByTestId('Continuer')

      fireEvent.click(continueButton)
      useMutationCallbacks.onSuccess()

      await flushAllPromises()
      expect(navigate).toBeCalledWith('IdCheck', {
        email: 'christophe.dupont@example.com',
      })
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
  fireEvent.change(renderAPI.getByTestId('code-input'), code)
  renderAPI.rerender(
    <SafeAreaProvider>
      <SetPhoneValidationCode {...navigationProps} />
    </SafeAreaProvider>
  )
  return renderAPI
}
