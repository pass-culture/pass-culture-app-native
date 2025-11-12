import { OnlineOfflinePlatformChoicesEnum, SubcategoryIdEnum, SubcategoryIdEnumv2 } from 'api/gen'
import { LocationMode, Position } from 'libs/location/types'
import { formatDistance } from 'libs/parsers/formatDistance'
import { SuggestedPlace } from 'libs/place/types'
import { PLACEHOLDER_DATA } from 'libs/subcategories/placeholderData'

export type UserProps = {
  userLocation: Position
  selectedPlace: SuggestedPlace | null
  selectedLocationMode: LocationMode
}

const isOnlineOffer = (subcategoryId?: SubcategoryIdEnumv2 | SubcategoryIdEnum): boolean => {
  if (!subcategoryId) return false
  const subcategory = PLACEHOLDER_DATA.subcategories.find((subcat) => subcat.id === subcategoryId)
  return subcategory?.onlineOfflinePlatform === OnlineOfflinePlatformChoicesEnum.ONLINE
}

export const getDistance = (
  offerPosition: {
    lat?: number | null
    lng?: number | null
  },
  user: UserProps,
  subcategoryId?: SubcategoryIdEnum
): string | undefined => {
  if (!user.userLocation || isOnlineOffer(subcategoryId)) return undefined
  if (
    user.selectedLocationMode === LocationMode.AROUND_PLACE &&
    (user.selectedPlace?.type == 'municipality' || user.selectedPlace?.type == 'locality')
  ) {
    return undefined
  }
  return formatDistance(offerPosition, user.userLocation)
}
