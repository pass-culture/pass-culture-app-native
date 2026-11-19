import { ScreeningFeatures } from 'api/gen'
import { getDisplayedCinemaScreeningFeatures } from 'features/bookings/helpers/getDisplayedCinemaScreeningFeatures'

const defaultFeatures: ScreeningFeatures = {
  accessibility: { audio: [], mental: [], motor: [], visual: [] },
  audio: null,
  language: null,
  specialEventType: null,
  video: null,
}

describe('getDisplayedCinemaScreeningFeatures', () => {
  it('should return the special event, the media tags and the accessibility categories to display', () => {
    const { specialEvent, mediaTags, displayedAccessibility } = getDisplayedCinemaScreeningFeatures(
      {
        ...defaultFeatures,
        specialEventType: 'CINE_DEBAT',
        video: '4DX',
        audio: 'ATMOS',
        accessibility: { audio: [], mental: [], motor: ['PMR'], visual: ['AD_GRETA'] },
      }
    )

    expect(specialEvent).toEqual('Ciné-débat')
    expect(mediaTags).toEqual(['4DX', 'Dolby Atmos'])
    expect(displayedAccessibility.map(({ key }) => key)).toEqual(['visual', 'motor'])
  })

  it('should return nothing to display when the screening has no features', () => {
    const { specialEvent, mediaTags, displayedAccessibility } =
      getDisplayedCinemaScreeningFeatures(defaultFeatures)

    expect(specialEvent).toBeUndefined()
    expect(mediaTags).toEqual([])
    expect(displayedAccessibility).toEqual([])
  })
})
