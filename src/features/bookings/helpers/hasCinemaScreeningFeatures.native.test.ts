import { ScreeningFeatures } from 'api/gen'
import { hasCinemaScreeningFeatures } from 'features/bookings/helpers/hasCinemaScreeningFeatures'

const defaultFeatures: ScreeningFeatures = {
  accessibility: { audio: [], mental: [], motor: [], visual: [] },
  audio: null,
  language: null,
  specialEventType: null,
  video: null,
}

describe('hasCinemaScreeningFeatures', () => {
  it.each<[string, ScreeningFeatures]>([
    ['a special event', { ...defaultFeatures, specialEventType: 'CINE_DEBAT' }],
    ['a video format', { ...defaultFeatures, video: '4DX' }],
    ['an audio format', { ...defaultFeatures, audio: 'ATMOS' }],
    [
      'an accessibility feature',
      { ...defaultFeatures, accessibility: { ...defaultFeatures.accessibility, motor: ['PMR'] } },
    ],
  ])('should return true when the screening has %s', (_, features) => {
    expect(hasCinemaScreeningFeatures(features)).toBe(true)
  })

  it('should return false when the screening has no displayable feature', () => {
    expect(hasCinemaScreeningFeatures(defaultFeatures)).toBe(false)
  })
})
