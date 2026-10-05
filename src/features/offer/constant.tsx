import { Platform, ViewStyle } from 'react-native'

import { PlaylistType } from 'features/offer/enums'

export const MAX_WIDTH_VIDEO = 540
export const MAX_HEIGHT_VIDEO_PORTRAIT = 540

export const PORTRAIT_PLAYER_STYLE: ViewStyle = {
  alignSelf: Platform.OS === 'web' ? 'flex-start' : 'center',
}

export const OFFER_SIMILAR_PLAYLIST_TITLES: Partial<Record<PlaylistType, string>> = {
  [PlaylistType.SAME_CATEGORY_SIMILAR_OFFERS]: 'Les fans aiment aussi',
  [PlaylistType.BOOKS_SAME_CATEGORY_SIMILAR_OFFERS]: 'Dans la même catégorie',
  [PlaylistType.OTHER_CATEGORIES_SIMILAR_OFFERS]: 'Ça peut aussi te plaire',
}
