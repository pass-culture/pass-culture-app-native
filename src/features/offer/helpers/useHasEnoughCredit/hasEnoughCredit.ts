import { DomainsCredit, ExpenseDomain } from 'api/gen'

export const hasEnoughCredit = (
  domains: ExpenseDomain[],
  price: number,
  domainsCredit: DomainsCredit
): boolean => {
  if (!price) return true
  if (!domainsCredit) return false
  return domains.every((domain) => {
    const credit = domainsCredit[domain]
    if (!credit) return true
    return price <= credit.remaining
  })
}
