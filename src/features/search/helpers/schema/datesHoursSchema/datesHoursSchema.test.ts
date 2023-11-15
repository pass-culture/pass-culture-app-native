import { ValidationError } from 'yup'

import { DATE_FILTER_OPTIONS } from 'features/search/enums'
import {
  datesHoursSchema,
  hourSchema,
  hoursSchema,
} from 'features/search/helpers/schema/datesHoursSchema/datesHoursSchema'

describe('hourSchema', () => {
  describe('should fail', () => {
    it('when value is not a valid hour', async () => {
      const invalidHours = [25, -1, '8', null, undefined, false]
      for (const value of invalidHours) {
        await expect(hourSchema.validate(value)).rejects.toEqual(
          new ValidationError('Horaire incorrecte')
        )
      }
    })
  })

  describe('should validate', () => {
    it('when value is a valid hour', async () => {
      const validHours = [0, 1, 12, 23]
      for (const value of validHours) {
        expect(await hourSchema.validate(value)).toEqual(value)
      }
    })

    it('when there is only one value and this is a valid hour', async () => {
      const validHours = 12

      expect(await hourSchema.validate(validHours)).toEqual(validHours)
    })
  })
})

describe('hoursSchema', () => {
  describe('should fail', () => {
    it('when value is not an array of two valid hours', async () => {
      const invalidValues = [
        [undefined, null],
        ['8', '12'],
      ]
      for (const value of invalidValues) {
        await expect(hoursSchema.validate(value)).rejects.toEqual(
          new ValidationError('Horaires incorrectes')
        )
      }
    })
  })

  describe('should validate', () => {
    it('when value is an array of two valid hours', async () => {
      const validValues = [
        [0, 1],
        [12, 15],
        [23, 22],
      ]
      for (const value of validValues) {
        expect(await hoursSchema.validate(value)).toEqual(value)
      }
    })

    it('when we have only un array of two valid hours', async () => {
      const validValues = [0, 1]

      expect(await hoursSchema.validate(validValues)).toEqual(validValues)
    })
  })
})

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
