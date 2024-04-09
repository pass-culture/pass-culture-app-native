import { VenueTypeCodeKey } from 'api/gen'
import { getVenueTypeLabel } from 'features/venueMap/helpers/getVenueTypeLabel/getVenueTypeLabel'

describe('getVenueTypeLabel', () => {
  it('should return null when venue type code is null', () => {
    const venueTypeLabel = getVenueTypeLabel(null)

    expect(venueTypeLabel).toEqual(null)
  })

  it('should return venue type label when venue type code is not null', () => {
    const venueTypeLabel = getVenueTypeLabel(VenueTypeCodeKey.BOOKSTORE)

    expect(venueTypeLabel).toEqual('Librairies')
  })
})
