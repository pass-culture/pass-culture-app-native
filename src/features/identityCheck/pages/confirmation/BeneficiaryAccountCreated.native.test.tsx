import React from 'react'

import { BeneficiaryAccountCreated } from 'features/identityCheck/pages/confirmation/BeneficiaryAccountCreated'
import { ShareAppWrapper } from 'features/shareApp/context/ShareAppWrapper'
import { ShareAppModalType } from 'features/shareApp/helpers/shareAppModalInformations'
import { BatchUser } from 'libs/react-native-batch'
import { fireEvent, render } from 'tests/utils'

jest.mock('react-query')

let mockIsUserUnderageBeneficiary = true
jest.mock('features/profile/utils', () => {
  return {
    isUserUnderageBeneficiary: jest.fn(() => {
      return mockIsUserUnderageBeneficiary
    }),
  }
})
const mockShowAppModal = jest.fn()
jest.mock('features/shareApp/context/ShareAppWrapper', () => ({
  ...jest.requireActual('features/shareApp/context/ShareAppWrapper'),
  useShareAppContext: () => ({ showShareAppModal: mockShowAppModal }),
}))

describe('<BeneficiaryAccountCreated/>', () => {
  it('should render correctly for underage beneficiaries', () => {
    const renderAPI = renderBeneficiaryAccountCreated()
    expect(renderAPI).toMatchSnapshot()
  })
  it('should render correctly for 18 year-old beneficiaries', () => {
    mockIsUserUnderageBeneficiary = false
    const renderAPI = renderBeneficiaryAccountCreated()
    expect(renderAPI).toMatchSnapshot()
  })
  it('should track Batch event when button is clicked', async () => {
    const { getByText } = renderBeneficiaryAccountCreated()
    fireEvent.press(getByText('C’est parti !'))
    expect(BatchUser.trackEvent).toBeCalledWith('has_validated_subscription')
  })
  it('should show beneficiary share app modal when button is clicked', async () => {
    const { getByText } = renderBeneficiaryAccountCreated()
    fireEvent.press(getByText('C’est parti !'))
    expect(mockShowAppModal).toHaveBeenNthCalledWith(1, ShareAppModalType.BENEFICIARY)
  })
})

const renderBeneficiaryAccountCreated = () =>
  render(<BeneficiaryAccountCreated />, { wrapper: ShareAppWrapper })
