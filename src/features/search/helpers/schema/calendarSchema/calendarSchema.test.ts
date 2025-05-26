import { startOfDay } from 'date-fns'

import { calendarSchema } from 'features/search/helpers/schema/calendarSchema/calendarSchema'

describe('calendarSchema', () => {
  const now = new Date()

  it('should pass when selectedStartDate is today and selectedEndDate is after start', async () => {
    const validData = {
      selectedStartDate: new Date(now),
      selectedEndDate: new Date(now.getTime() + 24 * 60 * 60 * 1000),
    }

    await expect(calendarSchema.validate(validData)).resolves.toEqual(validData)
  })

  it('should pass when selectedStartDate is in the future and selectedEndDate is after start', async () => {
    const validData = {
      selectedStartDate: new Date(now.getTime() + 24 * 60 * 60 * 1000),
      selectedEndDate: new Date(now.getTime() + 48 * 60 * 60 * 1000),
    }

    await expect(calendarSchema.validate(validData)).resolves.toEqual(validData)
  })

  it('should fail when selectedStartDate is in the past', async () => {
    const pastDate = new Date(now.getTime() - 24 * 60 * 60 * 1000)

    const invalidData = {
      selectedStartDate: pastDate,
      selectedEndDate: new Date(now),
    }

    await expect(calendarSchema.validate(invalidData)).rejects.toThrow(
      'La date de début ne peut pas être dans le passé'
    )
  })

  it('should pass when only selectedStartDate is provided and it is today', async () => {
    const validData = {
      selectedStartDate: new Date(now),
    }

    await expect(calendarSchema.validate(validData)).resolves.toEqual({
      ...validData,
      selectedEndDate: undefined,
    })
  })

  it('should pass when only selectedStartDate is provided and it is today at midnight', async () => {
    const validData = {
      selectedStartDate: startOfDay(new Date()),
    }

    await expect(calendarSchema.validate(validData)).resolves.toEqual({
      ...validData,
      selectedEndDate: undefined,
    })
  })

  it('should pass when only selectedStartDate is provided and it is future', async () => {
    const validData = {
      selectedStartDate: new Date(now.getTime() + 24 * 60 * 60 * 1000),
    }

    await expect(calendarSchema.validate(validData)).resolves.toEqual({
      ...validData,
      selectedEndDate: undefined,
    })
  })

  it('should fail when selectedEndDate is before selectedStartDate', async () => {
    const today = new Date(now)
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)

    const invalidData = {
      selectedStartDate: tomorrow,
      selectedEndDate: today,
    }

    await expect(calendarSchema.validate(invalidData)).rejects.toThrow(
      'La date de fin ne peut pas être avant la date de début'
    )
  })
})
