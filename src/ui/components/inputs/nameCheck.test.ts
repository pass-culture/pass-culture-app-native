import { isNameValid } from './nameCheck'

describe('isNameValid function', () => {
  it.each([
    'John',
    "John O'Wick",
    'John O’Wick',
    'John Doe-Smith',
    'Loïc',
    'Martin king, Jr.',
    'àâçéèêîôœùûÀÂÇÉÈÊÎÔŒÙÛ',
  ])('should accept a well formatted name: %s', (name) => {
    const isValid = isNameValid(name)

    expect(isValid).toEqual(true)
  })

  it.each(['J@hn', 'John123', '-John', "'John", 'John-', "John'", 'ჯონ', '𝘑𝘦𝘢𝘯 𝘩𝘦𝘯𝘳𝘺', ' ', '  '])(
    'should reject a unwell formatted name: %s',
    (name) => {
      const isValid = isNameValid(name)

      expect(isValid).toEqual(false)
    }
  )
})
