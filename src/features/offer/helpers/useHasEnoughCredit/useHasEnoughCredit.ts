import { Credit, DomainsCredit, ExpenseDomain } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { convertCentsToEuros } from 'libs/parsers/pricesConversion'
import { useOfferQuery } from 'queries/offer/useOfferQuery'
import { RoundUnit, convertEuroToPacificFranc } from 'shared/currency/convertEuroToPacificFranc'
import { Currency } from 'shared/currency/useGetCurrencyToDisplay'

export type HasEnoughCredit =
  | { hasEnoughCredit: true; message?: never }
  | { hasEnoughCredit: false; message?: string }

const euroCentsToXPF = (amount: number) =>
  convertEuroToPacificFranc(convertCentsToEuros(amount), RoundUnit.UNITS)

const convertCreditToXPF = (credit: Credit): Credit => {
  return {
    initial: euroCentsToXPF(credit.initial),
    remaining: euroCentsToXPF(credit.remaining),
  }
}

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

export const getUserHasEnoughCredit = (
  currency: Currency,
  price: number,
  offerExpenseDomains: ExpenseDomain[],
  userDomainsCredit?: DomainsCredit | null
): HasEnoughCredit => {
  if (!userDomainsCredit) return { hasEnoughCredit: false }

  const hasEnoughCreditInEuro = hasEnoughCredit(offerExpenseDomains, price, userDomainsCredit)
  if (currency === Currency.EURO) return { hasEnoughCredit: hasEnoughCreditInEuro }

  const userDomaineCreditInXPF: DomainsCredit = {
    all: convertCreditToXPF(userDomainsCredit.all),
  }
  const hasEnoughCreditInXPF = hasEnoughCredit(
    offerExpenseDomains,
    euroCentsToXPF(price),
    userDomaineCreditInXPF
  )

  // If the user has enough credit in Euro but not in Pacific Franc, we return false with a message
  if (!hasEnoughCreditInEuro && hasEnoughCreditInXPF) {
    return {
      hasEnoughCredit: false,
      message:
        'En raison des conversions monétaires, ton crédit disponible ne couvre pas le prix total.',
    }
  }

  // If the user has enough credit in Pacific Franc, we return true
  return { hasEnoughCredit: hasEnoughCreditInXPF }
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
