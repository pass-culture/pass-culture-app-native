import { maskEmail } from './maskEmail'

describe('maskEmail', () => {
  describe('when the local part contains between 1 and 4 characters', () => {
    it.each([
      ['a@me.com', 'a***@me.com'],
      ['am@me.com', 'a***@me.com'],
      ['amy@me.com', 'a***@me.com'],
      ['anne@me.com', 'a***@me.com'],
    ])('should mask %s as %s', (email: string, expected: string) => {
      expect(maskEmail(email)).toBe(expected)
    })
  })

  describe('when the local part contains exactly 5 characters', () => {
    it.each([
      ['annie@me.com', 'an***@me.com'],
      ['marie@test.com', 'ma***@test.com'],
    ])('should mask %s as %s', (email: string, expected: string) => {
      expect(maskEmail(email)).toBe(expected)
    })
  })

  describe('when the local part contains 6 or more characters', () => {
    it.each([
      ['abcdef@me.com', 'abc***@me.com'],
      ['anne-onime@me.com', 'ann*******@me.com'],
      ['alexandre@test.com', 'ale******@test.com'],
    ])('should mask %s as %s', (email: string, expected: string) => {
      expect(maskEmail(email)).toBe(expected)
    })
  })

  describe('when the email address is invalid', () => {
    it('should throw an error when the @ symbol is missing', () => {
      expect(() => maskEmail('invalid-email')).toThrow('Adresse email invalide')
    })
  })
})
