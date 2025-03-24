import { findArtistById } from 'features/artist/helpers/findArtistById'
import { mockedAlgoliaOffersWithSameArtistResponse } from 'libs/algolia/fixtures/algoliaFixtures'

describe('findArtistById', () => {
  it('should return an artist from hits array', () => {
    const result = findArtistById(mockedAlgoliaOffersWithSameArtistResponse.slice(0, 4), '1')

    expect(result).toEqual({ id: '1', name: 'Eiichiro Oda' })
  })

  it('should return undefined when artist not found in hits array', () => {
    const result = findArtistById(mockedAlgoliaOffersWithSameArtistResponse.slice(0, 4), '2')

    expect(result).toBeUndefined()
  })

  it('should return undefined when hits array is empty', () => {
    const result = findArtistById([], 'arti1st1')

    expect(result).toBeUndefined()
  })
})
