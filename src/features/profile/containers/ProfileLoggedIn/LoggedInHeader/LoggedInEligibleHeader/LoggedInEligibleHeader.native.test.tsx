import React from 'react'

import { UserEligibilityType } from 'features/auth/helpers/getEligibilityType'
import { nonBeneficiaryUser } from 'fixtures/user'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

import { LoggedInEligibleHeader } from './LoggedInEligibleHeader'

jest.mock('libs/firebase/analytics/analytics')

const featureFlags = {
  enablePassForAll: false,
  disableActivation: false,
  enableProfileV2: true,
}

describe('LoggedInEligibleHeader', () => {
  it('should render EligibleHeader for V1', () => {
    renderLoggedInEligibleHeader(UserEligibilityType.ELIGIBLE_CREDIT_V1_18)

    expect(screen.getByTestId('eligible-header')).toBeOnTheScreen()
  })

  it('should render EligibleHeader for V2', () => {
    renderLoggedInEligibleHeader(UserEligibilityType.ELIGIBLE_CREDIT_V2_18)

    expect(screen.getByTestId('eligible-header')).toBeOnTheScreen()
  })

  it('should render EligibleFreeHeader with age 15 for V3_15', () => {
    renderLoggedInEligibleHeader(UserEligibilityType.ELIGIBLE_CREDIT_V3_15)

    expect(screen.getByTestId('eligible-free-header')).toBeOnTheScreen()
  })

  it('should render EligibleFreeHeader with age 16 for V3_16', () => {
    renderLoggedInEligibleHeader(UserEligibilityType.ELIGIBLE_CREDIT_V3_16)

    expect(screen.getByTestId('eligible-free-header')).toBeOnTheScreen()
  })

  it('should render EligibleHeader for V3_17', () => {
    renderLoggedInEligibleHeader(UserEligibilityType.ELIGIBLE_CREDIT_V3_17)

    expect(screen.getByTestId('eligible-header')).toBeOnTheScreen()
  })

  it('should render PageHeader fallback for unknown eligibility', () => {
    renderLoggedInEligibleHeader(UserEligibilityType.NOT_ELIGIBLE)

    expect(screen.getByText('Mon profil')).toBeOnTheScreen()
  })
})

const renderLoggedInEligibleHeader = (eligibilityType: UserEligibilityType) =>
  render(
    reactQueryProviderHOC(
      <LoggedInEligibleHeader
        user={{ ...nonBeneficiaryUser, eligibilityType }}
        featureFlags={featureFlags}
      />
    )
  )
