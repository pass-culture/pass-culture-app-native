import { FavoriteOfferResponse, OfferResponseV2 } from 'api/gen'
import { UserProfileResponseWithoutSurvey } from 'features/share/types'

export const hasEnoughCredit = (
  domains: OfferResponseV2['expenseDomains'] | FavoriteOfferResponse['expenseDomains'],
  price: number | FavoriteOfferResponse['price'] | FavoriteOfferResponse['startPrice'],
  domainsCredit: UserProfileResponseWithoutSurvey['domainsCredit']
): boolean => {
  if (!price) return true
  if (!domainsCredit) return false
  return domains.every((domain) => {
    const credit = domainsCredit[domain]
    if (!credit) return true
    return price <= credit.remaining
  })
}
