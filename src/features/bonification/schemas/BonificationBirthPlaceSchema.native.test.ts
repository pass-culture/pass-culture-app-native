import { ValidationError } from 'yup'

import { BonificationBirthPlaceSchema } from './BonificationBirthPlaceSchema'

describe('BonificationBirthPlaceSchema', () => {
  const birthCity = {
    name: 'Paris',
    code: '75056',
    postalCode: '75017',
  }

  describe('valid schemas', () => {
    it.each([
      {
        birthCountrySelection: { LIBCOG: 'France', COG: 99100 },
        birthCity: birthCity,
      },
      { birthCountrySelection: { LIBCOG: 'États-Unis', COG: 99100 } },
      { birthCountrySelection: { LIBCOG: 'Royaume-Uni', COG: 99100 } },
      { birthCountrySelection: { LIBCOG: 'Espagne', COG: 99100 } },
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
        const input = { birthCountrySelection: { LIBCOG: country, COG: 99100 }, birthCity }
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

        await expect(validation).rejects.toEqual(new ValidationError('Le code postal est requis.'))
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
