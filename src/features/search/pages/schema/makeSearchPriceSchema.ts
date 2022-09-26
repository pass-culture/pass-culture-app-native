import { boolean, object } from 'yup'

import { makePriceSchema } from 'features/search/pages/schema/makePriceSchema'

export const minPriceError = `Le montant minimum ne peut pas dépasser le montant maximum`

export const makeSearchPriceSchema = (initialCredit: string) =>
  object().shape({
    minPrice: makePriceSchema(initialCredit.toString()).when(['maxPrice'], {
      is: (maxPrice: string) => maxPrice.length > 0,
      then: (schema) =>
        schema.test('validMinPrice', minPriceError, (value, schema) => {
          if (!value) return true
          return Number(value) <= Number(schema.parent.maxPrice)
        }),
    }),
    maxPrice: makePriceSchema(String(initialCredit)),
    isLimitCreditSearch: boolean(),
    isOnlyFreeOffersSearch: boolean(),
  })
