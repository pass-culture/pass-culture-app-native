import { array, boolean, date, number, object, string } from 'yup'

import { DATE_FILTER_OPTIONS } from 'features/search/enums'

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
    .of(number())
    .length(2)
    .when('hasSelectedHours', {
      is: (hasSelectedHours: boolean) => hasSelectedHours,
      then: (schema) => schema.required('Les heures sont obligatoires'),
      otherwise: (schema) => schema.optional(),
    }),
})
