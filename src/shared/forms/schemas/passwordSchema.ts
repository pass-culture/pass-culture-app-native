import { string } from 'yup'

import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  CAPITAL,
  LOWERCASE,
  NUMBER,
  SPECIAL,
} from 'ui/designSystem/PasswordInput/helpers'

export const passwordSchema = string()
  .min(PASSWORD_MIN_LENGTH, '12 Caractères')
  .max(PASSWORD_MAX_LENGTH, '72 Caractères')
  .matches(CAPITAL, '1 Majuscule')
  .matches(LOWERCASE, '1 Minuscule')
  .matches(NUMBER, '1 Chiffre')
  .matches(SPECIAL, '1 Caractère spécial (!@#$%^&*...)')
