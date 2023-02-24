import { string } from 'yup'

import {
  CAPITAL_REGEX,
  LOWERCASE_REGEX,
  NUMBER_REGEX,
  PASSWORD_MIN_LENGTH,
  SPECIAL_CHARACTER_REGEX,
} from 'features/auth/components/PasswordSecurityRules'

export const passwordSchema = string()
  .min(PASSWORD_MIN_LENGTH, '12 Caractères')
  .matches(CAPITAL_REGEX, '1 Majuscule')
  .matches(LOWERCASE_REGEX, '1 Minuscule')
  .matches(NUMBER_REGEX, '1 Chiffre')
  .matches(SPECIAL_CHARACTER_REGEX, '1 Caractère spécial (!@#$%^&*...)')
