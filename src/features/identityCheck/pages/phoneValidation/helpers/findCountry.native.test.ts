import { findCountry } from './findCountry'

const existingCountry = { id: 'FR', callingCode: '33', name: 'France' }
const unknownCount = 'undefined'
const emptyStringCountry = ''

describe('findCountry', () => {
  it('should return the country when a valid countryId is provided', () => {
    expect(findCountry(existingCountry.id)).toEqual(existingCountry)
  })

  it('should return undefined when an invalid countryId is provided', () => {
    expect(findCountry(unknownCount)).toBeUndefined()
  })

  it('should return undefined when an empty string is provided as countryId', () => {
    expect(findCountry(emptyStringCountry)).toBeUndefined()
  })
})
