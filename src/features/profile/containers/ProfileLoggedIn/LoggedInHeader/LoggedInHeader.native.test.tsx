import React from 'react'

import { beneficiaryUser, nonBeneficiaryUser } from 'fixtures/user'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

import { LoggedInHeader } from './LoggedInHeader'

jest.mock('libs/firebase/analytics/analytics')

const featureFlags = { enablePassForAll: false, disableActivation: false, enableProfileV2: true }

describe('LoggedInHeader', () => {
  it('renders LoggedInBeneficiaryHeader when user is beneficiary', () => {
    render(
      reactQueryProviderHOC(<LoggedInHeader featureFlags={featureFlags} user={beneficiaryUser} />)
    )

    expect(screen.getByTestId('logged-in-beneficiary-header')).toBeOnTheScreen()
    expect(screen.queryByTestId('logged-in-non-beneficiary-header')).not.toBeOnTheScreen()
  })

  it('renders LoggedInNonBeneficiaryHeader when user is not beneficiary', () => {
    render(
      reactQueryProviderHOC(
        <LoggedInHeader featureFlags={featureFlags} user={nonBeneficiaryUser} />
      )
    )

    expect(screen.queryByTestId('logged-in-beneficiary-header')).not.toBeOnTheScreen()
    expect(screen.getByTestId('logged-in-non-beneficiary-header')).toBeOnTheScreen()
  })
})
