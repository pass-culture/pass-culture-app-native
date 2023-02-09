import { ValidationError } from 'yup'

import { PASSWORD_MIN_LENGTH } from 'features/auth/components/PasswordSecurityRules'
import { passwordSchema } from 'shared/forms/schemas/passwordSchema'

describe('passwordSchema', () => {
  describe('valid', () => {
    it('must follow all security rules', async () => {
      const value = 'user@AZERTY123'
      const result = await passwordSchema.validate(value)
      expect(result).toEqual(value)
    })
  })

  describe('invalid', () => {
    it('must have at least 1 special character', async () => {
      const value = 'userAZERTY123'
      const result = passwordSchema.validate(value)
      await expect(result).rejects.toEqual(new ValidationError('1 Caractère spécial (!@#$%^&*...)'))
    })

    it(`must have a minimum of ${PASSWORD_MIN_LENGTH} character length`, async () => {
      const value = 'abc'
      const result = passwordSchema.validate(value)
      await expect(result).rejects.toEqual(new ValidationError('12 Caractères'))
    })

    it('must have at least 1 uppercase character', async () => {
      const value = 'user@azerty123'
      const result = passwordSchema.validate(value)
      await expect(result).rejects.toEqual(new ValidationError('1 Majuscule'))
    })

    it('must have at least 1 number character', async () => {
      const value = 'user@AZERTYyyyy'
      const result = passwordSchema.validate(value)
      await expect(result).rejects.toEqual(new ValidationError('1 Chiffre'))
    })
  })
})
