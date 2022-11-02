import React from 'react'
import waitForExpect from 'wait-for-expect'

import { navigate } from '__mocks__/@react-navigation/native'
import { fireEvent, render } from 'tests/utils'

import { AuthenticationModal } from './AuthenticationModal'

const hideModal = jest.fn()

describe('<AuthenticationModal />', () => {
  it('should match previous snapshot', () => {
    const modal = render(<AuthenticationModal visible hideModal={hideModal} />)
    expect(modal).toMatchSnapshot()
  })

  it('should navigate to signup page when clicking on "Créer un compte" button', () => {
    const { getByLabelText } = render(<AuthenticationModal visible hideModal={hideModal} />)
    const signupButton = getByLabelText('Créer un compte')

    fireEvent.press(signupButton)

    waitForExpect(() => {
      expect(navigate).toHaveBeenCalledWith({
        screen: 'SignupForm',
        params: { preventCancellation: true },
      })
    })
  })
})
