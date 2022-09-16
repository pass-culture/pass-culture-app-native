import { ValidationError } from 'yup'

import { MAX_PRICE } from 'features/search/pages/reducer.helpers'
import { minPriceError, searchPriceSchema } from 'features/search/pages/schema/searchPriceSchema'

describe('search price schema', () => {
  const initialValues = {
    minPrice: '',
    maxPrice: '20',
    isLimitCreditSearch: false,
    isOnlyFreeOffersSearch: false,
  }

  describe('should match minimum price', () => {
    it('when input less than maximum price input', async () => {
      const values = { ...initialValues, minPrice: '10' }
      const result = await searchPriceSchema(MAX_PRICE.toString()).validate(values)
      expect(result).toEqual(values)
    })

    it('when input equal than maximum price input', async () => {
      const values = { ...initialValues, minPrice: '20' }
      const result = await searchPriceSchema(MAX_PRICE.toString()).validate(values)
      expect(result).toEqual(values)
    })
  })

  it('should invalidate minimum price when input higher than maximum price', async () => {
    const values = { ...initialValues, minPrice: '21' }
    const result = searchPriceSchema(MAX_PRICE.toString()).validate(values)

    await expect(result).rejects.toEqual(new ValidationError(minPriceError))
  })
})
