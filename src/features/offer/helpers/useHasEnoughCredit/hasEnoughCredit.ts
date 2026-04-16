import { FavoriteOfferResponse, OfferResponse } from 'api/gen'
import { UserProfile } from 'features/share/types'

export const hasEnoughCredit = (
  domains: OfferResponse['expenseDomains'] | FavoriteOfferResponse['expenseDomains'],
  price: number | FavoriteOfferResponse['price'] | FavoriteOfferResponse['startPrice'],
  domainsCredit: UserProfile['domainsCredit']
): boolean => {
  if (!price) return true
  if (!domainsCredit) return false
  return domains.every((domain) => {
    const credit = domainsCredit[domain]
    if (!credit) return true
    return price <= credit.remaining
  })
}
