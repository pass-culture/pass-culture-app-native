import { ValidationError } from 'yup'

import { changeEmailSchema } from './changeEmailSchema'

describe('changeEmailSchema', () => {
  it('should reject when no email', async () => {
    const result = changeEmailSchema.validate({
      newEmail: undefined,
      password: 'password>=12',
    })

    await expect(result).rejects.toEqual(new ValidationError('L’email est obligatoire'))
  })

  it('should reject when no password', async () => {
    const result = changeEmailSchema.validate({
      newEmail: 'passculture@mail.co',
      password: undefined,
    })

    await expect(result).rejects.toEqual(new ValidationError('Le mot de passe est obligatoire'))
  })

  it('should reject when password is too short', async () => {
    const result = changeEmailSchema.validate({
      newEmail: 'passculture@mail.co',
      password: 'password<12',
    })

    await expect(result).rejects.toEqual(new ValidationError(''))
  })
})
