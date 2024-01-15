import { ValidationError } from 'yup'

import { setBirthdaySchema } from 'features/auth/pages/signup/SetBirthday/schema/setBirthdaySchema'

describe('setBirthdaySchema', () => {
  it('should validate when valid birthdate is provided', async () => {
    const input = { birthdate: new Date('2005-01-01') }
    const result = setBirthdaySchema.validate(input)

    await expect(result).resolves.toEqual(input)
  })

  it('should reject when no birthdate is provided', async () => {
    const input = {}
    const result = setBirthdaySchema.validate(input)

    await expect(result).rejects.toEqual(
      new ValidationError('La date de naissance est obligatoire')
    )
  })
})
