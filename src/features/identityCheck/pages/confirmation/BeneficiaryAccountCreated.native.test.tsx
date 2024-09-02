import React from 'react'

import { BeneficiaryAccountCreated } from 'features/identityCheck/pages/confirmation/BeneficiaryAccountCreated'
import { ShareAppWrapper } from 'features/share/context/ShareAppWrapper'
import * as ShareAppWrapperModule from 'features/share/context/ShareAppWrapper'
import { ShareAppModalType } from 'features/share/types'
import { beneficiaryUser, underageBeneficiaryUser } from 'fixtures/user'
import { BatchUser } from 'libs/react-native-batch'
import { mockAuthContextWithUser } from 'tests/AuthContextUtils'
import { fireEvent, render, screen } from 'tests/utils'

jest.mock('features/auth/context/AuthContext')

const mockShowAppModal = jest.fn()
jest
  .spyOn(ShareAppWrapperModule, 'useShareAppContext')
  .mockReturnValue({ showShareAppModal: mockShowAppModal })

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

describe('<BeneficiaryAccountCreated/>', () => {
  beforeEach(() => {
    mockAuthContextWithUser(underageBeneficiaryUser, { persist: true })
  })

  it('should render correctly for underage beneficiaries', async () => {
    renderBeneficiaryAccountCreated()

    await screen.findByLabelText('C’est parti !')

    expect(screen).toMatchSnapshot()
  })

  it('should render correctly for 18 year-old beneficiaries', async () => {
    mockAuthContextWithUser(beneficiaryUser, { persist: true })
    renderBeneficiaryAccountCreated()

    await screen.findByLabelText('C’est parti !')

    expect(screen).toMatchSnapshot()
  })

  it('should track Batch event when button is clicked', async () => {
    renderBeneficiaryAccountCreated()
    fireEvent.press(await screen.findByLabelText('C’est parti !'))

    expect(BatchUser.trackEvent).toHaveBeenCalledWith('has_validated_subscription')
  })

  it('should show beneficiary share app modal when button is clicked', async () => {
    // Too many rerenders but we reset the values before each tests
    // eslint-disable-next-line local-rules/independent-mocks
    mockAuthContextWithUser(
      { ...beneficiaryUser, needsToFillCulturalSurvey: false },
      { persist: true }
    )

    renderBeneficiaryAccountCreated()
    fireEvent.press(await screen.findByLabelText('C’est parti !'))

    expect(mockShowAppModal).toHaveBeenNthCalledWith(1, ShareAppModalType.BENEFICIARY)
  })

  it('should not show share app modal when user is supposed to see cultural survey', async () => {
    renderBeneficiaryAccountCreated()
    fireEvent.press(await screen.findByLabelText('C’est parti !'))

    expect(mockShowAppModal).not.toHaveBeenCalled()
  })
})

const renderBeneficiaryAccountCreated = () =>
  render(<BeneficiaryAccountCreated />, { wrapper: ShareAppWrapper })
