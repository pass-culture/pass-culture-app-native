import React from 'react'

import { BeneficiaryAccountCreated } from 'features/identityCheck/pages/confirmation/BeneficiaryAccountCreated'
import { ShareAppWrapper } from 'features/share/context/ShareAppWrapper'
import { ShareAppModalType } from 'features/share/helpers/shareAppModalInformations'
import { BatchUser } from 'libs/react-native-batch'
import { fireEvent, render, screen } from 'tests/utils'

let mockIsUserUnderageBeneficiary = true
jest.mock('features/profile/helpers/isUserUnderageBeneficiary', () => {
  return {
    isUserUnderageBeneficiary: jest.fn(() => {
      return mockIsUserUnderageBeneficiary
    }),
  }
})

const mockShowAppModal = jest.fn()
jest.mock('features/share/context/ShareAppWrapper', () => ({
  ...jest.requireActual('features/share/context/ShareAppWrapper'),
  useShareAppContext: () => ({ showShareAppModal: mockShowAppModal }),
}))

describe('<BeneficiaryAccountCreated/>', () => {
  it('should render correctly for underage beneficiaries', () => {
    renderBeneficiaryAccountCreated()

    expect(screen).toMatchSnapshot()
  })

  it('should render correctly for 18 year-old beneficiaries', () => {
    mockIsUserUnderageBeneficiary = false
    renderBeneficiaryAccountCreated()

    expect(screen).toMatchSnapshot()
  })

  it('should track Batch event when button is clicked', async () => {
    renderBeneficiaryAccountCreated()
    fireEvent.press(screen.getByText('C’est parti !'))

    expect(BatchUser.trackEvent).toHaveBeenCalledWith('has_validated_subscription')
  })

  it('should show beneficiary share app modal when button is clicked', async () => {
    renderBeneficiaryAccountCreated()
    fireEvent.press(screen.getByText('C’est parti !'))

    expect(mockShowAppModal).toHaveBeenNthCalledWith(1, ShareAppModalType.BENEFICIARY)
  })
})

const renderBeneficiaryAccountCreated = () =>
  render(<BeneficiaryAccountCreated />, { wrapper: ShareAppWrapper })
