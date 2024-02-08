import { ValidationError } from 'yup'

import { setEmailSchema } from './setEmailSchema'

describe('setEmailSchema', () => {
  it('should reject when no email', async () => {
    const result = setEmailSchema.validate({
      email: undefined,
    })

    await expect(result).rejects.toEqual(new ValidationError('L’email est obligatoire'))
  })

  it('should resolve when email is valid', async () => {
    const input = {
      email: 'email@domain.tld',
    }

    const result = setEmailSchema.validate(input)

    await expect(result).resolves.toEqual(input)
  })
})
