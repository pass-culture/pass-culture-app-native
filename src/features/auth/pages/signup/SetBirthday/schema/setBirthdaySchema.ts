import { date, object } from 'yup'

export const setBirthdaySchema = object().shape({
  birthdate: date().required('La date de naissance est obligatoire'),
})
