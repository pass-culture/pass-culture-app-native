import React from 'react'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { BeneficiaryAccountCreated } from 'features/identityCheck/pages/confirmation/BeneficiaryAccountCreated'
import { ShareAppWrapper } from 'features/share/context/ShareAppWrapper'
import { ShareAppModalType } from 'features/share/types'
import { beneficiaryUser, underageBeneficiaryUser } from 'fixtures/user'
import { BatchUser } from 'libs/react-native-batch'
import { fireEvent, render, screen } from 'tests/utils'

jest.mock('features/auth/context/AuthContext')
const mockUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>

const mockShowAppModal = jest.fn()
jest.mock('features/share/context/ShareAppWrapper', () => ({
  ...jest.requireActual('features/share/context/ShareAppWrapper'),
  useShareAppContext: () => ({ showShareAppModal: mockShowAppModal }),
}))

describe('<BeneficiaryAccountCreated/>', () => {
  beforeEach(() => {
    mockUseAuthContext.mockReturnValue({
      isLoggedIn: true,
      setIsLoggedIn: jest.fn(),
      user: underageBeneficiaryUser,
      refetchUser: jest.fn(),
      isUserLoading: false,
    })
  })

  it('should render correctly for underage beneficiaries', () => {
    renderBeneficiaryAccountCreated()

    expect(screen).toMatchSnapshot()
  })

  it('should render correctly for 18 year-old beneficiaries', () => {
    // Too many rerenders but we reset the values before each tests
    // eslint-disable-next-line local-rules/independent-mocks
    mockUseAuthContext.mockReturnValue({
      isLoggedIn: true,
      setIsLoggedIn: jest.fn(),
      user: beneficiaryUser,
      refetchUser: jest.fn(),
      isUserLoading: false,
    })
    renderBeneficiaryAccountCreated()

    expect(screen).toMatchSnapshot()
  })

  it('should track Batch event when button is clicked', async () => {
    renderBeneficiaryAccountCreated()
    fireEvent.press(screen.getByText('C’est parti !'))

    expect(BatchUser.trackEvent).toHaveBeenCalledWith('has_validated_subscription')
  })

  it('should show beneficiary share app modal when button is clicked', async () => {
    // Too many rerenders but we reset the values before each tests
    // eslint-disable-next-line local-rules/independent-mocks
    mockUseAuthContext.mockReturnValue({
      isLoggedIn: true,
      setIsLoggedIn: jest.fn(),
      user: { ...beneficiaryUser, needsToFillCulturalSurvey: false },
      refetchUser: jest.fn(),
      isUserLoading: false,
    })
    renderBeneficiaryAccountCreated()
    fireEvent.press(screen.getByText('C’est parti !'))

    expect(mockShowAppModal).toHaveBeenNthCalledWith(1, ShareAppModalType.BENEFICIARY)
  })

  it('should not show share app modal if user sees cultural survey', async () => {
    renderBeneficiaryAccountCreated()
    fireEvent.press(screen.getByText('C’est parti !'))

    expect(mockShowAppModal).not.toHaveBeenCalled()
  })
})

const renderBeneficiaryAccountCreated = () =>
  render(<BeneficiaryAccountCreated />, { wrapper: ShareAppWrapper })
