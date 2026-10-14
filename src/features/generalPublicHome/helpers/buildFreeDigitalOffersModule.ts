import {
  FREE_DIGITAL_PLAYLISTS,
  FREE_EVENTS_HITS_PER_PAGE,
} from 'features/generalPublicHome/constants'
import { FreeDigitalPlaylistId } from 'features/generalPublicHome/types'
import { HomepageModuleType, OffersModule } from 'features/home/types'

// Online-only subcategories: no date nor location constraint, and no `isDigital` filter (its facet matches no offer)
export const buildFreeDigitalOffersModule = (playlistId: FreeDigitalPlaylistId): OffersModule => {
  const { title, subtitle, subcategories } = FREE_DIGITAL_PLAYLISTS[playlistId]

  return {
    type: HomepageModuleType.OffersModule,
    id: `generalPublicHome-${playlistId}`,
    title,
    displayParameters: { title, subtitle, layout: 'three-items', minOffers: 1 },
    offersModuleParameters: [
      {
        title,
        priceMin: 0,
        priceMax: 0,
        subcategories,
        hitsPerPage: FREE_EVENTS_HITS_PER_PAGE,
      },
    ],
  }
}
