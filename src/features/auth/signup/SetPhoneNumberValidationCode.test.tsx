import React from 'react'
import waitForExpect from 'wait-for-expect'

import { SetPhoneNumberValidationCode } from 'features/auth/signup/SetPhoneNumberValidationCode'
import { contactSupport } from 'features/auth/support.services'
import { fireEvent, render } from 'tests/utils'
import * as ModalModule from 'ui/components/modals/useModal'
import { ColorsEnum } from 'ui/theme'

describe('SetPhoneNumberValidationCode', () => {
  describe('Quit process', () => {
    it('should open the quit modal', () => {
      const visible = false
      const showModal = jest.fn()
      const uselessFunction = jest.fn()

      const useModalMock = jest.spyOn(ModalModule, 'useModal').mockReturnValue({
        visible,
        showModal,
        hideModal: uselessFunction,
        toggleModal: uselessFunction,
      })

      const { getByTestId } = render(
        <SetPhoneNumberValidationCode dismissModal={jest.fn()} visible={visible} />
      )

      const rightIconButton = getByTestId('rightIconButton')

      rightIconButton.props.onClick()
      expect(showModal).toBeCalled()

      useModalMock.mockRestore()
    })
  })

  describe('Contact support button', () => {
    it('should open mail app when clicking on contact support button', async () => {
      const { findByText } = render(
        <SetPhoneNumberValidationCode dismissModal={jest.fn()} visible={true} />
      )

      const contactSupportButton = await findByText('Contacter le support')
      fireEvent.press(contactSupportButton)

      await waitForExpect(() => {
        expect(contactSupport.forPhoneNumberConfirmation).toHaveBeenCalled()
      })
    })
  })

  describe('Continue button', () => {
    it('should enable continue button if input is valid and complete', async () => {
      const { getByTestId, rerender } = render(
        <SetPhoneNumberValidationCode dismissModal={jest.fn()} visible={true} />
      )

      const continueButton = getByTestId('button-container-continue')
      expect(continueButton.props.style.backgroundColor).toEqual(ColorsEnum.GREY_LIGHT)

      const codeInputContainer = getByTestId('code-input-container')
      for (let i = 0; i < codeInputContainer.props.children.length; i++) {
        fireEvent.changeText(getByTestId(`input-${i}`), '1')
        rerender(<SetPhoneNumberValidationCode dismissModal={jest.fn()} visible={true} />)
      }

      await waitForExpect(() => {
        expect(continueButton.props.style.backgroundColor).toEqual(ColorsEnum.PRIMARY)
      })
    })

    it.each([
      ['empty', ''],
      ['includes string', 's09453'],
      ['is too short', '54'],
    ])('should not enable continue button when "%s"', async (_reason, codeTyped) => {
      const { getByTestId, rerender } = render(
        <SetPhoneNumberValidationCode dismissModal={jest.fn()} visible={true} />
      )

      const continueButton = getByTestId('button-container-continue')

      for (let i = 0; i < codeTyped.length; i++) {
        fireEvent.changeText(getByTestId(`input-${i}`), codeTyped[i])
        rerender(<SetPhoneNumberValidationCode dismissModal={jest.fn()} visible={true} />)
      }

      await waitForExpect(() => {
        expect(continueButton.props.style.backgroundColor).toEqual(ColorsEnum.GREY_LIGHT)
      })
    })
  })
})
