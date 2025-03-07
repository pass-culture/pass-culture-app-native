import { domains_credit_v3 } from 'features/profile/fixtures/domainsCredit'

import { computeCredit } from './computeCredit'

describe('computeCredit', () => {
  it('should compute credit', () => {
    expect(computeCredit(domains_credit_v3)).toEqual(75_00)
  })

  it('should compute credit equal to zero when no domainsCredit', () => {
    expect(computeCredit(null)).toEqual(0)
  })
})
