import { getCinemaScreeningFeaturesProps } from './getCinemaScreeningCardProps'

describe('getCinemaScreeningFeaturesProps', () => {
  it('adapts structured screening features to the cinema card', () => {
    const features = {
      accessibility: { audio: ['CCAP'], mental: [], motor: ['PMR'], visual: ['GRETA'] },
      audio: 'DOLBY_ATMOS',
      language: 'VF',
      specialEventType: 'PREVIEW_SCREENING_WITH_CREW',
      video: 'IMAX',
    }

    expect(getCinemaScreeningFeaturesProps(features)).toEqual({
      accessibility: features.accessibility,
      audio: ['DolbyAtmos'],
      languages: ['VF'],
      specialEvent: 'Avant première',
      video: ['IMAX'],
    })
  })
})
