import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { ErrorApplicationModal } from 'features/offer/components/ErrorApplicationModal/ErrorApplicationModal'
import { render, fireEvent } from 'tests/utils'

const hideModal = jest.fn()

describe('<AuthenticationModal />', () => {
  it('should match previous snapshot', () => {
    const modal = render(<ErrorApplicationModal visible hideModal={hideModal} />)
    expect(modal).toMatchSnapshot()
  })

  it('should close modal and navigate to profile when pressing "Aller sur mon profil" button', () => {
    const { getByLabelText } = render(<ErrorApplicationModal visible hideModal={hideModal} />)

    fireEvent.press(getByLabelText('Aller vers la section profil'))
    expect(hideModal).toBeCalledTimes(1)
    expect(navigate).toBeCalledWith('TabNavigator', { screen: 'Profile' })
  })
})
