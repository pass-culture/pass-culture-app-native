import { ValidationError } from 'yup'

import { DATE_FILTER_OPTIONS } from 'features/search/enums'
import { datesHoursSchema } from 'features/search/helpers/schema/datesHoursSchema/datesHoursSchema'

describe('datesHoursSchema', () => {
  describe('should fail', () => {
    it('when hasSelectedChoice is true and selectedDateChoice defined without selectedDate', async () => {
      const values = {
        hasSelectedDate: true,
        selectedDateChoice: DATE_FILTER_OPTIONS.TODAY,
        selectedDate: undefined,
      }

      await expect(datesHoursSchema.validate(values)).rejects.toEqual(
        new ValidationError('La date est obligatoire')
      )
    })

    it('when hasSelectedChoice is true and selectedDate defined without selectedDateChoice', async () => {
      const values = {
        hasSelectedDate: true,
        selectedDateChoice: undefined,
        selectedDate: new Date(),
      }

      await expect(datesHoursSchema.validate(values)).rejects.toEqual(
        new ValidationError('Le type de date est obligatoire')
      )
    })

    it('when hasSelectedHours is true without selectedHours', async () => {
      const values = {
        hasSelectedHours: true,
        selectedHours: undefined,
      }

      await expect(datesHoursSchema.validate(values)).rejects.toEqual(
        new ValidationError('Les heures sont obligatoires')
      )
    })
  })

  describe('should validate', () => {
    it('without any value', async () => {
      const values = {}

      expect(await datesHoursSchema.validate(values)).toEqual(values)
    })

    it('when hasSelectedDate is true with selectedDateChoice and selectedDate', async () => {
      const values = {
        hasSelectedDate: true,
        selectedDateChoice: DATE_FILTER_OPTIONS.TODAY,
        selectedDate: new Date(),
      }

      expect(await datesHoursSchema.validate(values)).toEqual(values)
    })

    it('when hasSelectedHours is true with selectedHours', async () => {
      const values = {
        hasSelectedHours: true,
        selectedHours: [8, 22],
      }

      expect(await datesHoursSchema.validate(values)).toEqual(values)
    })

    it('when hasSelectedDate is true with selectedDateChoice and selectedDate and hasSelectedHours is true with selectedHours', async () => {
      const values = {
        hasSelectedDate: true,
        selectedDateChoice: DATE_FILTER_OPTIONS.TODAY,
        selectedDate: new Date(),
        hasSelectedHours: true,
        selectedHours: [8, 22],
      }

      expect(await datesHoursSchema.validate(values)).toEqual(values)
    })
  })
})
