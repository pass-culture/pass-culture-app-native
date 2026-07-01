import { ValidationError } from 'yup'

import { priceSchema } from './priceSchema'

describe('priceSchema', () => {
  it('should validate correctly when minPrice and maxPrice are within range', async () => {
    const validData = {
      minPrice: '10,00',
      maxPrice: '50,00',
      isLimitCreditSearch: true,
      isOnlyFreeOffersSearch: false,
    }

    await expect(priceSchema().isValid(validData)).resolves.toBe(true)
  })

  it('should invalidate when minPrice is greater than maxPrice', async () => {
    const invalidData = {
      minPrice: '60,00',
      maxPrice: '50,00',
      isLimitCreditSearch: true,
      isOnlyFreeOffersSearch: false,
    }

    await expect(priceSchema().isValid(invalidData)).resolves.toBe(false)
  })

  it('should validate when maxPrice is empty and minPrice is within range', async () => {
    const validData = {
      minPrice: '10,00',
      maxPrice: '',
      isLimitCreditSearch: false,
      isOnlyFreeOffersSearch: false,
    }

    await expect(priceSchema().isValid(validData)).resolves.toBe(true)
  })

  it('should invalidate when minPrice has incorrect format', async () => {
    const invalidData = {
      minPrice: '10,000',
      maxPrice: '50,00',
      isLimitCreditSearch: true,
      isOnlyFreeOffersSearch: false,
    }

    await expect(priceSchema().isValid(invalidData)).resolves.toBe(false)
  })

  it('should invalidate when maxPrice has incorrect format', async () => {
    const invalidData = {
      minPrice: '10,00',
      maxPrice: '50.000',
      isLimitCreditSearch: false,
      isOnlyFreeOffersSearch: false,
    }

    await expect(priceSchema().isValid(invalidData)).resolves.toBe(false)
  })

  describe('should fail', () => {
    it('when minPrice is greater than maxPrice', async () => {
      const invalidData = {
        minPrice: '50,00',
        maxPrice: '40,00',
        isLimitCreditSearch: true,
        isOnlyFreeOffersSearch: false,
      }

      await expect(priceSchema().validate(invalidData)).rejects.toEqual(
        new ValidationError('Le montant minimum ne peut pas dépasser le montant maximum')
      )
    })

    it('when maxPrice has an invalid format', async () => {
      const invalidData = {
        minPrice: '10,00',
        maxPrice: '150.000',
        isLimitCreditSearch: false,
        isOnlyFreeOffersSearch: false,
      }

      await expect(priceSchema().validate(invalidData)).rejects.toEqual(
        new ValidationError('Format du prix incorrect. Exemple de format attendu\u00a0: 10,00')
      )
    })

    it('when minPrice has an invalid format', async () => {
      const invalidData = {
        minPrice: '10,000',
        maxPrice: '50,00',
        isLimitCreditSearch: false,
        isOnlyFreeOffersSearch: false,
      }

      await expect(priceSchema().validate(invalidData)).rejects.toEqual(
        new ValidationError('Format du prix incorrect. Exemple de format attendu\u00a0: 10,00')
      )
    })
  })

  describe('should validate', () => {
    it('when minPrice and maxPrice are within range', async () => {
      const validData = {
        minPrice: '10,00',
        maxPrice: '50,00',
        isLimitCreditSearch: false,
        isOnlyFreeOffersSearch: false,
      }

      await expect(priceSchema().validate(validData)).resolves.toEqual(validData)
    })

    it('when maxPrice is empty and minPrice is within range', async () => {
      const validData = {
        minPrice: '10,00',
        maxPrice: '',
        isLimitCreditSearch: false,
        isOnlyFreeOffersSearch: false,
      }

      await expect(priceSchema().validate(validData)).resolves.toEqual(validData)
    })

    it('when both minPrice and maxPrice are empty', async () => {
      const validData = {
        minPrice: '',
        maxPrice: '',
        isLimitCreditSearch: true,
        isOnlyFreeOffersSearch: false,
      }

      await expect(priceSchema().validate(validData)).resolves.toEqual(validData)
    })
  })
})
