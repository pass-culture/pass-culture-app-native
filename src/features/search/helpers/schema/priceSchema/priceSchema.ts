import { AnySchema, boolean, object, string } from 'yup'

const PRICE_REGEX = /^\d+(?:[,.]\d{0,2})?$/
const formatPriceError = `Format du prix incorrect. Exemple de format attendu\u00a0: 10,00`
const minPriceError = `Le montant minimum ne peut pas dépasser le montant maximum`

const priceValidationSchema = () =>
  string()
    .trim()
    .test('validPrice', formatPriceError, (value) => !value || PRICE_REGEX.test(value.trim()))

const minPriceWithConditions = () =>
  priceValidationSchema().when(['maxPrice'], (maxPrice: string, schema: AnySchema) => {
    if (!maxPrice || !maxPrice.trim()) return schema

    return schema.test('minPriceLowerThanMax', minPriceError, (minPrice: string) => {
      if (!minPrice) return true
      const min = Number(minPrice.trim().replace(',', '.'))
      const max = Number(maxPrice.trim().replace(',', '.'))
      return min <= max
    })
  })

export const priceSchema = () =>
  object().shape({
    minPrice: minPriceWithConditions(),
    maxPrice: priceValidationSchema(),
    isLimitCreditSearch: boolean(),
    isOnlyFreeOffersSearch: boolean(),
  })
