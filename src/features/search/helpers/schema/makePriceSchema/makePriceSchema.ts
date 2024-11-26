import { string } from 'yup'

import { parseCurrencyFromCents } from 'libs/parsers/parseCurrencyFromCents'
import { convertEuroToCents } from 'libs/parsers/pricesConversion'
import { Currency } from 'shared/currency/useGetCurrencyToDisplay'

// integers separated by a dot or comma with 2 decimals max
const PRICE_REGEX = /^\d+(?:[,.]\d{0,2})?$/
const formatPriceError = `Format du prix incorrect. Exemple de format attendu\u00a0: 10,00`

const maxPriceError = (
  initialCreditInEuro: string,
  currency: Currency,
  euroToPacificFrancRate: number
) => {
  const initialCreditInCents = convertEuroToCents(Number(initialCreditInEuro))
  const maxPrice = parseCurrencyFromCents(initialCreditInCents, currency, euroToPacificFrancRate)
  return `Le prix indiqué ne doit pas dépasser ${maxPrice}`
}

export const makePriceSchema = (
  initialCreditInEuro: string,
  currency: Currency,
  euroToPacificFrancRate: number
) =>
  string()
    .trim()
    .test('validPrice', formatPriceError, (value) => {
      if (!value) return true
      return PRICE_REGEX.test(value.trim())
    })
    .test(
      'validMaxPrice',
      maxPriceError(initialCreditInEuro, currency, euroToPacificFrancRate),
      (value) => {
        if (!value) return true
        return Number(value.trim().replaceAll(',', '.')) <= Number(initialCreditInEuro)
      }
    )
