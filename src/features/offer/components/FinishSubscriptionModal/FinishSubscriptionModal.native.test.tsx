import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { beneficiaryUser } from 'fixtures/user'
import { analytics } from 'libs/analytics'
import { useGetDepositAmountsByAge } from 'shared/user/useGetDepositAmountsByAge'
import { fireEvent, render, screen } from 'tests/utils'

import { FinishSubscriptionModal } from './FinishSubscriptionModal'

jest.mock('features/auth/context/AuthContext')
const mockUseAuthContext = useAuthContext as jest.Mock
mockUseAuthContext.mockReturnValue({ user: beneficiaryUser })

jest.mock('shared/user/useGetDepositAmountsByAge')
const mockDepositAmounts = useGetDepositAmountsByAge as jest.Mock
mockDepositAmounts.mockReturnValue('300\u00a0€')

const offerId = 1234
const hideModal = jest.fn()
const visible = true

describe('<FinishSubscriptionModal />', () => {
  it('should render correctly with undefined deposit amount', () => {
    mockDepositAmounts.mockReturnValueOnce(undefined)

    render(<FinishSubscriptionModal visible={visible} hideModal={hideModal} offerId={offerId} />)
    expect(screen).toMatchSnapshot()
  })

  it('should render correctly with eighteen years old deposit amount', () => {
    render(<FinishSubscriptionModal visible={visible} hideModal={hideModal} offerId={offerId} />)
    expect(screen).toMatchSnapshot()
  })

  it('should display correct body when user needs to verify his identity to activate his eighteen year old credit', async () => {
    mockUseAuthContext.mockReturnValueOnce({ user: { ...beneficiaryUser, requiresIdCheck: true } })

    render(<FinishSubscriptionModal visible={visible} hideModal={hideModal} offerId={offerId} />)
    expect(screen).toMatchSnapshot()
  })

  it('should close modal and navigate to stepper when pressing "Terminer mon inscription" button', () => {
    render(<FinishSubscriptionModal visible={visible} hideModal={hideModal} offerId={offerId} />)

    fireEvent.press(screen.getByText('Terminer mon inscription'))
    expect(hideModal).toBeCalledTimes(1)
    expect(navigate).toBeCalledWith('Stepper')
  })

  it('should close modal when pressing right header icon', () => {
    render(<FinishSubscriptionModal visible={visible} hideModal={hideModal} offerId={offerId} />)

    fireEvent.press(screen.getByTestId('Fermer la modale'))
    expect(hideModal).toBeCalledTimes(1)
  })

  it('should log analytics when clicking on close button with label "Aller vers la section profil', async () => {
    render(<FinishSubscriptionModal visible={visible} hideModal={hideModal} offerId={offerId} />)

    fireEvent.press(screen.getByLabelText('Aller vers la section profil'))

    expect(analytics.logGoToProfil).toHaveBeenNthCalledWith(1, {
      from: 'FinishSubscriptionModal',
      offerId,
    })
  })
})
