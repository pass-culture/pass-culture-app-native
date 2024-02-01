import { getOfferTags } from 'features/offerv2/helpers/getOfferTags/getOfferTags'

describe('getOfferTags', () => {
  it('should return the offer subcategory by default', () => {
    const tags = getOfferTags('Cinéma plein air')

    expect(tags).toEqual(['Cinéma plein air'])
  })

  it('should return music type in tags list when offer has it', () => {
    const tags = getOfferTags('Cinéma plein air', { musicType: 'Pop' })

    expect(tags).toEqual(['Cinéma plein air', 'Pop'])
  })

  it('should return music type and subtype in tags list when offer has it', () => {
    const tags = getOfferTags('Cinéma plein air', { musicType: 'Pop', musicSubType: 'Dance Pop' })

    expect(tags).toEqual(['Cinéma plein air', 'Pop', 'Dance Pop'])
  })

  it('should return show type in tags list when offer has it', () => {
    const tags = getOfferTags('Cinéma plein air', { showType: 'Théâtre' })

    expect(tags).toEqual(['Cinéma plein air', 'Théâtre'])
  })

  it('should return show type and subtype in tags list when offer has it', () => {
    const tags = getOfferTags('Cinéma plein air', { showType: 'Théâtre', showSubType: 'Comédie' })

    expect(tags).toEqual(['Cinéma plein air', 'Théâtre', 'Comédie'])
  })

  it('should not return data when it is null or undefined', () => {
    const tags = getOfferTags('Cinéma plein air', { showType: null, showSubType: undefined })

    expect(tags).toEqual(['Cinéma plein air'])
  })

  it('should return cinema genres in tags list when offer has it', () => {
    const cinemaGenres = ['Action', 'Comedy', 'Drama']
    const tags = getOfferTags('Cinéma plein air', { genres: cinemaGenres })

    expect(tags).toEqual(['Cinéma plein air', 'Action', 'Comedy', 'Drama'])
  })

  it('should handle empty cinema genres', () => {
    const tags = getOfferTags('Cinéma plein air', { genres: [] })

    expect(tags).toEqual(['Cinéma plein air'])
  })

  it('should handle undefined cinema genres', () => {
    const tags = getOfferTags('Cinéma plein air', { genres: undefined })

    expect(tags).toEqual(['Cinéma plein air'])
  })

  it('should handle null cinema genres', () => {
    const tags = getOfferTags('Cinéma plein air', { genres: null })

    expect(tags).toEqual(['Cinéma plein air'])
  })
})
