import { getProfileHeaderTitle } from './getProfileHeaderTitle'

describe('getProfileHeaderTitle', () => {
  it('should return full name when firstName and lastName are provided', () => {
    const result = getProfileHeaderTitle({ firstName: 'Jean', lastName: 'Dupont' })

    expect(result).toBe('Jean Dupont')
  })

  it('should return default title if firstName is missing', () => {
    const result = getProfileHeaderTitle({ firstName: null, lastName: 'Dupont' })

    expect(result).toBe('Mon profil')
  })

  it('should return default title if lastName is missing', () => {
    const result = getProfileHeaderTitle({ firstName: 'Jean', lastName: null })

    expect(result).toBe('Mon profil')
  })

  it('should return default title if both names are missing', () => {
    const result = getProfileHeaderTitle({})

    expect(result).toBe('Mon profil')
  })

  it('should return default title if names are empty strings', () => {
    const result = getProfileHeaderTitle({ firstName: '', lastName: '' })

    expect(result).toBe('Mon profil')
  })
})
