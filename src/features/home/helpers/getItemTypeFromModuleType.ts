import { HomepageModuleType } from 'features/home/types'

export const getItemTypeFromModuleType = (
  moduleType: string
): 'offer' | 'venue' | 'artist' | 'unknown' => {
  switch (moduleType) {
    case HomepageModuleType.OffersModule:
    case HomepageModuleType.RecommendedOffersModule:
    case HomepageModuleType.HighlightOfferModule:
      return 'offer'
    case HomepageModuleType.VenuesModule:
    case HomepageModuleType.VenueMapModule:
      return 'venue'
    default:
      return 'unknown'
  }
}
