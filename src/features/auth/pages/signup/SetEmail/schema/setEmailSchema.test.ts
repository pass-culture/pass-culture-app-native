import { ValidationError } from 'yup'

import { setEmailSchema } from './setEmailSchema'

describe('setEmailSchema', () => {
  it('should reject when no email', async () => {
    const result = setEmailSchema.validate({
      email: undefined,
      marketingEmailSubscription: true,
    })

    await expect(result).rejects.toEqual(new ValidationError('L’email est obligatoire'))
  })

  it('should resolve when email is valid and marketing opt-in is checked', async () => {
    const input = {
      email: 'email@domain.tld',
      marketingEmailSubscription: true,
    }

    const result = setEmailSchema.validate(input)

    await expect(result).resolves.toEqual(input)
  })

  it('should resolve when email is valid and marketing opt-in is not checked', async () => {
    const input = {
      email: 'email@domain.tld',
      marketingEmailSubscription: false,
    }

    const result = setEmailSchema.validate(input)

    await expect(result).resolves.toEqual(input)
  })
})
