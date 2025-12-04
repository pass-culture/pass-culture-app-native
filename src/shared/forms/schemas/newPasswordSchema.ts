import { object, ref, string } from 'yup'

import { passwordSchema } from 'shared/forms/schemas/passwordSchema'

export const newPasswordSchema = object().shape({
  newPassword: passwordSchema,
  confirmedPassword: string()
    .oneOf([ref('newPassword'), null], 'Les mots de passe ne concordent pas')
    .required('La confirmation de mot de passe est obligatoire'),
})
