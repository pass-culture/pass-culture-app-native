import { object, string } from 'yup'

import { emailSchema } from 'shared/forms/schemas/emailSchema'

export const loginSchema = object().shape({
  email: emailSchema,
  password: string().required('Mot de passe obligatoire'),
})
