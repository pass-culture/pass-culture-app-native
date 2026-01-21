import { FavoriteOfferResponse, OfferResponseV2 } from 'api/gen'
import { getOfferPrice } from 'features/offer/helpers/getOfferPrice/getOfferPrice'
import { HasEnoughCreditType } from 'features/offerRefacto/types'
import { UserProfileResponseWithoutSurvey } from 'features/share/types'
import { convertCentsToEuros } from 'libs/parsers/pricesConversion'
import { RoundUnit, convertEuroToPacificFranc } from 'shared/currency/convertEuroToPacificFranc'
import { Currency } from 'shared/currency/useGetCurrencyToDisplay'

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

export function convertDomainCreditToPacificFranc(
  credit: { initial: number; remaining: number },
  rate: number
) {
  return {
    initial: convertEuroToPacificFranc(convertCentsToEuros(credit.initial), rate, RoundUnit.UNITS),
    remaining: convertEuroToPacificFranc(
      convertCentsToEuros(credit.remaining),
      rate,
      RoundUnit.UNITS
    ),
  }
}

type CheckHasEnoughCreditType = {
  offer: Pick<OfferResponseV2, 'stocks' | 'expenseDomains'>
  currency: Currency
  euroToPacificFrancRate: number
  user?: UserProfileResponseWithoutSurvey
}

export const checkHasEnoughCredit = ({
  offer,
  currency,
  euroToPacificFrancRate,
  user,
}: CheckHasEnoughCreditType): HasEnoughCreditType => {
  // If the offer, user, or userDomaineCredit is not available, we return false
  if (!offer || !user?.domainsCredit) return { hasEnoughCredit: false }

  const priceInEuroCents = getOfferPrice(offer.stocks)
  const hasEnoughCreditInEuro = hasEnoughCredit(
    offer.expenseDomains,
    priceInEuroCents,
    user.domainsCredit
  )

  // If the currency is Euro, we only check the Euro credit
  if (currency === Currency.EURO) return { hasEnoughCredit: hasEnoughCreditInEuro }

  const priceInPacificFranc = convertEuroToPacificFranc(
    convertCentsToEuros(priceInEuroCents),
    euroToPacificFrancRate,
    RoundUnit.UNITS
  )

  const userDomaineCreditInPacificFranc: UserProfileResponseWithoutSurvey['domainsCredit'] = {
    all: convertDomainCreditToPacificFranc(user.domainsCredit.all, euroToPacificFrancRate),
  }

  const hasEnoughCreditInPacificFranc = hasEnoughCredit(
    offer.expenseDomains,
    priceInPacificFranc,
    userDomaineCreditInPacificFranc
  )

  // If the user has enough credit in Euro but not in Pacific Franc, we return false with a message
  if (!hasEnoughCreditInEuro && hasEnoughCreditInPacificFranc) {
    return {
      hasEnoughCredit: false,
      message:
        'En raison des conversions monétaires, ton crédit disponible ne couvre pas le prix total.',
    }
  }

  // If the user has enough credit in Pacific Franc, we return true
  return { hasEnoughCredit: hasEnoughCreditInEuro }
}

export const getMinRemainingCreditForOffer = (
  expenseDomains: OfferResponseV2['expenseDomains'],
  domainsCredit: UserProfileResponseWithoutSurvey['domainsCredit']
): number => {
  if (!domainsCredit) return 0

  const creditsRemainingPerDomain = expenseDomains
    .map((domain) => {
      const expenseDomain = domainsCredit[domain]
      if (expenseDomain === null || expenseDomain === undefined) return undefined
      return expenseDomain.remaining
    })
    .filter((remainingCredit) => typeof remainingCredit === 'number') as number[]

  return creditsRemainingPerDomain.length > 0 ? Math.min(...creditsRemainingPerDomain) : 0
}
