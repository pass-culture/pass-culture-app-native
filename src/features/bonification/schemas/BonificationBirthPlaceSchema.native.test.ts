import { ValidationError } from 'yup'

import { BonificationBirthPlaceSchema } from './BonificationBirthPlaceSchema'

describe('BonificationBirthPlaceSchema', () => {
  describe('valid schemas', () => {
    it.each([
      { birthCountrySelection: { LIBCOG: 'France', COG: 99100 }, birthCity: 'Paris' },
      { birthCountrySelection: { LIBCOG: 'États-Unis', COG: 99100 }, birthCity: 'New York' },
      { birthCountrySelection: { LIBCOG: 'Royaume-Uni', COG: 99100 } },
      { birthCountrySelection: { LIBCOG: 'Espagne', COG: 99100 }, birthCity: 'Madrid' },
    ])('should accept a valid object: %p', async (data) => {
      const result = await BonificationBirthPlaceSchema.validate(data)

      expect(result).toEqual(data)
    })
  })

  describe('birthCountrySelection validation', () => {
    it('should reject if birthCountrySelection is missing', async () => {
      const input = { birthCity: 'Paris' }
      const validation = BonificationBirthPlaceSchema.validate(input)

      await expect(validation).rejects.toEqual(
        new ValidationError('Le pays de naissance est obligatoire.')
      )
    })

    it.each(['France123', 'France!', 'Allemagne_'])(
      'should reject if birthCountrySelection contains invalid characters: %s',
      async (country) => {
        const input = { birthCountrySelection: { LIBCOG: country, COG: 99100 }, birthCity: 'Paris' }
        const validation = BonificationBirthPlaceSchema.validate(input)

        await expect(validation).rejects.toEqual(
          new ValidationError('Le pays ne doit pas contenir de chiffres ou de caractères spéciaux.')
        )
      }
    )
  })

  describe('birthCity validation', () => {
    describe('when country is "France"', () => {
      it('should reject if birthCity is missing', async () => {
        const input = { birthCountrySelection: { LIBCOG: 'France', COG: 99100 } }
        const validation = BonificationBirthPlaceSchema.validate(input)

        await expect(validation).rejects.toEqual(
          new ValidationError(
            'La ville de naissance est obligatoire pour les personnes nées en France.'
          )
        )
      })
    })

    describe('when country is not "France"', () => {
      it('should be valid if birthCity is missing', async () => {
        const input = { birthCountrySelection: { LIBCOG: 'Espagne', COG: 99100 } }
        const result = await BonificationBirthPlaceSchema.validate(input)

        expect(result).toEqual(input)
      })
    })
  })
})
