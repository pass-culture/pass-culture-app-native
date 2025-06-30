import { camelCase } from 'libs/formatter/camelCase'

describe('camelCase', () => {
  it('should lowercase the first character of a single word', () => {
    expect(camelCase('VenueMap')).toEqual('venueMap')
  })

  it('should return empty string when input is empty', () => {
    expect(camelCase('')).toEqual('')
  })

  it('should not change the first character if it is already lowercase', () => {
    expect(camelCase('venueMap')).toEqual('venueMap')
  })

  it('should only lowercase the first character, not affect the rest', () => {
    expect(camelCase('TestCASE')).toEqual('testCASE')
  })
})
