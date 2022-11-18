import { ValidationError } from 'yup'

import { MAX_PRICE } from 'features/search/utils/reducer.helpers'
import { makePriceSchema } from 'features/search/utils/schema/makePriceSchema'

describe('price schema', () => {
  describe('should match', () => {
    it('a valid integer price', async () => {
      const result = await makePriceSchema(MAX_PRICE.toString()).validate('123')
      expect(result).toEqual('123')
    })

    it('a valid price with a dot', async () => {
      const result = await makePriceSchema(MAX_PRICE.toString()).validate('123.45')
      expect(result).toEqual('123.45')
    })

    it('a valid price with a comma', async () => {
      const result = await makePriceSchema(MAX_PRICE.toString()).validate('123,45')
      expect(result).toEqual('123,45')
    })

    it('a valid price with only one decimal', async () => {
      const result = await makePriceSchema(MAX_PRICE.toString()).validate('123,4')
      expect(result).toEqual('123,4')
    })

    it('a valid price between spaces', async () => {
      const result = await makePriceSchema(MAX_PRICE.toString()).validate('   123,4  ')
      expect(result).toEqual('123,4')
    })

    it('a valid price with a dot but no decimal', async () => {
      const result = await makePriceSchema(MAX_PRICE.toString()).validate('123.')
      expect(result).toEqual('123.')
    })

    it('when input less than the initial credit', async () => {
      const result = await makePriceSchema(MAX_PRICE.toString()).validate('200')
      expect(result).toEqual('200')
    })

    it('when input equal to the initial credit', async () => {
      const result = await makePriceSchema(MAX_PRICE.toString()).validate(MAX_PRICE.toString())
      expect(result).toEqual(MAX_PRICE.toString())
    })

    it('when input is undefined', async () => {
      const result = await makePriceSchema(MAX_PRICE.toString()).validate(undefined)
      expect(result).toEqual(undefined)
    })
  })

  describe('should invalidate an input', () => {
    const formatErrorMessage = `Format du prix incorrect. Exemple de format attendu\u00a0: 10,00`
    const maxPriceErrorMessage = `Le prix indiqué ne doit pas dépasser ${MAX_PRICE}\u00a0€`

    it('that is not a number', async () => {
      const result = makePriceSchema(MAX_PRICE.toString()).validate('azerty')

      await expect(result).rejects.toEqual(new ValidationError(formatErrorMessage))
    })

    it('that is a number with more than 2 decimals', async () => {
      const result = makePriceSchema(MAX_PRICE.toString()).validate('123.456')

      await expect(result).rejects.toEqual(new ValidationError(formatErrorMessage))
    })

    it('that is a number with more than 2 comma or dot', async () => {
      const result = makePriceSchema(MAX_PRICE.toString()).validate('1,23.45')

      await expect(result).rejects.toEqual(new ValidationError(formatErrorMessage))
    })

    it('that is a number with negative number', async () => {
      const result = makePriceSchema(MAX_PRICE.toString()).validate('-123.45')

      await expect(result).rejects.toEqual(new ValidationError(formatErrorMessage))
    })

    it('with euro symbol', async () => {
      const result = makePriceSchema(MAX_PRICE.toString()).validate('123.45€')

      await expect(result).rejects.toEqual(new ValidationError(formatErrorMessage))
    })

    it('when input higher than the initial credit', async () => {
      const result = makePriceSchema(MAX_PRICE.toString()).validate('400')

      await expect(result).rejects.toEqual(new ValidationError(maxPriceErrorMessage))
    })
  })
})
