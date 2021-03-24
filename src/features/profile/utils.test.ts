import { computeCredit } from './utils'

const domainsCredit = {
  all: { initial: 50000, remaining: 40000 },
  physical: { initial: 30000, remaining: 10000 },
  digital: { initial: 30000, remaining: 20000 },
}

describe('profile utils', () => {
  it('should compute credit', () => {
    expect(computeCredit(domainsCredit)).toEqual(40000)
  })
  it('should compute credit equal to zero when no domainsCredit', () => {
    expect(computeCredit(null)).toEqual(0)
  })
})
