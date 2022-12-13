import { ValidationError } from 'yup'

import { emailSchema } from './emailSchema'

describe('emailSchema', () => {
  it.each([
    'prenom.nom@example.com',
    'prenom_de@example.com',
    'pren-om@exam.ple.com',
    'prenomnom@exam-ple.com',
    'prenom.nom+qqchose@example.com',
  ])('should accept a well formated email: %s', async (email) => {
    const result = await emailSchema.validate(email)

    expect(result).toEqual(email)
  })

  it.each([
    'prenom',
    'prenom@',
    '@fake.com',
    'domain.com',
    'prenom.nom@exampl_e.com', // underscore in hostname
    'prenom@nom@example.com', // double @
  ])('should reject a well formated email: %s', async (email) => {
    const result = emailSchema.validate(email)

    await expect(result).rejects.toEqual(
      new ValidationError(
        'L’e-mail renseigné est incorrect. Exemple de format attendu\u00a0: edith.piaf@email.fr'
      )
    )
  })
})
