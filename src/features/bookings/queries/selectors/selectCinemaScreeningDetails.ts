import { ScreeningFeatures } from 'api/gen'
import {
  CinemaScreeningAccessibilityCategory,
  CinemaScreeningDetail,
} from 'features/bookings/components/CinemaScreeningDetailsModal/types'

type CinemaScreeningDetailContent = Pick<CinemaScreeningDetail, 'label' | 'description'>

const SPECIAL_EVENT_DETAILS: Partial<Record<string, CinemaScreeningDetailContent>> = {
  PREVIEW_SCREENING_WITH_CREW: {
    label: 'Avant première',
    description:
      'Séance exceptionnelle permettant de découvrir un film en exclusivité, avant sa sortie officielle.',
  },
}

const VIDEO_DETAILS: Partial<Record<string, CinemaScreeningDetailContent>> = {
  IMAX: {
    label: 'IMAX',
    description:
      'Projection en avant-première suivie d’une rencontre exceptionnelle avec le réalisateur et les acteurs.',
  },
}

const AUDIO_DETAILS: Partial<Record<string, CinemaScreeningDetailContent>> = {
  DOLBY_ATMOS: {
    label: 'DolbyAtmos',
    description:
      'Expérience cinéma immersive, avec une image plus grande, un son puissant et des détails exceptionnels.',
  },
}

const ACCESSIBILITY_DETAILS: Partial<Record<string, CinemaScreeningDetailContent>> = {
  GRETA: {
    label: 'Audio-description GRETA',
    description:
      'Audio-description est un service qui décrit à voix haute les images et actions à l’écran pour les personnes malvoyantes.',
  },
  CCAP: {
    label: 'Sous-titrage CCAP',
    description:
      'Dispositifs pour malentendants permet de mieux entendre les dialogues et les sons du film grâce à un système adapté.',
  },
  PMR: {
    label: 'Accès PMR',
    description:
      'Dispositifs d’accès handicap sont des aménagements et équipements adaptés pour faciliter l’accès au cinéma et le confort de tous.',
  },
}

const ACCESSIBILITY_CATEGORY_ORDER: CinemaScreeningAccessibilityCategory[] = [
  'visual',
  'audio',
  'mental',
  'motor',
]

export const selectCinemaScreeningDetails = ({
  specialEventType,
  video,
  audio,
  accessibility,
}: ScreeningFeatures): CinemaScreeningDetail[] => {
  const details: CinemaScreeningDetail[] = []

  const specialEventDetail = specialEventType ? SPECIAL_EVENT_DETAILS[specialEventType] : undefined
  if (specialEventDetail) {
    details.push({ ...specialEventDetail, type: 'tag', category: 'special-event' })
  }

  const videoDetail = video ? VIDEO_DETAILS[video] : undefined
  if (videoDetail) {
    details.push({ ...videoDetail, type: 'tag', category: 'video' })
  }

  const audioDetail = audio ? AUDIO_DETAILS[audio] : undefined
  if (audioDetail) {
    details.push({ ...audioDetail, type: 'tag', category: 'audio' })
  }

  ACCESSIBILITY_CATEGORY_ORDER.forEach((category) => {
    accessibility[category]?.forEach((feature) => {
      const accessibilityDetail = ACCESSIBILITY_DETAILS[feature]

      if (accessibilityDetail) {
        details.push({ ...accessibilityDetail, type: 'accessibility', category })
      }
    })
  })

  return details
}
