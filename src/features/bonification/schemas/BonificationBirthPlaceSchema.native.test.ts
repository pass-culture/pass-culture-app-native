import { ValidationError } from 'yup'

import { SuggestedCity } from 'libs/place/types'

import { BonificationBirthPlaceSchema } from './BonificationBirthPlaceSchema'

describe('BonificationBirthPlaceSchema', () => {
  const birthCity: SuggestedCity = {
    name: 'Paris',
    code: '75056',
    postalCode: '75017',
    departementCode: '75',
  }

  describe('valid schemas', () => {
    it.each([
      {
        birthCountrySelection: { libcog: 'France', cog: 99100 },
        birthCity: birthCity,
      },
      { birthCountrySelection: { libcog: 'États-Unis', cog: 99100 } },
      { birthCountrySelection: { libcog: 'Royaume-Uni', cog: 99100 } },
      { birthCountrySelection: { libcog: 'Espagne', cog: 99100 } },
    ])('should accept a valid object: %p', async (data) => {
      const result = await BonificationBirthPlaceSchema.validate(data)

      expect(result).toEqual(data)
    })
  })

  describe('birthCountrySelection validation', () => {
    it('should reject if birthCountrySelection is missing', async () => {
      const validation = BonificationBirthPlaceSchema.validate(birthCity)

      await expect(validation).rejects.toEqual(
        new ValidationError('Le pays de naissance est obligatoire.')
      )
    })

    it.each(['France123', 'France!', 'Allemagne_'])(
      'should reject if birthCountrySelection contains invalid characters: %s',
      async (country) => {
        const input = { birthCountrySelection: { libcog: country, cog: 99100 }, birthCity }
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
        const input = { birthCountrySelection: { libcog: 'France', cog: 99100 } }
        const validation = BonificationBirthPlaceSchema.validate(input)

        await expect(validation).rejects.toEqual(
          new ValidationError('Le numéro de département est requis.')
        )
      })
    })

    describe('when country is not "France"', () => {
      it('should be valid if birthCity is missing', async () => {
        const input = { birthCountrySelection: { libcog: 'Espagne', cog: 99100 } }
        const result = await BonificationBirthPlaceSchema.validate(input)

        expect(result).toEqual(input)
      })
    })
  })
})
