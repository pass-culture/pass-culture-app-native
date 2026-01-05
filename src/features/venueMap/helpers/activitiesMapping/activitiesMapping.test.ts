import { Activity } from 'api/gen'
import { activitiesMapping } from 'features/venueMap/helpers/activitiesMapping/activitiesMapping'
import { MAP_ACTIVITY_TO_LABEL } from 'libs/parsers/activity'

describe('activitiesMapping', () => {
  it('should have "Sorties" as title for trip venues', () => {
    expect(activitiesMapping.trip.title).toEqual('Sorties')
  })

  it('should have "Boutiques" as title for shop venues', () => {
    expect(activitiesMapping.shop.title).toEqual('Boutiques')
  })

  it('should have "Autres" as title for other venues', () => {
    expect(activitiesMapping.other.title).toEqual('Autres')
  })

  it('should have 7 children for trip venues', () => {
    const tripChildren = activitiesMapping.trip.children

    expect(Object.keys(tripChildren)).toHaveLength(7)
  })

  it('should have correct child for trip venues', () => {
    const tripChildren = activitiesMapping.trip.children

    expect(tripChildren[Activity.CINEMA]).toEqual(MAP_ACTIVITY_TO_LABEL[Activity.CINEMA])
  })

  it('should have 5 children for shop venues', () => {
    const shopChildren = activitiesMapping.shop.children

    expect(Object.keys(shopChildren)).toHaveLength(5)
  })

  it('should have correct child for shop venues', () => {
    const shopChildren = activitiesMapping.shop.children

    expect(shopChildren[Activity.BOOKSTORE]).toEqual(MAP_ACTIVITY_TO_LABEL[Activity.BOOKSTORE])
  })

  it('should have 9 children for other venues', () => {
    const otherChildren = activitiesMapping.other.children

    expect(Object.keys(otherChildren)).toHaveLength(9)
  })

  it('should have correct child for other venues', () => {
    const otherChildren = activitiesMapping.other.children

    expect(otherChildren[Activity.ART_SCHOOL]).toEqual(MAP_ACTIVITY_TO_LABEL[Activity.ART_SCHOOL])
  })
})
