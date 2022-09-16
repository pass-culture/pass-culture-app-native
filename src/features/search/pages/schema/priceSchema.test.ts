import { ValidationError } from 'yup'

import { priceSchema } from 'features/search/pages/schema/priceSchema'

describe('price schema', () => {
  describe('should match', () => {
    it('a valid integer price', async () => {
      const result = await priceSchema.validate('123')
      expect(result).toEqual('123')
    })

    it('a valid price with a dot', async () => {
      const result = await priceSchema.validate('123.45')
      expect(result).toEqual('123.45')
    })

    it('a valid price with a comma', async () => {
      const result = await priceSchema.validate('123,45')
      expect(result).toEqual('123,45')
    })

    it('a valid price with only one decimal', async () => {
      const result = await priceSchema.validate('123,4')
      expect(result).toEqual('123,4')
    })

    it('a valid price between spaces', async () => {
      const result = await priceSchema.validate('   123,4  ')
      expect(result).toEqual('123,4')
    })

    it('a valid price with a dot but no decimal', async () => {
      const result = await priceSchema.validate('123.')
      expect(result).toEqual('123.')
    })
  })

  describe('should invalidate an input', () => {
    const validationErrorMessage = `Format du prix incorrect. Exemple de format attendu\u00a0: 10,00`

    it('that is not a number', async () => {
      const result = priceSchema.validate('azerty')

      await expect(result).rejects.toEqual(new ValidationError(validationErrorMessage))
    })

    it('that is a number with more than 2 decimals', async () => {
      const result = priceSchema.validate('123.456')

      await expect(result).rejects.toEqual(new ValidationError(validationErrorMessage))
    })

    it('that is a number with more than 2 comma or dot', async () => {
      const result = priceSchema.validate('1,23.45')

      await expect(result).rejects.toEqual(new ValidationError(validationErrorMessage))
    })

    it('that is a number with negative number', async () => {
      const result = priceSchema.validate('-123.45')

      await expect(result).rejects.toEqual(new ValidationError(validationErrorMessage))
    })

    it('with euro symbol', async () => {
      const result = priceSchema.validate('123.45€')

      await expect(result).rejects.toEqual(new ValidationError(validationErrorMessage))
    })
  })
})
