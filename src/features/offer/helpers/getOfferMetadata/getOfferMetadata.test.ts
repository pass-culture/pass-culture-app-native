import { CategoryIdEnum } from 'api/gen'
import { getOfferMetadata } from 'features/offer/helpers/getOfferMetadata/getOfferMetadata'

describe('getOfferMetadata', () => {
  it('should return an empty array when extraData is undefined', () => {
    const result = getOfferMetadata()

    expect(result).toEqual([])
  })

  it('should return correct metadata with speaker value', () => {
    const extraData = { speaker: 'John Doe' }
    const result = getOfferMetadata(extraData)

    expect(result).toEqual([{ label: 'Intervenant', value: 'John Doe' }])
  })

  it('should return correct metadata with releaseDate value', () => {
    const extraData = { releaseDate: '2023-01-01' }
    const result = getOfferMetadata(extraData)

    expect(result).toEqual([{ label: 'Date de sortie', value: '01 janvier 2023' }])
  })

  it('should return correct metadata with cast value', () => {
    const extraData = { cast: ['Actor1', 'Actor2'] }
    const result = getOfferMetadata(extraData)

    expect(result).toEqual([{ label: 'Distribution', value: 'Actor1, Actor2' }])
  })

  it('should return correct metadata with editeur value', () => {
    const extraData = { editeur: 'Publisher' }
    const result = getOfferMetadata(extraData)

    expect(result).toEqual([{ label: 'Éditeur', value: 'Publisher' }])
  })

  it('should not return items with empty values', () => {
    const extraData = { speaker: '', releaseDate: null, cast: [], editeur: undefined }
    const result = getOfferMetadata(extraData)

    expect(result).toEqual([])
  })

  it('should return correct metadata certificate with no label', () => {
    const extraData = { certificate: 'Interdection au moins de 18 ans' }
    const result = getOfferMetadata(extraData)

    expect(result).toEqual([{ label: '', value: 'Interdection au moins de 18 ans' }])
  })

  it('should not return Distribution metadata for cinema offers when artists are displayed', () => {
    const extraData = { cast: ['Actor1', 'Actor2'] }
    const result = getOfferMetadata(extraData, CategoryIdEnum.CINEMA, true)

    expect(result).toEqual([])
  })

  it('should keep Distribution metadata for cinema offers when no artists are displayed', () => {
    const extraData = { cast: ['Actor1', 'Actor2'] }
    const result = getOfferMetadata(extraData, CategoryIdEnum.CINEMA, false)

    expect(result).toEqual([{ label: 'Distribution', value: 'Actor1, Actor2' }])
  })

  it('should keep other cinema metadata while removing Distribution when artists are displayed', () => {
    const extraData = {
      certificate: 'Tous publics',
      releaseDate: '2023-01-01',
      cast: ['Actor1', 'Actor2'],
    }
    const result = getOfferMetadata(extraData, CategoryIdEnum.CINEMA, true)

    expect(result).toEqual([
      { label: '', value: 'Tous publics' },
      { label: 'Date de sortie', value: '01 janvier 2023' },
    ])
  })

  it('should keep Distribution metadata for non-cinema offers even when artists are displayed', () => {
    const extraData = { cast: ['Actor1', 'Actor2'] }
    const result = getOfferMetadata(extraData, CategoryIdEnum.SPECTACLE, true)

    expect(result).toEqual([{ label: 'Distribution', value: 'Actor1, Actor2' }])
  })
})
