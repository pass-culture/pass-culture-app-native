import React from 'react'

import { SetPhoneNumberValidationCode } from 'features/auth/signup/SetPhoneNumberValidationCode'
import { render } from 'tests/utils'
import * as ModalModule from 'ui/components/modals/useModal'

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
})
