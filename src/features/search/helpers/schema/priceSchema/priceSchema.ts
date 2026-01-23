import { boolean, object, string } from 'yup'

import { Currency } from 'shared/currency/useGetCurrencyToDisplay'

type PriceValidationParams = {
  initialCredit: number
  currency: Currency
}

const PRICE_REGEX = /^\d+(?:[,.]\d{0,2})?$/
const formatPriceError = `Format du prix incorrect. Exemple de format attendu\u00a0: 10,00`
const minPriceError = `Le montant minimum ne peut pas dépasser le montant maximum`

const maxPriceError = ({ initialCredit, currency }: PriceValidationParams) => {
  return `Le prix indiqué ne doit pas dépasser ${initialCredit}\u00a0${currency}`
}

const maxPriceValidationSchema = ({ initialCredit, currency }: PriceValidationParams) =>
  string()
    .trim()
    .test('validPrice', formatPriceError, (value) => {
      if (!value) return true
      return PRICE_REGEX.test(value.trim())
    })
    .test('validMaxPrice', maxPriceError({ initialCredit, currency }), (value) => {
      if (!value) return true
      return Number(value.trim().replaceAll(',', '.')) <= Number(initialCredit)
    })

const minPriceWithConditions = ({ initialCredit, currency }: PriceValidationParams) =>
  maxPriceValidationSchema({ initialCredit, currency }).when(['maxPrice'], (maxPrice, schema) => {
    if (!!maxPrice && maxPrice.trim().length > 0) {
      return schema.test('validMinPrice', minPriceError, (minPrice) => {
        if (!minPrice) return true
        const min = Number(minPrice.trim().replace(',', '.'))
        const max = Number(maxPrice.trim().replace(',', '.'))
        return min <= max
      })
    }
    return schema
  })

export const priceSchema = ({ initialCredit, currency }: PriceValidationParams) =>
  object().shape({
    minPrice: minPriceWithConditions({ initialCredit, currency }),
    maxPrice: maxPriceValidationSchema({ initialCredit, currency }),
    isLimitCreditSearch: boolean(),
    isOnlyFreeOffersSearch: boolean(),
  })
