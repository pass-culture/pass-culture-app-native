import { isVenueTypeLabelValid } from 'features/venueMap/helpers/isVenueTypeLabelValid/isVenueTypeLabelValid'

describe('isVenueTypeLabelValid', () => {
  it('should return true if label is different from "Type de lieu"', () => {
    const label = 'Musées'

    expect(isVenueTypeLabelValid(label)).toEqual(true)
  })

  it('should return false if label is "Type de lieu"', () => {
    const label = 'Type de lieu'

    expect(isVenueTypeLabelValid(label)).toEqual(false)
  })

  it('should return false if label is empty', () => {
    const label = ''

    expect(isVenueTypeLabelValid(label)).toEqual(false)
  })
})
