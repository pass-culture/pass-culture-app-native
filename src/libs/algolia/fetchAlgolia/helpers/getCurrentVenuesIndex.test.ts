import { LocationType } from 'features/search/enums'
import { getCurrentVenuesIndex } from 'libs/algolia/fetchAlgolia/helpers/getCurrentVenuesIndex'
import { Position } from 'libs/geolocation'

describe('getCurrentVenuesIndex', () => {
  it('should return algoliaVenuesIndexPlaylistSearchNewest when locationType is EVERYWHERE and user not share his position', () => {
    const params = LocationType.EVERYWHERE
    const result = getCurrentVenuesIndex(params)

    expect(result).toEqual('algoliaVenuesIndexPlaylistSearchNewest')
  })

  it('should return algoliaVenuesIndexPlaylistSearch when locationType is EVERYWHERE and user shares his position', () => {
    const position: Position = { latitude: 48.90374, longitude: 2.48171 }
    const params = LocationType.EVERYWHERE
    const result = getCurrentVenuesIndex(params, position)

    expect(result).toEqual('algoliaVenuesIndexPlaylistSearch')
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
