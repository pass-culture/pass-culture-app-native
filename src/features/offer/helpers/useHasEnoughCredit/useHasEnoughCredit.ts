import { FavoriteOfferResponse, OfferResponse, UserProfileResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/AuthContext'
import { useOffer } from 'features/offer/api/useOffer'
import { useUserProfileInfo } from 'features/profile/api'

import { getOfferPrice } from '../getOfferPrice/getOfferPrice'

export const hasEnoughCredit = (
  domains: OfferResponse['expenseDomains'] | FavoriteOfferResponse['expenseDomains'],
  price: number | FavoriteOfferResponse['price'] | FavoriteOfferResponse['startPrice'],
  domainsCredit: UserProfileResponse['domainsCredit']
): boolean => {
  if (!domainsCredit) {
    return false
  }
  if (!price) {
    return true
  }
  return domains.every((domain) => {
    const credit = domainsCredit[domain]
    if (!credit) {
      return true
    }
    return price <= credit.remaining
  })
}

export const useHasEnoughCredit = (offerId: number): boolean => {
  const { data: offer } = useOffer({ offerId })
  const { user } = useAuthContext()
  if (!offer || !user) return false

  const price = getOfferPrice(offer.stocks)

  return hasEnoughCredit(offer.expenseDomains, price, user.domainsCredit)
}

export const useCreditForOffer = (offerId: number | undefined): number => {
  const { data: offer } = useOffer({ offerId: offerId as number })
  const { data: user } = useUserProfileInfo()
  if (!offer || !user) return 0

  const { domainsCredit } = user
  if (!domainsCredit) return 0

  const creditsRemainingPerDomain = offer.expenseDomains
    .map((domain) => {
      const expenseDomain = domainsCredit[domain]
      if (expenseDomain === null || expenseDomain === undefined) return undefined
      return expenseDomain.remaining
    })
    .filter((remainingCredit) => typeof remainingCredit === 'number') as number[]

  return creditsRemainingPerDomain.length > 0 ? Math.min(...creditsRemainingPerDomain) : 0
}
