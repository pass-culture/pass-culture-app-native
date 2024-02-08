import { ValidationError } from 'yup'

import { acceptCGUSchema } from './acceptCguSchema'

describe('acceptCGUSchema', () => {
  it.each([true, false])(
    'should accept once user has accepted cgu and data charter',
    async (marketingEmailSubscription) => {
      const input = {
        acceptCgu: true,
        acceptDataCharter: true,
        marketingEmailSubscription,
      }
      const result = acceptCGUSchema.validate(input)

      await expect(result).resolves.toEqual(input)
    }
  )

  it('should rejects when user has not accept cgu', async () => {
    const input = {
      acceptCgu: false,
      acceptDataCharter: true,
      marketingEmailSubscription: true,
    }

    const result = acceptCGUSchema.validate(input)

    await expect(result).rejects.toEqual(new ValidationError('acceptCgu field must be true'))
  })

  it('should rejects when user has not accept data charter', async () => {
    const input = {
      acceptCgu: true,
      acceptDataCharter: false,
      marketingEmailSubscription: true,
    }

    const result = acceptCGUSchema.validate(input)

    await expect(result).rejects.toEqual(
      new ValidationError('acceptDataCharter field must be true')
    )
  })
})
