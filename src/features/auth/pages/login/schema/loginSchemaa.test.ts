import { ValidationError } from 'yup'

import { loginSchema } from 'features/auth/pages/login/schema/loginSchemaa'

describe('loginSchema', () => {
  describe('should validate', () => {
    it('validate a form with all required values', async () => {
      const values = {
        email: 'bene_18@example.com',
        password: 'user@AZERTY123',
      }
      const result = await loginSchema.validate(values)
      expect(result).toEqual(values)
    })
  })

  describe('should invalidate', () => {
    it('should fail due to an invalid email', async () => {
      const result = loginSchema.validate({
        email: 'not an email',
        password: 'user@AZERTY123',
      })
      await expect(result).rejects.toEqual(
        new ValidationError(
          'L’e-mail renseigné est incorrect. Exemple de format attendu : edith.piaf@email.fr'
        )
      )
    })

    it('should fail due to an empty email', async () => {
      const result = loginSchema.validate({
        email: '',
        password: 'user@AZERTY123',
      })
      await expect(result).rejects.toEqual(
        new ValidationError(
          'L’e-mail renseigné est incorrect. Exemple de format attendu : edith.piaf@email.fr'
        )
      )
    })

    it('should fail due to an empty password', async () => {
      const result = loginSchema.validate({
        email: 'bene_18@example.com',
        password: '',
      })
      await expect(result).rejects.toEqual(new ValidationError('Mot de passe obligatoire'))
    })
  })
})
