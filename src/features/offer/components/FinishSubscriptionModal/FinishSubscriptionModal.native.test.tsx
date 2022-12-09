import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { analytics } from 'libs/firebase/analytics'
import { fireEvent, render } from 'tests/utils'

import { FinishSubscriptionModal } from './FinishSubscriptionModal'

jest.mock('react-query')
jest.mock('features/navigation/navigationRef')

let mockDepositAmounts: string | undefined = '300\u00a0€'
jest.mock('features/user/helpers/useGetDepositAmountsByAge/useGetDepositAmountsByAge', () => ({
  useGetDepositAmountsByAge: jest.fn(() => mockDepositAmounts),
}))

const offerId = 1234
const hideModal = jest.fn()
const visible = true

describe('<FinishSubscriptionModal />', () => {
  beforeEach(jest.clearAllMocks)

  it('should render correctly with undefined deposit amount', () => {
    mockDepositAmounts = undefined
    const renderAPI = render(
      <FinishSubscriptionModal visible={visible} hideModal={hideModal} offerId={offerId} />
    )
    expect(renderAPI).toMatchSnapshot()
  })

  it('should render correctly with eighteen years old deposit amount', () => {
    const renderAPI = render(
      <FinishSubscriptionModal visible={visible} hideModal={hideModal} offerId={offerId} />
    )
    expect(renderAPI).toMatchSnapshot()
  })

  it('should close modal and navigate to profile when pressing "Terminer mon inscription" button', () => {
    const { getByText } = render(
      <FinishSubscriptionModal visible={visible} hideModal={hideModal} offerId={offerId} />
    )

    fireEvent.press(getByText('Terminer mon inscription'))
    expect(hideModal).toBeCalledTimes(1)
    expect(navigate).toBeCalledWith('TabNavigator', { screen: 'Profile' })
  })

  it('should close modal when pressing right header icon', () => {
    const { getByTestId } = render(
      <FinishSubscriptionModal visible={visible} hideModal={hideModal} offerId={offerId} />
    )

    fireEvent.press(getByTestId('Fermer la modale'))
    expect(hideModal).toBeCalledTimes(1)
  })

  it('should log analytics when clicking on close button with label "Aller vers la section profil', async () => {
    const { getByLabelText } = render(
      <FinishSubscriptionModal visible={visible} hideModal={hideModal} offerId={offerId} />
    )

    fireEvent.press(getByLabelText('Aller vers la section profil'))

    expect(analytics.logGoToProfil).toHaveBeenNthCalledWith(1, {
      from: 'FinishSubscriptionModal',
      offerId,
    })
  })
})
