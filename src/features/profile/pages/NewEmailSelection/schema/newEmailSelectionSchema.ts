import { object } from 'yup'

import { emailSchema } from 'shared/forms/schemas/emailSchema'

export const newEmailSelectionSchema = object()
  .shape({
    newEmail: emailSchema.required('Le nouvel email est obligatoire'),
  })
  .required()
