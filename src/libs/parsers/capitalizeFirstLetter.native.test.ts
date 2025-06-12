import { capitalizeFirstLetter } from 'libs/parsers/capitalizeFirstLetter'

describe('capitalizeFirstLetter', () => {
  it('should capitalize the first letter of a lowercase string', () => {
    expect(capitalizeFirstLetter('bonjour')).toEqual('Bonjour')
  })

  it('should return the same string if the first letter is already uppercase', () => {
    expect(capitalizeFirstLetter('Bonjour')).toEqual('Bonjour')
  })

  it('should not affect strings starting with a number or symbol', () => {
    expect(capitalizeFirstLetter('123abc')).toEqual('123abc')
    expect(capitalizeFirstLetter('#hashtag')).toEqual('#hashtag')
  })

  it('should convert a number to a string', () => {
    expect(capitalizeFirstLetter(123)).toEqual('123')
  })

  it('should return undefined if input is undefined', () => {
    expect(capitalizeFirstLetter(undefined)).toBeUndefined()
  })

  it('should handle an empty string', () => {
    expect(capitalizeFirstLetter('')).toEqual('')
  })
})
