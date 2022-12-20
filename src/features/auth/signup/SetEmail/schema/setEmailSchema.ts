import { bool, object } from 'yup'

import { emailSchema } from 'shared/forms/schemas/emailSchema'

export const setEmailSchema = object()
  .shape({
    email: emailSchema.required('L’email est obligatoire'),
    marketingEmailSubscription: bool().required(),
  })
  .required()
