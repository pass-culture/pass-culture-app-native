import { getIsLoadedOfferPosition } from 'features/offer/helpers/getIsLoadedOfferPosition/getIsLoadedOfferPosition'

describe('getIsLoadedOfferPosition', () => {
  it('should return false when position undefined', () => {
    const isLoadedOfferPosition = getIsLoadedOfferPosition()
    expect(isLoadedOfferPosition).toEqual(false)
  })

  it('should return false when position defined but only latitude defined', () => {
    const isLoadedOfferPosition = getIsLoadedOfferPosition({ latitude: 22 })
    expect(isLoadedOfferPosition).toEqual(false)
  })

  it('should return false when position defined but only longitude defined', () => {
    const isLoadedOfferPosition = getIsLoadedOfferPosition({ longitude: 6 })
    expect(isLoadedOfferPosition).toEqual(false)
  })

  it('should return false when position defined but latitude and longitude undefined', () => {
    const isLoadedOfferPosition = getIsLoadedOfferPosition({
      latitude: undefined,
      longitude: undefined,
    })
    expect(isLoadedOfferPosition).toEqual(false)
  })

  it('should return true when position defined and latitude and longitude too', () => {
    const isLoadedOfferPosition = getIsLoadedOfferPosition({
      latitude: 6,
      longitude: 22,
    })
    expect(isLoadedOfferPosition).toEqual(true)
  })
})
