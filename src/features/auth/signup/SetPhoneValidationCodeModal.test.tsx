import React from 'react'
import { useMutation, UseMutationResult } from 'react-query'
import { mocked } from 'ts-jest/utils'
import waitForExpect from 'wait-for-expect'

import { navigate } from '__mocks__/@react-navigation/native'
import * as AuthApi from 'features/auth/api'
import {
  SetPhoneValidationCodeModal,
  SetPhoneValidationCodeModalProps,
} from 'features/auth/signup/SetPhoneValidationCodeModal'
import { contactSupport } from 'features/auth/support.services'
import { EmptyResponse } from 'libs/fetch'
import {
  act,
  fireEvent,
  flushAllPromises,
  render,
  superFlushWithAct,
  useMutationFactory,
} from 'tests/utils'
import * as ModalModule from 'ui/components/modals/useModal'
import { ColorsEnum } from 'ui/theme'

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

const mockedUseMutation = mocked(useMutation)
const useMutationCallbacks: { onError: (error: unknown) => void; onSuccess: () => void } = {
  onSuccess: () => {},
  onError: () => {},
}

describe('SetPhoneNumberValidationCodeModal', () => {
  beforeEach(() => {
    // @ts-ignore ts(2345)
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

      rightIconButton.props.onClick()
      expect(showModal).toBeCalled()

      useModalMock.mockRestore()
    })

    it('should call onGoBack property on press left arrow', () => {
      const mockOnGoBack = jest.fn()
      const { getByTestId } = renderSetPhoneValidationCode({ onGoBack: mockOnGoBack })

      const leftArrow = getByTestId('leftIconButton')
      fireEvent.press(leftArrow)
      expect(mockOnGoBack).toHaveBeenCalled()
    })
  })

  describe('Contact support button', () => {
    it('should open mail app when clicking on contact support button', async () => {
      const { getByText } = renderSetPhoneValidationCode()

      const contactSupportButton = getByText('Contacter le support')
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

      await waitForExpect(() => {
        expect(continueButton.props.style.backgroundColor).toEqual(ColorsEnum.PRIMARY)
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
        expect(continueButton.props.style.backgroundColor).toEqual(ColorsEnum.GREY_LIGHT)
      })
    })

    it('should navigate to id-check if validate phone number request succeeds', async () => {
      const mockDismissModal = jest.fn()
      const { getByTestId } = renderModalWithFilledCodeInput('123456', {
        dismissModal: mockDismissModal,
      })
      const continueButton = getByTestId('Continuer')

      fireEvent.press(continueButton)
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

      fireEvent.press(continueButton)

      await act(async () => {
        useMutationCallbacks.onError(response)
      })

      const errorMessage = getByText('Le code est invalide')
      await waitForExpect(() => {
        expect(errorMessage).toBeTruthy()
      })
    })

    it('should navigate to PhoneValidationTooManyAttempts page if request fails with TOO_MANY_VALIDATION_ATTEMPTS code', async () => {
      const mockDismissModal = jest.fn()
      const response = {
        content: {
          code: 'TOO_MANY_VALIDATION_ATTEMPTS',
          message: 'Le nombre de tentatives maximal est dépassé',
        },
        name: 'ApiError',
      }

      const { getByTestId } = renderModalWithFilledCodeInput('123456', {
        dismissModal: mockDismissModal,
      })
      const continueButton = getByTestId('Continuer')

      fireEvent.press(continueButton)

      await act(async () => {
        useMutationCallbacks.onError(response)
      })

      await waitForExpect(() => {
        expect(navigate).toHaveBeenCalledWith('PhoneValidationTooManyAttempts')
        expect(mockDismissModal).toHaveBeenCalled()
      })
    })
  })

  describe('retry button', () => {
    it('should request new validation code on press', async () => {
      const sendPhoneValidationCode = jest.fn()
      // eslint-disable-next-line local-rules/independant-mocks
      jest.spyOn(AuthApi, 'useSendPhoneValidationMutation').mockReturnValue(({
        mutate: sendPhoneValidationCode,
      } as unknown) as UseMutationResult<EmptyResponse, unknown, string, unknown>)

      const { getByTestId } = renderSetPhoneValidationCode()
      await superFlushWithAct()

      const retryButton = getByTestId('Réessayer')
      fireEvent.press(retryButton)

      expect(sendPhoneValidationCode).toHaveBeenCalled()
    })
  })
})

function renderSetPhoneValidationCode(customProps?: Partial<SetPhoneValidationCodeModalProps>) {
  const props = {
    dismissModal: jest.fn(),
    visible: true,
    phoneNumber: '0612345678',
    onGoBack: jest.fn(),
    ...customProps,
  }
  return render(<SetPhoneValidationCodeModal {...props} />)
}

function renderModalWithFilledCodeInput(
  code: string,
  customProps?: Partial<SetPhoneValidationCodeModalProps>
) {
  const renderAPI = renderSetPhoneValidationCode(customProps)
  for (let i = 0; i < code.length; i++) {
    fireEvent.changeText(renderAPI.getByTestId(`input-${i}`), code[i])
    renderAPI.rerender(
      <SetPhoneValidationCodeModal
        dismissModal={jest.fn()}
        visible={true}
        phoneNumber={'0612345678'}
        onGoBack={jest.fn()}
      />
    )
  }
  return renderAPI
}
