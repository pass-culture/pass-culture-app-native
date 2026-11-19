import { ScreeningFeatures } from 'api/gen'

const SPECIAL_EVENT_LABELS: Partial<Record<string, string>> = {
  PLEIN_AIR: 'Plein air',
  DRIVE_IN: 'Drive-in',
  CINE_CONCERT: 'Ciné-concert',
  AVANT_PREMIERE: 'Avant-première',
  AVANT_PREMIERE_EQUIPE: 'Avant-première avec équipe',
  CINE_DEBAT: 'Ciné-débat',
  DERNIERE_DIFFUSION: 'Dernière diffusion',
  SEANCE_UNIQUE: 'Séance unique',
  PREMIERE_DIFFUSION: 'Première diffusion',
  RENCONTRE: 'Rencontre',
  REPLAY: 'Replay',
  LIVE: 'Live',
  ATELIER: 'Atelier',
  ANIMATION_15_25: 'Animation 15-25 ans',
  PUBLIC_ADAPTE: 'Public adapté',
  CINE_CLUB: 'Ciné-club',
  FESTIVAL: 'Festival',
  CINE_RELAX: 'Ciné-relax',
}

const VIDEO_LABELS: Partial<Record<string, string>> = {
  '4DX': '4DX',
  '4DX_3D': '4DX 3D',
  IMAX: 'IMAX',
  IMAX_3D: 'IMAX 3D',
  SCREEN_X: 'ScreenX',
  DOLBY_VISION: 'Dolby Vision',
  DOLBY_VISION_3D: 'Dolby Vision 3D',
  '2D': '2D',
  '3D': '3D',
  '4K': '4K',
  ODYSEE: 'Odyssée',
  SPHERA: 'Sphera',
  HFR: 'HFR',
  ONYX: 'Onyx',
  '70MM': '70 mm',
  OMNIMAX: 'Omnimax',
  IMMERSIF: 'Immersif',
  LASER: 'Laser',
  MX_4D: 'MX4D',
  MX_4D_3D: 'MX4D 3D',
}

const AUDIO_LABELS: Partial<Record<string, string>> = {
  '71': '7.1',
  ATMOS: 'Dolby Atmos',
  SON_IMMERSIF: 'Son immersif',
  AURO_3D: 'Auro 3D',
  DSTX: 'DTS:X',
  MONO: 'Mono',
  DOLBY_31: 'Dolby 3.1',
  DOLBY_51: 'Dolby 5.1',
  DOLBY_71: 'Dolby 7.1',
}

const getFeatureLabel = (value: string | null, labels: Partial<Record<string, string>>) =>
  value ? labels[value] : undefined

export const getCinemaScreeningFeaturesProps = (features: ScreeningFeatures) => {
  const video = getFeatureLabel(features.video, VIDEO_LABELS)
  const audio = getFeatureLabel(features.audio, AUDIO_LABELS)

  return {
    languages: features.language ? [features.language] : [],
    specialEvent: getFeatureLabel(features.specialEventType, SPECIAL_EVENT_LABELS),
    video: video ? [video] : [],
    audio: audio ? [audio] : [],
    accessibility: features.accessibility,
  }
}
