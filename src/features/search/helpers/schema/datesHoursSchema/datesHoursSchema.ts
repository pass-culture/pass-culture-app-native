import { array, boolean, date, mixed, object, string } from 'yup'

import { DATE_FILTER_OPTIONS } from 'features/search/enums'

const HOURS = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
] as const
type Hours = typeof HOURS
export type Hour = Hours[number]

export const hourSchema = mixed<Hour>().test({
  name: 'is-valid-hour',
  test: (value: unknown): value is Hour => HOURS.includes(value as Hour),
  message: 'Horaire incorrecte',
})

export const hoursSchema = mixed<[Hour, Hour]>().test({
  name: 'is-valid-hours',
  test: (value: unknown): value is [Hour, Hour] =>
    Array.isArray(value) &&
    value.length === 2 &&
    hourSchema.isValidSync(value[0]) &&
    hourSchema.isValidSync(value[1]),
  message: 'Horaires incorrectes',
})

export const datesHoursSchema = object().shape({
  hasSelectedDate: boolean(),
  selectedDateChoice: string()
    .oneOf(Object.values(DATE_FILTER_OPTIONS))
    .when('hasSelectedDate', {
      is: (hasSelectedDate: boolean) => hasSelectedDate,
      then: (schema) => schema.required('Le type de date est obligatoire'),
      otherwise: (schema) => schema.optional(),
    }),
  selectedDate: date().when('hasSelectedDate', {
    is: (hasSelectedDate: boolean) => hasSelectedDate,
    then: (schema) => schema.required('La date est obligatoire'),
    otherwise: (schema) => schema.optional(),
  }),
  hasSelectedHours: boolean(),
  selectedHours: array()
    .of(hourSchema)
    .length(2)
    .when('hasSelectedHours', {
      is: (hasSelectedHours: boolean) => hasSelectedHours,
      then: (schema) => schema.required('Les heures sont obligatoires'),
      otherwise: (schema) => schema.optional(),
    }),
})
