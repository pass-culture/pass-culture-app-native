import { boolean, object } from 'yup'

import { priceSchema } from 'features/search/pages/schema/priceSchema'

export const minPriceError = `Le montant minimum ne peux pas dépasser le montant maximum`

export const searchPriceSchema = (initialCredit: string) =>
  object().shape({
    minPrice: priceSchema(initialCredit.toString()).when(['maxPrice'], {
      is: (maxPrice: string) => maxPrice !== undefined,
      then: (schema) =>
        schema.test('validMinPrice', minPriceError, (value, schema) => {
          if (!value) return true
          return +value <= +schema.parent.maxPrice
        }),
    }),
    maxPrice: priceSchema(initialCredit.toString()),
    isLimitCreditSearch: boolean(),
    isOnlyFreeOffersSearch: boolean(),
  })
