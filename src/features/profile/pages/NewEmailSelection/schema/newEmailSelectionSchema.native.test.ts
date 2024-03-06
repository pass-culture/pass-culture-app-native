import { ValidationError } from 'yup'

import { newEmailSelectionSchema } from './newEmailSelectionSchema'

describe('newEmailSelectionSchema', () => {
  it('should reject when no email', async () => {
    const result = newEmailSelectionSchema.validate({
      newEmail: undefined,
    })

    await expect(result).rejects.toEqual(new ValidationError('Le nouvel email est obligatoire'))
  })

  it('should resolve when email is valid', async () => {
    const input = {
      newEmail: 'email@domain.tld',
    }

    const result = newEmailSelectionSchema.validate(input)

    await expect(result).resolves.toEqual(input)
  })
})
