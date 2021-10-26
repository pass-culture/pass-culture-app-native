import { isEmailValid, useIsCurrentUserEmail } from './emailCheck'

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

const currentUserEmail = 'current@gmail.com'
const newUserEmail = 'new@gmail.com'
jest.mock('features/home/api', () => ({
  useUserProfileInfo: jest.fn(() => ({ data: { email: currentUserEmail } })),
}))

describe('useIsCurrentUserEmail function', () => {
  it('should return true if the current user email is the same than the new one', () => {
    const isCurrentUserEmail = useIsCurrentUserEmail(currentUserEmail)
    expect(isCurrentUserEmail).toEqual(true)
  })
  it('should return false if the current user email is different than the new one', () => {
    const isCurrentUserEmail = useIsCurrentUserEmail(newUserEmail)
    expect(isCurrentUserEmail).toEqual(false)
  })
})
