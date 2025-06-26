import { capitalize } from 'libs/formatter/capitalize'

describe('capitalizeFirstLetter', () => {
  it('should capitalize the first letter of a lowercase string', () => {
    expect(capitalize('bonjour')).toEqual('Bonjour')
  })

  it('should return the same string if the first letter is already uppercase', () => {
    expect(capitalize('Bonjour')).toEqual('Bonjour')
  })

  it('should not affect strings starting with a number or symbol', () => {
    expect(capitalize('123abc')).toEqual('123abc')
    expect(capitalize('#hashtag')).toEqual('#hashtag')
  })

  it('should handle an empty string', () => {
    expect(capitalize('')).toEqual('')
  })
})
