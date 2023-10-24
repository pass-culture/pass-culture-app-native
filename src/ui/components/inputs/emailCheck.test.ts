import { isEmailValid } from './emailCheck'

describe('isEmailValid function', () => {
  it.each([
    'prenom.nom@example.com',
    'prenom_de@example.com',
    'pren-om@exam.ple.com',
    'prenomnom@exam-ple.com',
  ])('should accept a well formated email: %s', (email) => {
    const isValid = isEmailValid(email)

    expect(isValid).toEqual(true)
  })

  it.each([
    'prenom',
    'prenom@',
    '@fake.com',
    'domain.com',
    'prenom.nom@exampl_e.com', // underscore in hostname
    'prenom@nom@example.com', // double @
  ])('should reject a well formated email: %s', (email) => {
    const isValid = isEmailValid(email)

    expect(isValid).toEqual(false)
  })
})
