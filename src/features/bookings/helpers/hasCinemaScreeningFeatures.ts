import { ScreeningFeatures } from 'api/gen'
import { getDisplayedCinemaScreeningFeatures } from 'features/bookings/helpers/getDisplayedCinemaScreeningFeatures'

export const hasCinemaScreeningFeatures = (features: ScreeningFeatures): boolean => {
  const { specialEvent, mediaTags, displayedAccessibility } =
    getDisplayedCinemaScreeningFeatures(features)

  return !!specialEvent || mediaTags.length > 0 || displayedAccessibility.length > 0
}
