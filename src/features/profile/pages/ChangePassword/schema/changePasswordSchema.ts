import { object, ref, string } from 'yup'

import {
  CAPITAL_REGEX,
  LOWERCASE_REGEX,
  NUMBER_REGEX,
  PASSWORD_MIN_LENGTH,
  SPECIAL_CHARACTER_REGEX,
} from 'features/auth/components/PasswordSecurityRules'

export const changePasswordSchema = object().shape({
  currentPassword: string()
    .min(PASSWORD_MIN_LENGTH, '12 Caractères')
    .required()
    .matches(CAPITAL_REGEX, '1 Majuscule')
    .matches(LOWERCASE_REGEX, '1 Minuscule')
    .matches(NUMBER_REGEX, '1 Chiffre')
    .matches(SPECIAL_CHARACTER_REGEX, '1 Caractère spécial (!@#$%^&*...)'),
  newPassword: string()
    .min(PASSWORD_MIN_LENGTH, '12 Caractères')
    .required('required')
    .matches(CAPITAL_REGEX, '1 Majuscule')
    .matches(LOWERCASE_REGEX, '1 Minuscule')
    .matches(NUMBER_REGEX, '1 Chiffre')
    .matches(SPECIAL_CHARACTER_REGEX, '1 Caractère spécial (!@#$%^&*...)'),
  confirmedPassword: string()
    .oneOf([ref('newPassword'), null], 'Les mots de passe ne concordent pas')
    .required(),
})
