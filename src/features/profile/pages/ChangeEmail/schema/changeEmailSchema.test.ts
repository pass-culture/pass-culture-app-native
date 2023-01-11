import { ValidationError } from 'yup'

import { changeEmailSchema } from './changeEmailSchema'

describe('changeEmailSchema', () => {
  it('should reject when no email', async () => {
    const result = changeEmailSchema(undefined).validate({
      newEmail: undefined,
      password: 'password>=12',
    })

    await expect(result).rejects.toEqual(new ValidationError('L’email est obligatoire'))
  })

  it('should reject when no password', async () => {
    const result = changeEmailSchema(undefined).validate({
      newEmail: 'passculture@mail.co',
      password: undefined,
    })

    await expect(result).rejects.toEqual(new ValidationError('Le mot de passe est obligatoire'))
  })

  it('should reject when password is too short', async () => {
    const result = changeEmailSchema(undefined).validate({
      newEmail: 'passculture@mail.co',
      password: 'password<12',
    })

    await expect(result).rejects.toEqual(new ValidationError(''))
  })

  it('should reject when new email is the same as old one ignoring the case', async () => {
    const result = changeEmailSchema('PASSculture@mail.co').validate({
      newEmail: 'passCULTURE@mail.co',
      password: 'password>=12',
    })

    await expect(result).rejects.toEqual(
      new ValidationError('L’e-mail saisi est identique à ton e-mail actuel')
    )
  })

  it('should accept when email and password are valid', async () => {
    const input = {
      newEmail: 'passculture@mail.co',
      password: 'password>=12',
    }
    const result = changeEmailSchema(undefined).validate(input)

    await expect(result).resolves.toEqual(input)
  })

  it('should accept when email and password are valid and the old email is different than the new one', async () => {
    const input = {
      newEmail: 'passculture@mail.co',
      password: 'password>=12',
    }
    const result = changeEmailSchema('old-different-email@mail.co').validate(input)

    await expect(result).resolves.toEqual(input)
  })
})
