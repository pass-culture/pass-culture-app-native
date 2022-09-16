import { string } from 'yup'

// integers separated by a dot or comma with 2 decimals max
const PRICE_REGEX = /^\d+(?:[,.]\d{0,2})?$/
const formatPriceError = `Format du prix incorrect. Exemple de format attendu\u00a0: 10,00`

export const priceSchema = string().trim().matches(PRICE_REGEX, formatPriceError)
