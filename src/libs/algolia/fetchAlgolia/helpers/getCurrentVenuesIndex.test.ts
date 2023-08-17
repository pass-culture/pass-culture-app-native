import { LocationType } from 'features/search/enums'
import { getCurrentVenuesIndex } from 'libs/algolia/fetchAlgolia/helpers/getCurrentVenuesIndex'

describe('getCurrentVenuesIndex', () => {
  it('should return algoliaVenuesIndexPlaylistSearchNewest when locationType is EVERYWHERE', () => {
    const params = LocationType.EVERYWHERE
    const result = getCurrentVenuesIndex(params)
    expect(result).toEqual('algoliaVenuesIndexPlaylistSearchNewest')
  })

  it('should return algoliaVenuesIndexPlaylistSearch when locationType is not EVERYWHERE', () => {
    const params = LocationType.AROUND_ME
    const result = getCurrentVenuesIndex(params)
    expect(result).toEqual('algoliaVenuesIndexPlaylistSearch')
  })

  it('should return algoliaVenuesIndexPlaylistSearch when locationFilter is undefined', () => {
    const params = undefined
    const result = getCurrentVenuesIndex(params)
    expect(result).toEqual('algoliaVenuesIndexPlaylistSearch')
  })
})
