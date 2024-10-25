import { VenueTypeCodeKey } from 'api/gen'
import { getVenueTypeIconName } from 'features/venueMap/helpers/getVenueTypeIconName/getVenueTypeIconName'

describe('getVenueTypeIconName', () => {
  it('should display selected venue type map pin icon', () => {
    const result = getVenueTypeIconName(true, VenueTypeCodeKey.BOOKSTORE)

    expect(result).toEqual('map_pin_bookstore_selected')
  })

  it('should display venue type map pin icon', () => {
    const result = getVenueTypeIconName(false, VenueTypeCodeKey.BOOKSTORE)

    expect(result).toEqual('map_pin_bookstore')
  })

  it('should display selected default map pin when venue type code is null', () => {
    const result = getVenueTypeIconName(true, null)

    expect(result).toEqual('map_pin_center_selected')
  })

  it('should display default map pin when venue type code is null', () => {
    const result = getVenueTypeIconName(false, null)

    expect(result).toEqual('map_pin_center')
  })

  it('should display default map pin when venue type code is not known', () => {
    // @ts-expect-error to test an unknown venue type
    const result = getVenueTypeIconName(false, 'NEW_VENUE_TYPE')

    expect(result).toEqual('map_pin_center')
  })

  it('should display center icon for other venue type code', () => {
    const result = getVenueTypeIconName(false, VenueTypeCodeKey.OTHER)

    expect(result).toEqual('map_pin_center')
  })

  it('should display center icon for digital venue type code', () => {
    const result = getVenueTypeIconName(false, VenueTypeCodeKey.DIGITAL)

    expect(result).toEqual('map_pin_center')
  })
})
