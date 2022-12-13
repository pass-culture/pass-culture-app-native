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

  it.each([true, false])(
    'is not required to accept newsletter',
    async (marketingEmailSubscription) => {
      const input = {
        email: 'email@domain.tld',
        marketingEmailSubscription,
      }

      const result = setEmailSchema.validate(input)

      await expect(result).resolves.toEqual(input)
    }
  )
})
