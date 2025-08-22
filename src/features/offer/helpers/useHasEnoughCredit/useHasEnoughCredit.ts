import { OfferResponseV2, UserProfileResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { getOfferPrice } from 'features/offer/helpers/getOfferPrice/getOfferPrice'
import { hasEnoughCredit } from 'features/offer/helpers/useHasEnoughCredit/hasEnoughCredit'
import { convertCentsToEuros } from 'libs/parsers/pricesConversion'
import { useOfferQuery } from 'queries/offer/useOfferQuery'
import { RoundUnit, convertEuroToPacificFranc } from 'shared/currency/convertEuroToPacificFranc'
import { Currency, useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { useGetPacificFrancToEuroRate } from 'shared/exchangeRates/useGetPacificFrancToEuroRate'

export type HasEnoughCredit =
  | { hasEnoughCredit: true; message?: never }
  | { hasEnoughCredit: false; message?: string }

const message =
  'En raison des conversions monétaires, ton crédit disponible ne couvre pas le prix total.'

function convertDomainCreditToPacificFranc(
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

export const useHasEnoughCredit = (
  offer?: Pick<OfferResponseV2, 'stocks' | 'expenseDomains'>
): HasEnoughCredit => {
  const { user } = useAuthContext()
  const currency = useGetCurrencyToDisplay()
  const euroToPacificFrancRate = useGetPacificFrancToEuroRate()

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

  const userDomaineCreditInPacificFranc: UserProfileResponse['domainsCredit'] = {
    all: convertDomainCreditToPacificFranc(user.domainsCredit.all, euroToPacificFrancRate),
  }

  const hasEnoughCreditInPacificFranc = hasEnoughCredit(
    offer.expenseDomains,
    priceInPacificFranc,
    userDomaineCreditInPacificFranc
  )

  // If the user has enough credit in Euro but not in Pacific Franc, we return false with a message
  if (!hasEnoughCreditInEuro && hasEnoughCreditInPacificFranc) {
    return { hasEnoughCredit: false, message: message }
  }

  // If the user has enough credit in Pacific Franc, we return true
  return { hasEnoughCredit: hasEnoughCreditInEuro }
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
