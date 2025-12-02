import { string } from 'yup'

const EMAIL_REGEX = /^[a-zA-Z0-9_.-]+(\+\w+)?@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,63}$/
export const emailSchema = string()
  .trim()
  .lowercase()
  .matches(
    EMAIL_REGEX,
    'L’e-mail renseigné est incorrect. Exemple de format attendu\u00a0: edith.piaf@email.fr'
  )
