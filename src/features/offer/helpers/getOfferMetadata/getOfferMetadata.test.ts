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
})
