import { ValidationError } from 'yup'

import { Currency } from 'shared/currency/useGetCurrencyToDisplay'

import { priceSchema } from './priceSchema'

describe('priceSchema', () => {
  const initialCredit = 100
  const currency = Currency.EURO

  it('should validate correctly when minPrice and maxPrice are within range', async () => {
    const validData = {
      minPrice: '10,00',
      maxPrice: '50,00',
      isLimitCreditSearch: true,
      isOnlyFreeOffersSearch: false,
    }

    await expect(priceSchema({ initialCredit, currency }).isValid(validData)).resolves.toBe(true)
  })

  it('should invalidate when maxPrice exceeds initialCredit', async () => {
    const invalidData = {
      minPrice: '10,00',
      maxPrice: '150,00',
      isLimitCreditSearch: false,
      isOnlyFreeOffersSearch: false,
    }

    await expect(priceSchema({ initialCredit, currency }).isValid(invalidData)).resolves.toBe(false)
  })

  it('should invalidate when minPrice is greater than maxPrice', async () => {
    const invalidData = {
      minPrice: '60,00',
      maxPrice: '50,00',
      isLimitCreditSearch: true,
      isOnlyFreeOffersSearch: false,
    }

    await expect(priceSchema({ initialCredit, currency }).isValid(invalidData)).resolves.toBe(false)
  })

  it('should validate when maxPrice is empty and minPrice is within range', async () => {
    const validData = {
      minPrice: '10,00',
      maxPrice: '',
      isLimitCreditSearch: false,
      isOnlyFreeOffersSearch: false,
    }

    await expect(priceSchema({ initialCredit, currency }).isValid(validData)).resolves.toBe(true)
  })

  it('should invalidate when minPrice has incorrect format', async () => {
    const invalidData = {
      minPrice: '10,000',
      maxPrice: '50,00',
      isLimitCreditSearch: true,
      isOnlyFreeOffersSearch: false,
    }

    await expect(priceSchema({ initialCredit, currency }).isValid(invalidData)).resolves.toBe(false)
  })

  it('should invalidate when maxPrice has incorrect format', async () => {
    const invalidData = {
      minPrice: '10,00',
      maxPrice: '50.000',
      isLimitCreditSearch: false,
      isOnlyFreeOffersSearch: false,
    }

    await expect(priceSchema({ initialCredit, currency }).isValid(invalidData)).resolves.toBe(false)
  })

  describe('should fail', () => {
    it('when maxPrice exceeds initialCredit', async () => {
      const invalidData = {
        minPrice: '10,00',
        maxPrice: '150,00',
        isLimitCreditSearch: false,
        isOnlyFreeOffersSearch: false,
      }

      await expect(priceSchema({ initialCredit, currency }).validate(invalidData)).rejects.toEqual(
        new ValidationError('Le prix indiqué ne doit pas dépasser 100\u00a0€')
      )
    })

    it('when maxPrice exceeds initialCredit with other currency', async () => {
      const invalidData = {
        minPrice: '10,00',
        maxPrice: '150,00',
        isLimitCreditSearch: false,
        isOnlyFreeOffersSearch: false,
      }

      await expect(
        priceSchema({ initialCredit, currency: Currency.PACIFIC_FRANC_SHORT }).validate(invalidData)
      ).rejects.toEqual(new ValidationError('Le prix indiqué ne doit pas dépasser 100\u00a0F'))
    })

    it('when minPrice is greater than maxPrice', async () => {
      const invalidData = {
        minPrice: '50,00',
        maxPrice: '40,00',
        isLimitCreditSearch: true,
        isOnlyFreeOffersSearch: false,
      }

      await expect(priceSchema({ initialCredit, currency }).validate(invalidData)).rejects.toEqual(
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

      await expect(priceSchema({ initialCredit, currency }).validate(invalidData)).rejects.toEqual(
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

      await expect(priceSchema({ initialCredit, currency }).validate(invalidData)).rejects.toEqual(
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

      await expect(priceSchema({ initialCredit, currency }).validate(validData)).resolves.toEqual(
        validData
      )
    })

    it('when maxPrice is empty and minPrice is within range', async () => {
      const validData = {
        minPrice: '10,00',
        maxPrice: '',
        isLimitCreditSearch: false,
        isOnlyFreeOffersSearch: false,
      }

      await expect(priceSchema({ initialCredit, currency }).validate(validData)).resolves.toEqual(
        validData
      )
    })

    it('when both minPrice and maxPrice are empty', async () => {
      const validData = {
        minPrice: '',
        maxPrice: '',
        isLimitCreditSearch: true,
        isOnlyFreeOffersSearch: false,
      }

      await expect(priceSchema({ initialCredit, currency }).validate(validData)).resolves.toEqual(
        validData
      )
    })
  })
})
