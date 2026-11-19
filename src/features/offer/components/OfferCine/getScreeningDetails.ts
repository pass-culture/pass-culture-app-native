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

const buildScreeningTagDetail = (
  detail: ScreeningDetailContent,
  category: 'special-event' | 'video' | 'audio'
): CinemaScreeningDetail => ({
  type: 'tag',
  category,
  label: detail.name,
  description: detail.description,
})

export const getScreeningDetails = (features: string[] = []): CinemaScreeningDetail[] => {
  const eventDetails = features.flatMap((feature) => {
    const detail = EVENT[feature]
    return detail ? [buildScreeningTagDetail(detail, 'special-event')] : []
  })
  const videoDetails = features.flatMap((feature) => {
    const detail = VIDEO[feature]
    return detail ? [buildScreeningTagDetail(detail, 'video')] : []
  })
  const audioDetails = features.flatMap((feature) => {
    const detail = AUDIO[feature]
    return detail ? [buildScreeningTagDetail(detail, 'audio')] : []
  })

  const accessibilityByCategory: Record<
    CinemaScreeningAccessibilityCategory,
    CinemaScreeningDetail[]
  > = {
    visual: [],
    audio: [],
    mental: [],
    motor: [],
  }

  features.forEach((feature) => {
    const detail = ACCESSIBILITY[feature]
    if (!detail) return

    accessibilityByCategory[detail.category].push({
      type: 'accessibility',
      category: detail.category,
      label: detail.name,
      description: detail.description,
    })
  })

  const accessibilityDetails = ACCESSIBILITY_CATEGORY_ORDER.flatMap(
    (category) => accessibilityByCategory[category]
  )

  return [...eventDetails, ...videoDetails, ...audioDetails, ...accessibilityDetails]
}
