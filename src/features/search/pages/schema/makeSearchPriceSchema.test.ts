import { ValidationError } from 'yup'

import { MAX_PRICE } from 'features/search/pages/reducer.helpers'
import {
  minPriceError,
  makeSearchPriceSchema,
} from 'features/search/pages/schema/makeSearchPriceSchema'

describe('search price schema', () => {
  const initialValues = {
    isLimitCreditSearch: false,
    isOnlyFreeOffersSearch: false,
  }

  describe('should match minimum price', () => {
    it('when input less than maximum price input', async () => {
      const values = { ...initialValues, maxPrice: '20', minPrice: '10' }
      const result = await makeSearchPriceSchema(MAX_PRICE.toString()).validate(values)
      expect(result).toEqual(values)
    })

    it('when input equal than maximum price input', async () => {
      const values = { ...initialValues, maxPrice: '20', minPrice: '20' }
      const result = await makeSearchPriceSchema(MAX_PRICE.toString()).validate(values)
      expect(result).toEqual(values)
    })

    it('when input less than decimal maximum price input', async () => {
      const values = { ...initialValues, maxPrice: '20,15', minPrice: '10' }
      const result = await makeSearchPriceSchema(MAX_PRICE.toString()).validate(values)
      expect(result).toEqual(values)
    })

    it('when input equal than decimal maximum price input', async () => {
      const values = { ...initialValues, maxPrice: '20,15', minPrice: '20,15' }
      const result = await makeSearchPriceSchema(MAX_PRICE.toString()).validate(values)
      expect(result).toEqual(values)
    })
  })

  it('should match decimal minimum price when input less than maximum price input', async () => {
    const values = { ...initialValues, maxPrice: '20', minPrice: '10,50' }
    const result = await makeSearchPriceSchema(MAX_PRICE.toString()).validate(values)
    expect(result).toEqual(values)
  })

  it('should invalidate minimum price when input higher than maximum price', async () => {
    const values = { ...initialValues, maxPrice: '20', minPrice: '21' }
    const result = makeSearchPriceSchema(MAX_PRICE.toString()).validate(values)

    await expect(result).rejects.toEqual(new ValidationError(minPriceError))
  })

  it('should invalidate minimum price when input higher than decimal maximum price', async () => {
    const values = { ...initialValues, maxPrice: '20,15', minPrice: '21' }
    const result = makeSearchPriceSchema(MAX_PRICE.toString()).validate(values)

    await expect(result).rejects.toEqual(new ValidationError(minPriceError))
  })

  it('should invalidate decimal minimum price when input higher than maximum price', async () => {
    const values = { ...initialValues, maxPrice: '20', minPrice: '21,15' }
    const result = makeSearchPriceSchema(MAX_PRICE.toString()).validate(values)

    await expect(result).rejects.toEqual(new ValidationError(minPriceError))
  })
})
