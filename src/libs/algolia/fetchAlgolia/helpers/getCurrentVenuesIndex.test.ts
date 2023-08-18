import { LocationType } from 'features/search/enums'
import { getCurrentVenuesIndex } from 'libs/algolia/fetchAlgolia/helpers/getCurrentVenuesIndex'

describe('getCurrentVenuesIndex', () => {
  it('should return algoliaVenuesIndexPlaylistSearchNewest when locationType is EVERYWHERE', () => {
    const params = LocationType.EVERYWHERE
    const result = getCurrentVenuesIndex(params)
    expect(result).toEqual('algoliaVenuesIndexPlaylistSearchNewest')
  })

  it.each([LocationType.AROUND_ME, LocationType.PLACE, LocationType.VENUE])(
    'should return algoliaVenuesIndexPlaylistSearch when locationType is %s',
    (locationType) => {
      const result = getCurrentVenuesIndex(locationType)
      expect(result).toEqual('algoliaVenuesIndexPlaylistSearch')
    }
  )

  it('should return algoliaVenuesIndexPlaylistSearchNewest when locationFilter is undefined', () => {
    const params = undefined
    const result = getCurrentVenuesIndex(params)
    expect(result).toEqual('algoliaVenuesIndexPlaylistSearchNewest')
  })
})
