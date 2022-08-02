import React from 'react'

import { BeneficiaryHeaderNew } from 'features/profile/components/headers/BeneficiaryHeader/BeneficiaryHeaderNew'
import { domains_credit_v1 } from 'features/profile/components/headers/fixtures/domainsCredit'
import { render } from 'tests/utils'

jest.mock('features/profile/api')

describe('BeneficiaryHeaderNew', () => {
  it('should display user name', () => {
    const { queryByText } = render(<BeneficiaryHeaderNew firstName="Rosa" lastName="Bonheur" />)
    const name = queryByText('Rosa Bonheur')
    expect(name).toBeTruthy()
  })

  it('should display deposit expiration date', () => {
    const { queryByText } = render(
      <BeneficiaryHeaderNew depositExpirationDate={'2023-02-16T17:16:04.735235'} />
    )
    const depositExpirationDate = queryByText('16/02/2023')
    expect(depositExpirationDate).toBeTruthy()
  })

  it('should display credit ceilings', () => {
    const { queryByTestId } = render(<BeneficiaryHeaderNew domainsCredit={domains_credit_v1} />)
    const digitalCredit = queryByTestId('domains-credit-digital')
    expect(digitalCredit).toBeTruthy()
  })
})
