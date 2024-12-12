import { boolean, object } from 'yup'

import { makePriceSchema } from 'features/search/helpers/schema/makePriceSchema/makePriceSchema'
import { Currency } from 'shared/currency/useGetCurrencyToDisplay'

export const minPriceError = `Le montant minimum ne peut pas dépasser le montant maximum`

export const makeSearchPriceSchema = (initialCredit: number, currency: Currency) =>
  object().shape({
    minPrice: makePriceSchema(initialCredit, currency).when(['maxPrice'], {
      is: (maxPrice: string) => maxPrice.length > 0,
      then: (schema) =>
        schema.test('validMinPrice', minPriceError, (value, schema) => {
          if (!value) return true
          return value.trim() <= schema.parent.maxPrice.trim()
        }),
    }),
    maxPrice: makePriceSchema(initialCredit, currency),
    isLimitCreditSearch: boolean(),
    isOnlyFreeOffersSearch: boolean(),
  })
