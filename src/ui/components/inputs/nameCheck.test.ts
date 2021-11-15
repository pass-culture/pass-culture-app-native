import { isNameValid } from './nameCheck'

describe('isNameValid function', () => {
  it.each(['John', "John O'Wick", 'John Doe-Smith', 'Loïc', 'Martin king, Jr.'])(
    'should accept a well formated name: %s',
    (email) => {
      const isValid = isNameValid(email)
      expect(isValid).toEqual(true)
    }
  )

  it.each(['J@hn', 'John123', '-John', "'John", 'John-', "John'"])(
    'should reject a unwell formated name: %s',
    (email) => {
      const isValid = isNameValid(email)
      expect(isValid).toEqual(false)
    }
  )
})
