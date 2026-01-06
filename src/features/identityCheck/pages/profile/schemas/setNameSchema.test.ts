import { ValidationError } from 'yup'

import { setNameSchema } from 'features/identityCheck/pages/profile/schemas/setNameSchema'

describe('setNameSchema', () => {
  it('should reject when no name', async () => {
    const result = setNameSchema.validate({
      firstName: undefined,
      lastName: undefined,
    })

    await expect(result).rejects.toEqual(new ValidationError('Le nom est obligatoire'))
  })

  it('should reject when first name has a number', async () => {
    const result = setNameSchema.validate({
      firstName: 'John4',
      lastName: 'Doe',
    })

    await expect(result).rejects.toEqual(
      new ValidationError('Ce champ ne doit pas contenir de chiffres.')
    )
  })

  it('should reject when last name has a special character', async () => {
    const result = setNameSchema.validate({
      firstName: 'John',
      lastName: 'Doe#',
    })

    await expect(result).rejects.toEqual(
      new ValidationError('Ce champ contient des caractères invalides.')
    )
  })

  it('should resolve when last name and first name are valid', async () => {
    const input = {
      firstName: 'John',
      lastName: 'Doe',
    }

    const result = setNameSchema.validate(input)

    await expect(result).resolves.toEqual(input)
  })
})
