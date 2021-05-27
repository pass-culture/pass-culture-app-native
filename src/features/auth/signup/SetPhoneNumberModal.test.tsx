import * as React from 'react'
import { useMutation, UseMutationResult } from 'react-query'
import { mocked } from 'ts-jest/utils'

import * as AuthApi from 'features/auth/api'
import {
  SetPhoneNumberModal,
  SetPhoneNumberModalProps,
} from 'features/auth/signup/SetPhoneNumberModal'
import { currentTimestamp } from 'libs/dates'
import { EmptyResponse } from 'libs/fetch'
import { storage } from 'libs/storage'
import {
  act,
  fireEvent,
  flushAllPromises,
  render,
  superFlushWithAct,
  useMutationFactory,
} from 'tests/utils'
import { ColorsEnum } from 'ui/theme'

jest.mock('react-query')

const mockedUseMutation = mocked(useMutation)
const useMutationCallbacks: { onError: (error: unknown) => void; onSuccess: () => void } = {
  onSuccess: () => {},
  onError: () => {},
}

let mockTimeSinceLastRequest = -1 // not initialized
jest.mock('libs/timer', () => ({
  useTimer: jest.fn(() => mockTimeSinceLastRequest),
}))

describe('SetPhoneNumberModal', () => {
  beforeEach(() => {
    // @ts-ignore ts(2345)
    mockedUseMutation.mockImplementationOnce(useMutationFactory(useMutationCallbacks))
  })

  afterEach(async () => {
    await storage.clear('phone_validation_code_asked_at')
  })

  describe('button "Continuer"', () => {
    it('should enable the button when the phone number is valid', async () => {
      const { getByTestId, getByPlaceholderText } = renderSetPhoneNumberModal()
      await flushAllPromises()

      const button = getByTestId('button-container-continue')

      expect(button.props.style.backgroundColor).toEqual(ColorsEnum.GREY_LIGHT)

      const input = getByPlaceholderText('0612345678')
      fireEvent.changeText(input, '0612345678')

      expect(button.props.style.backgroundColor).toEqual(ColorsEnum.PRIMARY)
    })

    it.each([
      '', // empty
      '03', // too short
      '02243546357', // too long
      '022435463m', // includes char
      '1224354635', // dont start with 0
    ])('should disable the button when the phone number is not valid (%s)', async (phoneNumber) => {
      const { getByTestId, getByPlaceholderText } = renderSetPhoneNumberModal()
      await flushAllPromises()

      const button = getByTestId('button-container-continue')

      expect(button.props.style.backgroundColor).toEqual(ColorsEnum.GREY_LIGHT)

      const input = getByPlaceholderText('0612345678')
      fireEvent.changeText(input, phoneNumber)

      expect(button.props.style.backgroundColor).toEqual(ColorsEnum.GREY_LIGHT)
    })

    it('should call onValidationCodeAsked property on /send_phone_validation request success', async () => {
      const mockOnValidationCodeAsked = jest.fn()
      const { getByTestId, getByPlaceholderText } = renderSetPhoneNumberModal({
        onValidationCodeAsked: mockOnValidationCodeAsked,
      })
      await flushAllPromises()

      const button = getByTestId('button-container-continue')
      const input = getByPlaceholderText('0612345678')
      fireEvent.changeText(input, '0687654321')
      fireEvent.press(button)

      await act(async () => {
        useMutationCallbacks.onSuccess()
      })
      expect(mockOnValidationCodeAsked).toHaveBeenCalled()
    })

    it.each([
      ['', 'null', -1, null, 1], // first call (-1 means timer is not initialized)
      ['', '> 1 min', 65, currentTimestamp() - 65, 1], // last call was made 65 seconds ago
      ['NOT', '< 1 min', 5, currentTimestamp() - 5, 0], // last call was made 5 seconds ago
    ])(
      'should %s call sendPhoneValidationCode mutation if SetPhoneNumberModal if last request timestamp is %s',
      async (_should, _label, timeSinceLastRequest, storageValue, numberOfCall) => {
        await storage.saveObject('phone_validation_code_asked_at', storageValue)

        mockTimeSinceLastRequest = timeSinceLastRequest

        const sendPhoneValidationCode = jest.fn()
        jest.spyOn(AuthApi, 'useSendPhoneValidationMutation').mockReturnValue(({
          mutate: sendPhoneValidationCode,
        } as unknown) as UseMutationResult<EmptyResponse, unknown, string, unknown>)

        const { getByTestId, getByPlaceholderText } = renderSetPhoneNumberModal()
        await superFlushWithAct()

        const button = getByTestId('button-container-continue')
        const input = getByPlaceholderText('0612345678')
        fireEvent.changeText(input, '0687654321')
        fireEvent.press(button)

        await flushAllPromises()

        expect(sendPhoneValidationCode).toHaveBeenCalledTimes(numberOfCall)
      }
    )
  })

  describe('phone number input', () => {
    it('should call onChangePhoneNumber property on change input text', async () => {
      const mockOnChangePhoneNumber = jest.fn()
      const { getByPlaceholderText } = renderSetPhoneNumberModal({
        onChangePhoneNumber: mockOnChangePhoneNumber,
      })
      await flushAllPromises()

      const input = getByPlaceholderText('0612345678')
      fireEvent.changeText(input, '0687654321')

      expect(mockOnChangePhoneNumber).toHaveBeenCalled()
    })
  })
})

function renderSetPhoneNumberModal(customProps?: Partial<SetPhoneNumberModalProps>) {
  const props = {
    visible: true,
    dismissModal: jest.fn(),
    onChangePhoneNumber: jest.fn(),
    onValidationCodeAsked: jest.fn(),
    phoneNumber: '',
    ...customProps,
  }
  return render(<SetPhoneNumberModal {...props} />)
}
