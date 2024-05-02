import { VenueTypeCodeKey } from 'api/gen'
import { venueTypesMapping } from 'features/venueMap/helpers/venueTypesMapping/venueTypesMapping'
import { MAP_VENUE_TYPE_TO_LABEL } from 'libs/parsers/venueType'

describe('venueTypesMapping', () => {
  it('should have "Sorties" as title for trip venues', () => {
    expect(venueTypesMapping.trip.title).toEqual('Sorties')
  })

  it('should have "Boutiques" as title for shop venues', () => {
    expect(venueTypesMapping.shop.title).toEqual('Boutiques')
  })

  it('should have "Autres" as title for other venues', () => {
    expect(venueTypesMapping.other.title).toEqual('Autres')
  })

  it('should have 9 children for trip venues', () => {
    const tripChildren = venueTypesMapping.trip.children

    expect(Object.keys(tripChildren)).toHaveLength(9)
  })

  it('should have correct child for trip venues', () => {
    const tripChildren = venueTypesMapping.trip.children

    expect(tripChildren[VenueTypeCodeKey.MOVIE]).toEqual(
      MAP_VENUE_TYPE_TO_LABEL[VenueTypeCodeKey.MOVIE]
    )
  })

  it('should have 5 children for shop venues', () => {
    const shopChildren = venueTypesMapping.shop.children

    expect(Object.keys(shopChildren)).toHaveLength(5)
  })

  it('should have correct child for shop venues', () => {
    const shopChildren = venueTypesMapping.shop.children

    expect(shopChildren[VenueTypeCodeKey.BOOKSTORE]).toEqual(
      MAP_VENUE_TYPE_TO_LABEL[VenueTypeCodeKey.BOOKSTORE]
    )
  })

  it('should have 5 children for other venues', () => {
    const otherChildren = venueTypesMapping.other.children

    expect(Object.keys(otherChildren)).toHaveLength(5)
  })

  it('should have correct child for other venues', () => {
    const otherChildren = venueTypesMapping.other.children

    expect(otherChildren[VenueTypeCodeKey.ARTISTIC_COURSE]).toEqual(
      MAP_VENUE_TYPE_TO_LABEL[VenueTypeCodeKey.ARTISTIC_COURSE]
    )
  })
})
