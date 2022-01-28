import { isNameValid } from './nameCheck'

describe('isNameValid function', () => {
  it.each([
    'John',
    "John O'Wick",
    'John Doe-Smith',
    'Loïc',
    'Martin king, Jr.',
    'àâçéèêîôœùûÀÂÇÉÈÊÎÔŒÙÛ',
  ])('should accept a well formated name: %s', (email) => {
    const isValid = isNameValid(email)
    expect(isValid).toEqual(true)
  })

  it.each(['J@hn', 'John123', '-John', "'John", 'John-', "John'", 'ჯონ', '𝘑𝘦𝘢𝘯 𝘩𝘦𝘯𝘳𝘺'])(
    'should reject a unwell formated name: %s',
    (email) => {
      const isValid = isNameValid(email)
      expect(isValid).toEqual(false)
    }
  )
})
