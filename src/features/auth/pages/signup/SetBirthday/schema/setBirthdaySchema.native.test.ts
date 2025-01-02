import { ValidationError } from 'yup'

import { setBirthdaySchema } from 'features/auth/pages/signup/SetBirthday/schema/setBirthdaySchema'
import { analytics } from 'libs/analytics'

const today = new Date()
const lessThanFifteenYearsOldBirthdate = new Date()
lessThanFifteenYearsOldBirthdate.setFullYear(today.getFullYear() - 14)

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

  it('should reject when user is under 15 years old', async () => {
    const input = { birthdate: lessThanFifteenYearsOldBirthdate }
    const result = setBirthdaySchema.validate(input)

    await expect(result).rejects.toEqual(
      new ValidationError('Tu dois avoir au moins 15\u00a0ans pour t’inscrire au pass Culture')
    )
  })

  it('should log analytics if user is under 15 years old', async () => {
    const input = { birthdate: lessThanFifteenYearsOldBirthdate }
    const result = setBirthdaySchema.validate(input)

    await expect(result).rejects.toBeTruthy()
    expect(analytics.logSignUpTooYoung).toHaveBeenCalledTimes(1)
  })
})
