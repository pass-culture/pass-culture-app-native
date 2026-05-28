import React from 'react'

import { UserEligibilityType } from 'features/auth/helpers/getEligibilityType'
import { nonBeneficiaryUser } from 'fixtures/user'
import { useFeatureFlagOptionsQuery } from 'libs/firebase/firestore/featureFlags/queries/useFeatureFlagOptionsQuery'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderAsync, screen } from 'tests/utils'

import { LoggedInEligibleHeader } from './LoggedInEligibleHeader'

jest.mock('libs/firebase/analytics/analytics')
jest.mock('libs/firebase/firestore/featureFlags/queries/useFeatureFlagOptionsQuery', () => ({
  useFeatureFlagOptionsQuery: jest.fn(),
}))

const mockUseFeatureFlagOptionsQuery = useFeatureFlagOptionsQuery as jest.Mock

const featureFlags = {
  disableActivation: false,
  enableProfileV2: true,
}

describe('LoggedInEligibleHeader', () => {
  beforeAll(() =>
    mockUseFeatureFlagOptionsQuery.mockReturnValue({ options: { message: 'désactivé' } })
  )

  it('should render EligibleHeader for V1', async () => {
    await renderLoggedInEligibleHeader(UserEligibilityType.ELIGIBLE_CREDIT_V1_18)

    expect(screen.getByTestId('eligible-header')).toBeOnTheScreen()
  })

  it('should render EligibleHeader for V2', async () => {
    await renderLoggedInEligibleHeader(UserEligibilityType.ELIGIBLE_CREDIT_V2_18)

    expect(screen.getByTestId('eligible-header')).toBeOnTheScreen()
  })

  it('should render EligibleFreeHeader with age 15 for V3_15', async () => {
    await renderLoggedInEligibleHeader(UserEligibilityType.ELIGIBLE_CREDIT_V3_15)

    expect(screen.getByTestId('eligible-free-header')).toBeOnTheScreen()
  })

  it('should render EligibleFreeHeader with age 16 for V3_16', async () => {
    await renderLoggedInEligibleHeader(UserEligibilityType.ELIGIBLE_CREDIT_V3_16)

    expect(screen.getByTestId('eligible-free-header')).toBeOnTheScreen()
  })

  it('should render EligibleHeader for V3_17', async () => {
    await renderLoggedInEligibleHeader(UserEligibilityType.ELIGIBLE_CREDIT_V3_17)

    expect(screen.getByTestId('eligible-header')).toBeOnTheScreen()
  })

  it('should render PageHeader fallback for unknown eligibility', async () => {
    await renderLoggedInEligibleHeader(UserEligibilityType.NOT_ELIGIBLE)

    expect(screen.getByText('Mon profil')).toBeOnTheScreen()
  })
})

const renderLoggedInEligibleHeader = (eligibilityType: UserEligibilityType) =>
  renderAsync(
    reactQueryProviderHOC(
      <LoggedInEligibleHeader
        user={{ ...nonBeneficiaryUser, eligibilityType }}
        featureFlags={featureFlags}
      />
    )
  )
