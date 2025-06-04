import { FavoriteOfferResponse, OfferResponseV2, UserProfileResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { useOfferQuery } from 'queries/offer/useOfferQuery'

import { getOfferPrice } from '../getOfferPrice/getOfferPrice'

export const hasEnoughCredit = (
  domains: OfferResponseV2['expenseDomains'] | FavoriteOfferResponse['expenseDomains'],
  price: number | FavoriteOfferResponse['price'] | FavoriteOfferResponse['startPrice'],
  domainsCredit: UserProfileResponse['domainsCredit']
): boolean => {
  if (!price) {
    return true
  }
  if (!domainsCredit) {
    return false
  }
  return domains.every((domain) => {
    const credit = domainsCredit[domain]
    if (!credit) {
      return true
    }
    return price <= credit.remaining
  })
}

export const useHasEnoughCredit = (
  offer?: Pick<OfferResponseV2, 'stocks' | 'expenseDomains'>
): boolean => {
  const { user } = useAuthContext()
  if (!offer || !user) return false

  const price = getOfferPrice(offer.stocks)

  return hasEnoughCredit(offer.expenseDomains, price, user.domainsCredit)
}

export const useCreditForOffer = (offerId: number | undefined): number => {
  const { data: offer } = useOfferQuery({ offerId: offerId as number })
  const { user } = useAuthContext()
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
