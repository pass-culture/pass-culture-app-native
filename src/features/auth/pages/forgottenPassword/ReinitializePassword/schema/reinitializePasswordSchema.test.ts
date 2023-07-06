import { ValidationError } from 'yup'

import { reinitializePasswordSchema } from './reinitializePasswordSchema'

describe('reinitializePasswordSchema', () => {
  describe('should validate', () => {
    it('validate a form with all required values', async () => {
      const values = {
        newPassword: 'user@AZERTY123',
        confirmedPassword: 'user@AZERTY123',
      }
      const result = await reinitializePasswordSchema.validate(values)
      expect(result).toEqual(values)
    })
  })

  describe('should invalidate', () => {
    it('should fail due to invalid new password', async () => {
      const result = reinitializePasswordSchema.validate({
        newPassword: 'userAZERTY123',
        confirmedPassword: 'userAZERTY123',
      })
      await expect(result).rejects.toEqual(new ValidationError('1 Caractère spécial (!@#$%^&*...)'))
    })

    it('should fail due to non identical newPassword and confirmedPassword', async () => {
      const result = reinitializePasswordSchema.validate({
        newPassword: 'user@AZERTY123',
        confirmedPassword: 'user@AZERTY12',
      })
      await expect(result).rejects.toEqual(
        new ValidationError('Les mots de passe ne concordent pas')
      )
    })
  })
})
