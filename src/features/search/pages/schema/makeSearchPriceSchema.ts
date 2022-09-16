import { boolean, object } from 'yup'

import { makePriceSchema } from 'features/search/pages/schema/makePriceSchema'

export const minPriceError = `Le montant minimum ne peux pas dépasser le montant maximum`

export const makeSearchPriceSchema = (initialCredit: string) =>
  object().shape({
    minPrice: makePriceSchema(initialCredit.toString()).when(['maxPrice'], {
      is: (maxPrice: string) => maxPrice !== undefined,
      then: (schema) =>
        schema.test('validMinPrice', minPriceError, (value, schema) => {
          if (!value) return true
          return +value <= +schema.parent.maxPrice
        }),
    }),
    maxPrice: makePriceSchema(initialCredit.toString()),
    isLimitCreditSearch: boolean(),
    isOnlyFreeOffersSearch: boolean(),
  })
