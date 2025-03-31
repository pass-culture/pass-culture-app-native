import { phoneNumberSchema } from './phoneNumberSchema'

jest.mock('features/identityCheck/pages/phoneValidation/helpers/findCountry', () => ({
  findCountry: jest.fn().mockReturnValue(true),
}))

describe('phoneNumberSchema', () => {
  it('should pass validation for a valid phone number', async () => {
    await expect(
      phoneNumberSchema.validate({ phoneNumber: '0612345678', countryId: 'FR' })
    ).resolves.toBeDefined()
  })

  it('should return an error when phone number is empty', async () => {
    await expect(
      phoneNumberSchema.validate({ phoneNumber: '', countryId: 'FR' })
    ).rejects.toMatchObject({
      errors: ['Le numéro de téléphone est requis'],
    })
  })

  it('should return an error when phone number is too short', async () => {
    await expect(
      phoneNumberSchema.validate({ phoneNumber: '123', countryId: 'FR' })
    ).rejects.toMatchObject({
      errors: [''],
    })
  })

  it('should return an error when phone number is too long', async () => {
    await expect(
      phoneNumberSchema.validate({ phoneNumber: '061234567890', countryId: 'FR' })
    ).rejects.toMatchObject({
      errors: ['Le numéro de téléphone est trop long'],
    })
  })

  it('should return an error when phone number is invalid', async () => {
    await expect(
      phoneNumberSchema.validate({ phoneNumber: '0000000000', countryId: 'FR' })
    ).rejects.toMatchObject({
      errors: ['Le numéro de téléphone est invalide'],
    })
  })

  it('should return an error when country ID is empty', async () => {
    await expect(
      phoneNumberSchema.validate({ phoneNumber: '0612345678', countryId: '' })
    ).rejects.toMatchObject({
      errors: ['countryId is a required field'], // No error display for the user
    })
  })
})
