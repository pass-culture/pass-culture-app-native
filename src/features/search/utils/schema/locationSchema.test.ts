import { ValidationError } from 'yup'

import { RadioButtonLocation } from 'features/search/pages/modals/LocationModal/LocationModal'

import { locationSchema } from './locationSchema'

describe('locationSchema', () => {
  describe('should fail', () => {
    it('without any value', async () => {
      const values = {}

      await expect(locationSchema.validate(values)).rejects.toEqual(
        new ValidationError('La méthode de localisation est obligatoire.')
      )
    })

    it('when locationChoice is RadioButtonLocation.AROUND_ME without radius', async () => {
      const values = {
        locationChoice: RadioButtonLocation.AROUND_ME,
        aroundRadius: undefined,
      }

      await expect(locationSchema.validate(values)).rejects.toEqual(
        new ValidationError('Le rayon est obligatoire')
      )
    })

    it('when locationChoice is RadioButtonLocation.CHOOSE_PLACE_OR_VENUE without selectedPlaceOrVenue', async () => {
      const values = {
        locationChoice: RadioButtonLocation.CHOOSE_PLACE_OR_VENUE,
        selectedPlaceOrVenue: undefined,
      }

      await expect(locationSchema.validate(values)).rejects.toEqual(
        new ValidationError('Vous devez sélectionner une adresse ou un lieu.')
      )
    })
  })

  describe('should validate', () => {
    it('when locationChoice is RadioButtonLocation.AROUND_ME with radius', async () => {
      const values = {
        locationChoice: RadioButtonLocation.AROUND_ME,
        aroundRadius: 50,
      }

      expect(await locationSchema.validate(values)).toEqual(values)
    })

    it('when locationChoice is RadioButtonLocation.CHOOSE_PLACE_OR_VENUE with a selectedPlaceOrVenue', async () => {
      const values = {
        locationChoice: RadioButtonLocation.CHOOSE_PLACE_OR_VENUE,
        selectedPlaceOrVenue: { geolocation: 'something' },
      }

      expect(await locationSchema.validate(values)).toEqual(values)
    })

    it('when locationChoice is RadioButtonLocation.EVERYWHERE', async () => {
      const values = {
        locationChoice: RadioButtonLocation.EVERYWHERE,
      }

      expect(await locationSchema.validate(values)).toEqual(values)
    })
  })
})
