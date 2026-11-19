import { ScreeningFeatures } from 'api/gen'

import { getCinemaScreeningFeaturesProps } from './getCinemaScreeningFeaturesProps'

const defaultFeatures: ScreeningFeatures = {
  accessibility: { audio: [], mental: [], motor: [], visual: [] },
  audio: null,
  language: null,
  specialEventType: null,
  video: null,
}

describe('getCinemaScreeningFeaturesProps', () => {
  it('adapts structured screening features to the cinema card', () => {
    const features: ScreeningFeatures = {
      accessibility: {
        audio: ['SUBTITLE_CCAP'],
        mental: [],
        motor: ['PMR'],
        visual: ['AD_GRETA'],
      },
      audio: 'ATMOS',
      language: 'VF',
      specialEventType: 'AVANT_PREMIERE_EQUIPE',
      video: 'IMAX',
    }

    expect(getCinemaScreeningFeaturesProps(features)).toEqual({
      accessibility: features.accessibility,
      audio: ['Dolby Atmos'],
      languages: ['VF'],
      specialEvent: 'Avant-première équipe',
      video: ['IMAX'],
    })
  })

  it.each([
    ['PLEIN_AIR', 'Plein air'],
    ['DRIVE_IN', 'Drive-in'],
    ['CINE_CONCERT', 'Ciné-concert'],
    ['AVANT_PREMIERE', 'Avant-première'],
    ['AVANT_PREMIERE_EQUIPE', 'Avant-première équipe'],
    ['CINE_DEBAT', 'Ciné-débat'],
    ['DERNIERE_DIFFUSION', 'Dernière projection'],
    ['SEANCE_UNIQUE', 'Séance unique'],
    ['PREMIERE_DIFFUSION', 'Première projection'],
    ['RENCONTRE', 'Rencontre'],
    ['REPLAY', 'Rediffusion'],
    ['LIVE', 'En Direct'],
    ['ATELIER', 'Ciné-atelier'],
    ['ANIMATION_15_25', 'Animation 15-25'],
    ['PUBLIC_ADAPTE', 'Public adapté'],
    ['CINE_CLUB', 'Ciné-Club'],
    ['FESTIVAL', 'Festival'],
    ['CINE_RELAX', 'Ciné Relax'],
  ])('maps special event %s to %s', (specialEventType, expectedLabel) => {
    expect(
      getCinemaScreeningFeaturesProps({ ...defaultFeatures, specialEventType }).specialEvent
    ).toBe(expectedLabel)
  })

  it.each([
    ['4DX', '4DX'],
    ['4DX_3D', '4DX 3D'],
    ['IMAX', 'IMAX'],
    ['IMAX_3D', 'IMAX3D'],
    ['SCREEN_X', 'ScreenX'],
    ['DOLBY_VISION', 'DolbyVision'],
    ['DOLBY_VISION_3D', 'DolbyVision 3D'],
    ['2D', '2D'],
    ['3D', '3D'],
    ['4K', '4K'],
    ['ODYSEE', 'Odyssée'],
    ['SPHERA', 'Sphera'],
    ['HFR', 'HFR'],
    ['ONYX', 'Onyx'],
    ['70MM', '70mm'],
    ['OMNIMAX', 'Omnimax'],
    ['LASER', 'Laser'],
    ['MX_4D', 'MX4D'],
    ['MX_4D_3D', 'MX4D 3D'],
  ])('maps video feature %s to %s', (video, expectedLabel) => {
    expect(getCinemaScreeningFeaturesProps({ ...defaultFeatures, video }).video).toEqual([
      expectedLabel,
    ])
  })

  it.each([
    ['ATMOS', 'Dolby Atmos'],
    ['SON_IMMERSIF', 'Son Immersif'],
    ['AURO_3D', 'Auro-3D'],
    ['DSTX', 'DTS:X'],
    ['MONO', 'Mono'],
    ['DOLBY_31', 'Dolby 3.1'],
    ['DOLBY_51', 'Dolby 5.1'],
    ['DOLBY_71', 'Dolby 7.1'],
  ])('maps audio feature %s to %s', (audio, expectedLabel) => {
    expect(getCinemaScreeningFeaturesProps({ ...defaultFeatures, audio }).audio).toEqual([
      expectedLabel,
    ])
  })
})
