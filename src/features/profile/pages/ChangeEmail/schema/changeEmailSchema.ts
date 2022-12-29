import { string, object } from 'yup'

import { emailSchema } from 'shared/forms/schemas/emailSchema'

export const changeEmailSchema = (oldEmail?: string) =>
  object()
    .shape({
      newEmail: emailSchema
        .required('L’email est obligatoire')
        .notOneOf(
          [oldEmail?.toLocaleLowerCase()],
          'L’e-mail saisi est identique à ton e-mail actuel'
        ),
      password: string().required('Le mot de passe est obligatoire').min(12, ''),
    })
    .required()
