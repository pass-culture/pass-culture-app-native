import React from 'react'

import { UserStatusType } from 'features/auth/helpers/getStatusType'
import { UserProfileResponseWithoutSurvey } from 'features/share/types'
import { beneficiaryUser, nonBeneficiaryUser, exBeneficiaryUser } from 'fixtures/user'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

import { LoggedInHeader } from './LoggedInHeader'

jest.mock('libs/firebase/analytics/analytics')

const featureFlags = {
  enablePassForAll: false,
  disableActivation: false,
  enableProfileV2: true,
}

describe('LoggedInHeader', () => {
  it('should render LoggedInEligibleHeader when user is ELIGIBLE', () => {
    const eligibleUser = { ...nonBeneficiaryUser, statusType: UserStatusType.ELIGIBLE }
    renderLoggedInHeader({ user: eligibleUser })

    expect(screen.getByTestId('logged-in-eligible-header')).toBeOnTheScreen()
  })

  it('should render LoggedInBeneficiaryHeader when user is BENEFICIARY', () => {
    renderLoggedInHeader({ user: beneficiaryUser })

    expect(screen.getByTestId('logged-in-beneficiary-header')).toBeOnTheScreen()
  })

  it('should render LoggedInExBeneficiaryHeader when user is EX_BENEFICIARY', () => {
    renderLoggedInHeader({ user: exBeneficiaryUser })

    expect(screen.getByTestId('logged-in-ex-beneficiary-header')).toBeOnTheScreen()
  })

  it('should render LoggedInGeneralPublicHeader when user is GENERAL_PUBLIC', () => {
    renderLoggedInHeader({ user: nonBeneficiaryUser })

    expect(screen.getByTestId('logged-in-general-public-header')).toBeOnTheScreen()
  })

  it('should render LoggedInGeneralPublicHeader when user is UNKNOWN', () => {
    const unknownUser = { ...nonBeneficiaryUser, statusType: UserStatusType.UNKNOWN }
    renderLoggedInHeader({ user: unknownUser })

    expect(screen.getByTestId('logged-in-general-public-header')).toBeOnTheScreen()
  })
})

const renderLoggedInHeader = ({ user }: { user: UserProfileResponseWithoutSurvey }) => {
  render(reactQueryProviderHOC(<LoggedInHeader featureFlags={featureFlags} user={user} />))
}
