import { startOfDay } from 'date-fns'
import { date, object } from 'yup'

export const calendarSchema = object().shape({
  selectedStartDate: date()
    .optional()
    .min(startOfDay(new Date()), 'La date de début ne peut pas être dans le passé'),
  selectedEndDate: date()
    .optional()
    .when('selectedStartDate', (selectedStartDate, schema) =>
      selectedStartDate
        ? schema.min(selectedStartDate, 'La date de fin ne peut pas être avant la date de début')
        : schema
    ),
})
