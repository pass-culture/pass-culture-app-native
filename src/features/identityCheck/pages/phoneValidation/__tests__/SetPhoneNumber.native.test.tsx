import React from 'react'

import { SetPhoneNumber } from 'features/identityCheck/pages/phoneValidation/SetPhoneNumber'
import { fireEvent, render, waitFor } from 'tests/utils'
import * as useModalAPI from 'ui/components/modals/useModal'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

describe('SetPhoneNumber', () => {
  // FIXME(anoukhello) find a way to get snapshot with modal animation
  // when keeping visible to true, snapshot is different on every test run on modal animation props opacity and translateY
  it('should match snapshot without modal appearance', async () => {
    jest.spyOn(useModalAPI, 'useModal').mockReturnValueOnce({
      visible: false,
      showModal: jest.fn(),
      hideModal: jest.fn(),
      toggleModal: jest.fn(),
    })
    const SetPhoneNumberPage = render(<SetPhoneNumber />)
    await waitFor(() => expect(SetPhoneNumberPage).toMatchSnapshot())
  })

  it('should show modal on first render', async () => {
    const { getByText } = render(<SetPhoneNumber />)
    await waitFor(() => expect(getByText("J'ai compris")).toBeTruthy())
  })

  describe('continue button', () => {
    it('should enable the button when the phone number is valid', async () => {
      const { getByTestId, getByPlaceholderText } = render(<SetPhoneNumber />)
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
      const { getByTestId, getByPlaceholderText } = render(<SetPhoneNumber />)
      const button = getByTestId('Continuer')

      await waitFor(() => expect(button.props.style.backgroundColor).toEqual(ColorsEnum.GREY_LIGHT))

      const input = getByPlaceholderText('06 12 34 56 78')
      fireEvent.changeText(input, phoneNumber)

      expect(button.props.style.backgroundColor).toEqual(ColorsEnum.GREY_LIGHT)
    })
  })

  // TODO PC-14869 : implement the check that modal is visible when going to SetPhoneValiditationCode then using GoBack
})
