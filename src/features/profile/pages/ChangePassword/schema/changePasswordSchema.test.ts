import { ValidationError } from 'yup'

import { PASSWORD_MIN_LENGTH } from 'features/auth/components/PasswordSecurityRules'

import { changePasswordSchema } from './changePasswordSchema'

describe('changePasswordSchema', () => {
  describe('should validate', () => {
    it('validate a form with all required values', async () => {
      const values = {
        currentPassword: 'user@AZERTY123',
        newPassword: 'user@AZERTY123',
        confirmedPassword: 'user@AZERTY123',
      }
      const result = await changePasswordSchema.validate(values)
      expect(result).toEqual(values)
    })
  })

  describe('should invalidate', () => {
    it.each([
      ['userAZERTY123', 'user@AZERTY123', 'user@AZERTY123'],
      ['user@AZERTY123', 'userAZERTY123', 'userAZERTY123'],
    ])(
      'should fail due to missing special character { currentPassword: $currentPassword, newPassword: $newPassword, confirmedPassword: $confirmedPassword }',
      async (currentPassword, newPassword, confirmedPassword) => {
        const result = changePasswordSchema.validate({
          currentPassword,
          newPassword,
          confirmedPassword,
        })
        await expect(result).rejects.toEqual(
          new ValidationError('1 Caractère spécial (!@#$%^&*...)')
        )
      }
    )

    it('should fail due to non identical newPassword and confirmedPassword', async () => {
      const result = changePasswordSchema.validate({
        currentPassword: 'user@AZERTY123',
        newPassword: 'abc',
        confirmedPassword: 'def',
      })
      await expect(result).rejects.toEqual(
        new ValidationError('Les mots de passe ne concordent pas')
      )
    })

    it.each([
      [
        {
          currentPassword: 'abc',
          newPassword: 'user@AZERTY123',
          confirmedPassword: 'user@AZERTY123',
        },
        {
          currentPassword: 'user@AZERTY123',
          newPassword: 'abc',
          confirmedPassword: 'abc',
        },
      ],
    ])(`should fail due to not being ${PASSWORD_MIN_LENGTH} character length`, async (values) => {
      const result = changePasswordSchema.validate(values)
      await expect(result).rejects.toEqual(new ValidationError('12 Caractères'))
    })

    it.each([
      [
        {
          currentPassword: 'user@azerty123',
          newPassword: 'user@AZERTY123',
          confirmedPassword: 'user@AZERTY123',
        },
        {
          currentPassword: 'user@AZERTY123',
          newPassword: 'user@azerty123',
          confirmedPassword: 'user@azerty123',
        },
      ],
    ])('should fail due to not have 1 uppercase character', async (values) => {
      const result = changePasswordSchema.validate(values)
      await expect(result).rejects.toEqual(new ValidationError('1 Majuscule'))
    })

    it.each([
      [
        {
          currentPassword: 'user@AZERTYyyyy',
          newPassword: 'user@AZERTY123',
          confirmedPassword: 'user@AZERTY123',
        },
        {
          currentPassword: 'user@AZERTY123',
          newPassword: 'user@AZERTYyyy',
          confirmedPassword: 'user@AZERTYyyy',
        },
      ],
    ])('should fail due to not have 1 number character', async (values) => {
      const result = changePasswordSchema.validate(values)
      await expect(result).rejects.toEqual(new ValidationError('1 Chiffre'))
    })
  })
})
