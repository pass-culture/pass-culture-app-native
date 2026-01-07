import React from 'react'

import { DomainsCredit } from 'api/gen'
import { BeneficiaryCeilings } from 'features/profile/components/BeneficiaryCeilings/BeneficiaryCeilings'
import {
  domains_credit_underage_v3,
  domains_credit_v3,
  domains_exhausted_credit_v3,
} from 'features/profile/fixtures/domainsCredit'
import * as ProfileUtils from 'features/profile/helpers/useIsUserUnderageBeneficiary'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, waitFor } from 'tests/utils'

const mockUseIsUserUnderageBeneficiary = jest
  .spyOn(ProfileUtils, 'useIsUserUnderageBeneficiary')
  .mockReturnValue(false)

jest.mock('libs/firebase/analytics/analytics')

describe('BeneficiaryCeilings', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  it('should not return credits if credit is exhausted', () => {
    renderBeneficiaryCeilings(domains_exhausted_credit_v3)

    expect(screen.toJSON()).not.toBeOnTheScreen()
  })

  it('should return only digital credits', async () => {
    renderBeneficiaryCeilings(domains_credit_v3)

    const digitalCredit = screen.queryByTestId('domains-credit-digital')

    await waitFor(() => {
      expect(digitalCredit).toBeOnTheScreen()
    })
  })

  it('should not return credits if domains credit underage and is not user underage beneficiary', () => {
    renderBeneficiaryCeilings(domains_credit_underage_v3)

    expect(screen.toJSON()).not.toBeOnTheScreen()
  })

  it('should not return credits if user underage beneficiary', () => {
    mockUseIsUserUnderageBeneficiary.mockReturnValueOnce(true)
    renderBeneficiaryCeilings(domains_credit_v3)

    expect(screen.toJSON()).not.toBeOnTheScreen()
  })
})

function renderBeneficiaryCeilings(domainsCredit: DomainsCredit) {
  return render(reactQueryProviderHOC(<BeneficiaryCeilings domainsCredit={domainsCredit} />))
}
