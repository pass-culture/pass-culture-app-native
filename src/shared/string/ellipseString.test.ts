import { ellipseString } from 'shared/string/ellipseString'

describe('ellipseString', () => {
  it('should return an empty string when string is empty and maximum character is 0', () => {
    const value = ellipseString('', 0)

    expect(value).toBe('')
  })

  it('should return the string followed by three dots when a 11 characters string is given and maximum characters is 10', () => {
    const value = ellipseString('Joyeux Noël', 10)

    expect(value).toBe('Joyeux Noë...')
  })

  it('should return the same string when a 11 characters string is given and maximum charcacters is 11', () => {
    const value = ellipseString('Joyeux Noël', 11)

    expect(value).toBe('Joyeux Noël')
  })
})
