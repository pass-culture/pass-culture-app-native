import { ValidationError } from 'yup'

import { DATE_FILTER_OPTIONS } from 'features/search/enums'
import {
  datesHoursSchema,
  hourSchema,
  hoursSchema,
} from 'features/search/helpers/schema/datesHoursSchema/datesHoursSchema'

describe('hourSchema', () => {
  it.each([25, -1, '8', null, undefined, false])(
    'hourSchema should fail when value (%s) is not a valid hour',
    (value) => {
      expect(() => hourSchema.validateSync(value)).toThrow(
        new ValidationError('Horaire incorrecte')
      )
    }
  )

  it.each([0, 1, 12, 23, 24])(
    'hourSchema should validate when value ($value) is a valid hour',
    (value) => {
      expect(hourSchema.validateSync(value)).toEqual(value)
    }
  )
})

describe('hoursSchema', () => {
  it.each([
    [undefined, null],
    ['8', '12'],
    [2, false],
  ])(
    'hoursSchema should fail when value (%s) is not an array of two valid hours',
    (value1, value2) => {
      const value = [value1, value2]

      expect(() => hoursSchema.validateSync(value)).toThrow(
        new ValidationError('Horaires incorrectes')
      )
    }
  )

  it('hoursSchema should fail when we have 1 value', () => {
    const value = [1]

    expect(() => hoursSchema.validateSync(value)).toThrow(
      new ValidationError('Horaires incorrectes')
    )
  })

  it('hoursSchema should fail when we have 3 value', () => {
    const value = [1, 2, 3]

    expect(() => hoursSchema.validateSync(value)).toThrow(
      new ValidationError('Horaires incorrectes')
    )
  })

  it.each([
    [0, 1],
    [12, 15],
    [23, 22],
    [0, 24], //this is not an error we really want a time slot between 0h to 24h
  ])(
    'hoursSchema should validate when value ($value) is an array of two valid hours',
    (value1, value2) => {
      const value = [value1, value2]

      expect(hoursSchema.validateSync(value)).toEqual(value)
    }
  )
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
