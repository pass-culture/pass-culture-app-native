import { boolean, object } from 'yup'

import { makePriceSchema } from 'features/search/helpers/schema/makePriceSchema/makePriceSchema'
import { Currency } from 'shared/currency/useGetCurrencyToDisplay'

export const minPriceError = `Le montant minimum ne peut pas dépasser le montant maximum`

export const makeSearchPriceSchema = (
  initialCredit: string,
  currency: Currency,
  euroToPacificFrancRate: number
) =>
  object().shape({
    minPrice: makePriceSchema(initialCredit.toString(), currency, euroToPacificFrancRate).when(
      ['maxPrice'],
      {
        is: (maxPrice: string) => maxPrice.length > 0,
        then: (schema) =>
          schema.test('validMinPrice', minPriceError, (value, schema) => {
            if (!value) return true
            return (
              Number(value.trim().replaceAll(',', '.')) <=
              Number(schema.parent.maxPrice.trim().replaceAll(',', '.'))
            )
          }),
      }
    ),
    maxPrice: makePriceSchema(String(initialCredit), currency, euroToPacificFrancRate),
    isLimitCreditSearch: boolean(),
    isOnlyFreeOffersSearch: boolean(),
  })
