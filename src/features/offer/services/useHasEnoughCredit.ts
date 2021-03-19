import { DomainsCredit, ExpenseDomain } from 'api/gen'
import { useUserProfileInfo } from 'features/home/api'
import { useOffer } from 'features/offer/api/useOffer'

import { getOfferPrice } from './getOfferPrice'

export const hasEnoughCredit = (
  domains: Array<ExpenseDomain>,
  price: number,
  domainsCredit: DomainsCredit
): boolean =>
  domains.every((domain) => {
    const credit = domainsCredit[domain]
    if (!credit) return true
    return price === 0 || price <= credit.remaining
  })

export const useHasEnoughCredit = (offerId: number): boolean => {
  const { data: offer } = useOffer({ offerId })
  const { data: user } = useUserProfileInfo()
  if (!offer || !user) return false

  const { domainsCredit } = user
  if (!domainsCredit) return false

  const price = getOfferPrice(offer.stocks)

  return hasEnoughCredit(offer.expenseDomains, price, domainsCredit)
}
