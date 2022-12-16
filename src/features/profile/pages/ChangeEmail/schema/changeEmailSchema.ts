import { string, object } from 'yup'

import { emailSchema } from 'features/auth/signup/SetEmail/schema/emailSchema'

export const changeEmailSchema = object()
  .shape({
    newEmail: emailSchema.required('L’email est obligatoire'),
    password: string().required('Le mot de passe est obligatoire').min(12, ''),
  })
  .required()
