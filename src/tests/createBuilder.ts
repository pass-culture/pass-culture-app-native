import { NumberRange } from 'types'

export const createDateBuilder = (defaultDate = '2024-01-01T00:00:00Z') => {
  const builder = () => {
    const date = new Date(defaultDate)

    const builderObject = {
      withDay: (day: NumberRange<0, 31>) => {
        date.setDate(day)
        return builderObject
      },
      withMonth: (month: NumberRange<0, 12>) => {
        date.setMonth(month)
        return builderObject
      },
      withYear: (year: number) => {
        date.setFullYear(year)
        return builderObject
      },
      withHours: (...args: Parameters<typeof date.setHours>) => {
        date.setHours(...args)
        return builderObject
      },
      toString: () => date.toISOString(),
      toDate: () => date,
    }

    return builderObject
  }

  return builder
}
