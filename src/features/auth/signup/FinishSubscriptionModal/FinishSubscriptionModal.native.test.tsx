import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { FinishSubscriptionModal } from 'features/auth/signup/FinishSubscriptionModal/FinishSubscriptionModal'
import { fireEvent, render } from 'tests/utils'

jest.mock('features/navigation/navigationRef')

const hideModal = jest.fn()
const visible = true

describe('<FinishSubscriptionModal />', () => {
  it('should render correctly', () => {
    const renderAPI = render(<FinishSubscriptionModal visible={visible} hideModal={hideModal} />)
    expect(renderAPI).toMatchSnapshot()
  })

  it('should close modal and navigate to profile when pressing "Terminer mon inscription" button', () => {
    const { getByText } = render(
      <FinishSubscriptionModal visible={visible} hideModal={hideModal} />
    )

    fireEvent.press(getByText('Terminer mon inscription'))
    expect(hideModal).toBeCalledTimes(1)
    expect(navigate).toBeCalledWith('TabNavigator', { screen: 'Profile' })
  })

  it('should close modal when pressing right header icon', () => {
    const { getByTestId } = render(
      <FinishSubscriptionModal visible={visible} hideModal={hideModal} />
    )

    fireEvent.press(getByTestId('Fermer la modale'))
    expect(hideModal).toBeCalledTimes(1)
  })
})
