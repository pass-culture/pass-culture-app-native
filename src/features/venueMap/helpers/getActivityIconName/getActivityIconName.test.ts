import { Activity } from 'api/gen'
import { getActivityIconName } from 'features/venueMap/helpers/getActivityIconName/getActivityIconName'

describe('getActivityIconName', () => {
  it('should display selected venue type map pin icon', () => {
    const result = getActivityIconName(true, Activity.BOOKSTORE)

    expect(result).toEqual('map_pin_bookstore_selected')
  })

  it('should display venue type map pin icon', () => {
    const result = getActivityIconName(false, Activity.BOOKSTORE)

    expect(result).toEqual('map_pin_bookstore')
  })

  it('should display selected default map pin when venue type code is null', () => {
    const result = getActivityIconName(true, null)

    expect(result).toEqual('map_pin_center_selected')
  })

  it('should display default map pin when venue type code is null', () => {
    const result = getActivityIconName(false, null)

    expect(result).toEqual('map_pin_center')
  })

  it('should display default map pin when venue type code is not known', () => {
    // @ts-expect-error to test an unknown venue type
    const result = getActivityIconName(false, 'NEW_VENUE_TYPE')

    expect(result).toEqual('map_pin_center')
  })

  it('should display center icon for other venue type code', () => {
    const result = getActivityIconName(false, Activity.OTHER)

    expect(result).toEqual('map_pin_center')
  })
})
