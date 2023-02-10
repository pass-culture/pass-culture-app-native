import { object } from 'yup'

import { passwordSchema } from 'shared/forms/schemas/passwordSchema'

export const setPasswordSchema = object().shape({
  password: passwordSchema,
})
