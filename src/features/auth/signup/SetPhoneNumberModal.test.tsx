import React from 'react'
import waitForExpect from 'wait-for-expect'

import { SetPhoneNumberModal } from 'features/auth/signup/SetPhoneNumberModal'
import { currentTimestamp } from 'libs/dates'
import { storage } from 'libs/storage'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, flushAllPromises, render, superFlushWithAct } from 'tests/utils'
import { ColorsEnum } from 'ui/theme'

describe('SetPhoneNumberModal', () => {
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

    it('should call onValidationCodeAsked property on press button "Continuer" on first request', async () => {
      const mockOnValidationCodeAsked = jest.fn()
      const { getByTestId, getByPlaceholderText } = renderSetPhoneNumberModal({
        onValidationCodeAsked: mockOnValidationCodeAsked,
      })
      const button = getByTestId('button-container-continue')
      const input = getByPlaceholderText('0612345678')
      fireEvent.changeText(input, '0687654321')
      fireEvent.press(button)

      await superFlushWithAct()
      await waitForExpect(() => {
        expect(mockOnValidationCodeAsked).toHaveBeenCalled()
      })
    })

    it('should call onValidationCodeAsked property on press button "Continuer" if last request timestamp > 1 min', async () => {
      // we assume last call was made 65 seconds ago
      await storage.saveObject('phone_validation_code_asked_at', currentTimestamp() - 65)

      const mockOnValidationCodeAsked = jest.fn()
      const { getByTestId, getByPlaceholderText } = renderSetPhoneNumberModal({
        onValidationCodeAsked: mockOnValidationCodeAsked,
      })
      const button = getByTestId('button-container-continue')
      const input = getByPlaceholderText('0612345678')
      fireEvent.changeText(input, '0687654321')
      fireEvent.press(button)

      await superFlushWithAct()
      await waitForExpect(() => {
        expect(mockOnValidationCodeAsked).toHaveBeenCalled()
      })
    })

    it('should NOT call onValidationCodeAsked property on press button "Continuer" if last request timestamp < 1 min', async () => {
      // we assume last call was made 5 seconds ago
      await storage.saveObject('phone_validation_code_asked_at', currentTimestamp() - 5)

      const mockOnValidationCodeAsked = jest.fn()
      const { getByTestId, getByPlaceholderText } = renderSetPhoneNumberModal({
        onValidationCodeAsked: mockOnValidationCodeAsked,
      })
      await superFlushWithAct()

      const button = getByTestId('button-container-continue')
      const input = getByPlaceholderText('0612345678')
      fireEvent.changeText(input, '0687654321')
      fireEvent.press(button)

      await superFlushWithAct()
      await waitForExpect(() => {
        expect(mockOnValidationCodeAsked).not.toHaveBeenCalled()
      })
    })
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderSetPhoneNumberModal(customProps?: any) {
  const props = {
    visible: true,
    dismissModal: jest.fn(),
    onChangePhoneNumber: jest.fn(),
    onValidationCodeAsked: jest.fn(),
    phoneNumber: '',
    ...customProps,
  }
  return render(reactQueryProviderHOC(<SetPhoneNumberModal {...props} />))
}
