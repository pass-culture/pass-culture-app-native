import React from 'react'

import { SetPhoneNumberModal } from 'features/auth/signup/SetPhoneNumberModal'
import { fireEvent, render } from 'tests/utils'
import { ColorsEnum } from 'ui/theme'

describe('SetPhoneNumberModal', () => {
  describe('button "Continuer"', () => {
    it('should enable the button when the phone number is valid', () => {
      const { getByTestId, getByPlaceholderText } = render(
        <SetPhoneNumberModal visible dismissModal={jest.fn()} />
      )

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
    ])('should disable the button when the phone number is not valid (%s)', (phoneNumber) => {
      const { getByTestId, getByPlaceholderText } = render(
        <SetPhoneNumberModal visible dismissModal={jest.fn()} />
      )

      const button = getByTestId('button-container-continue')

      expect(button.props.style.backgroundColor).toEqual(ColorsEnum.GREY_LIGHT)

      const input = getByPlaceholderText('0612345678')
      fireEvent.changeText(input, phoneNumber)

      expect(button.props.style.backgroundColor).toEqual(ColorsEnum.GREY_LIGHT)
    })
  })
})
