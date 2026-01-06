import { object } from 'yup'

import { baseNameSchema } from 'shared/forms/schemas/baseNameSchema'

export const setNameSchema = object().shape({
  firstName: baseNameSchema.required('Le prénom est obligatoire'),
  lastName: baseNameSchema.required('Le nom est obligatoire'),
})
