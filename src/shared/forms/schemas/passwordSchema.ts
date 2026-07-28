import { string } from 'yup'

import { PASSWORD_RULES } from 'ui/designSystem/PasswordInput/helpers'

export const passwordSchema = PASSWORD_RULES.reduce(
  (schema, rule) => schema.test(rule.key, rule.label, (value = '') => rule.test(value)),
  string()
)
