import { ScreeningFeatures } from 'api/gen'
import { CINEMA_SCREENING_ACCESSIBILITY_ENTRIES } from 'features/offer/components/CinemaScreeningCard/constants'
import { getCinemaScreeningFeaturesProps } from 'features/offer/components/CinemaScreeningCard/getCinemaScreeningFeaturesProps'

export const getDisplayedCinemaScreeningFeatures = (features: ScreeningFeatures) => {
  const { specialEvent, video, audio, accessibility } = getCinemaScreeningFeaturesProps(features)
  const mediaTags = [...video, ...audio]
  const displayedAccessibility = CINEMA_SCREENING_ACCESSIBILITY_ENTRIES.filter(
    ({ key }) => accessibility[key]?.length
  )

  return { specialEvent, mediaTags, displayedAccessibility }
}
