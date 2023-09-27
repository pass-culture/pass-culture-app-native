import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { StepperOrigin } from 'features/navigation/RootNavigator/types'
import { beneficiaryUser } from 'fixtures/user'
import { useGetDepositAmountsByAge } from 'shared/user/useGetDepositAmountsByAge'
import { fireEvent, render, screen } from 'tests/utils'

import { FinishSubscriptionModal } from './FinishSubscriptionModal'

jest.mock('features/auth/context/AuthContext')
const mockUseAuthContext = useAuthContext as jest.Mock
mockUseAuthContext.mockReturnValue({ user: beneficiaryUser })

jest.mock('shared/user/useGetDepositAmountsByAge')
const mockDepositAmounts = useGetDepositAmountsByAge as jest.Mock
mockDepositAmounts.mockReturnValue('300\u00a0€')

const hideModal = jest.fn()
const visible = true

const modalProps = {
  visible,
  hideModal,
  from: StepperOrigin.FAVORITE,
}

describe('<FinishSubscriptionModal />', () => {
  it('should render correctly with undefined deposit amount', () => {
    mockDepositAmounts.mockReturnValueOnce(undefined)

    render(<FinishSubscriptionModal {...modalProps} />)
    expect(screen).toMatchSnapshot()
  })

  it('should render correctly with eighteen years old deposit amount', () => {
    render(<FinishSubscriptionModal {...modalProps} />)
    expect(screen).toMatchSnapshot()
  })

  it('should display correct body when user needs to verify his identity to activate his eighteen year old credit', async () => {
    mockUseAuthContext.mockReturnValueOnce({ user: { ...beneficiaryUser, requiresIdCheck: true } })

    render(<FinishSubscriptionModal {...modalProps} />)
    expect(screen).toMatchSnapshot()
  })

  it('should close modal and navigate to stepper when pressing "Confirmer mes informations" button', () => {
    render(<FinishSubscriptionModal {...modalProps} />)

    fireEvent.press(screen.getByText('Confirmer mes informations'))
    expect(hideModal).toBeCalledTimes(1)
    expect(navigate).toBeCalledWith('Stepper', { from: StepperOrigin.FAVORITE })
  })

  it('should close modal when pressing right header icon', () => {
    render(<FinishSubscriptionModal {...modalProps} />)

    fireEvent.press(screen.getByTestId('Fermer la modale'))
    expect(hideModal).toBeCalledTimes(1)
  })
})
