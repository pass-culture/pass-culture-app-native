import { ScreeningFeatures } from 'api/gen'
import {
  CinemaScreeningAccessibilityCategory,
  CinemaScreeningDetail,
} from 'features/bookings/components/CinemaScreeningDetailsModal/types'
import {
  ACCESSIBILITY,
  AUDIO,
  EVENT,
  ScreeningDetailContent,
  VIDEO,
} from 'features/offer/components/OfferCine/screeningFeatureDetails'

const ACCESSIBILITY_CATEGORY_ORDER: CinemaScreeningAccessibilityCategory[] = [
  'visual',
  'audio',
  'mental',
  'motor',
]

const getScreeningTagDetails = (
  feature: string | null,
  details: Record<string, ScreeningDetailContent>,
  category: 'special-event' | 'video' | 'audio'
): CinemaScreeningDetail[] => {
  const detail = feature ? details[feature] : undefined
  if (!detail) return []

  return [
    {
      type: 'tag',
      category,
      label: detail.name,
      description: detail.description,
    },
  ]
}

export const getScreeningDetails = (
  screeningFeatures?: ScreeningFeatures | null
): CinemaScreeningDetail[] => {
  if (!screeningFeatures) return []

  const accessibilityDetails = ACCESSIBILITY_CATEGORY_ORDER.flatMap((category) =>
    screeningFeatures.accessibility[category].flatMap((feature) => {
      const detail = ACCESSIBILITY[feature]
      if (!detail) return []

      return [
        {
          type: 'accessibility' as const,
          category,
          label: detail.name,
          description: detail.description,
        },
      ]
    })
  )

  return [
    ...getScreeningTagDetails(screeningFeatures.specialEventType, EVENT, 'special-event'),
    ...getScreeningTagDetails(screeningFeatures.video, VIDEO, 'video'),
    ...getScreeningTagDetails(screeningFeatures.audio, AUDIO, 'audio'),
    ...accessibilityDetails,
  ]
}
