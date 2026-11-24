import { FavoriteType } from 'features/favorites/enum'
import { Tab } from 'features/favorites/types'

export const FAVORITE_TYPE_BY_TAB: Record<Tab, FavoriteType> = {
  [Tab.OFFERS]: FavoriteType.OFFER,
  [Tab.VENUES]: FavoriteType.VENUE,
  [Tab.ARTISTS]: FavoriteType.ARTIST,
}
