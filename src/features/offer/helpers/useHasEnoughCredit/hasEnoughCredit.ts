import { FavoriteOfferResponse, OfferResponseV2, UserProfileResponse } from 'api/gen'

export const hasEnoughCredit = (
  domains: OfferResponseV2['expenseDomains'] | FavoriteOfferResponse['expenseDomains'],
  price: number | FavoriteOfferResponse['price'] | FavoriteOfferResponse['startPrice'],
  domainsCredit: UserProfileResponse['domainsCredit']
): boolean => {
  if (!price) return true
  if (!domainsCredit) return false
  return domains.every((domain) => {
    const credit = domainsCredit[domain]
    if (!credit) return true
    return price <= credit.remaining
  })
}
