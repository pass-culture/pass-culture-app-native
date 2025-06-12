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

  it('should handle an empty string', () => {
    expect(capitalizeFirstLetter('')).toEqual('')
  })
})
