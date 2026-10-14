import {
  FREE_EVENTS_DEFAULT_AROUND_RADIUS_IN_KM,
  FREE_EVENTS_DEFAULT_TITLE,
  FREE_EVENTS_HITS_PER_PAGE,
} from 'features/generalPublicHome/constants'
import { getDateRange } from 'features/generalPublicHome/helpers/getDateRange'
import { getTheme } from 'features/generalPublicHome/helpers/getTheme'
import { DateFilter, ThemeId } from 'features/generalPublicHome/types'
import { HomepageModuleType, OffersModule } from 'features/home/types'

type Params = {
  dateFilter: DateFilter
  themeId?: ThemeId
  now: Date
  aroundRadius?: number
}

// Algolia playlist parameters ignore `isEvent`: events only are kept through the date predicate
// on `offer.dates`, which non-event offers lack. Without a date filter, it starts from `now`.
export const buildFreeEventsModule = ({
  dateFilter,
  themeId,
  now,
  aroundRadius = FREE_EVENTS_DEFAULT_AROUND_RADIUS_IN_KM,
}: Params): OffersModule => {
  const theme = getTheme(themeId)
  const title = theme?.label ?? FREE_EVENTS_DEFAULT_TITLE
  const { beginningDatetime = now.toISOString(), endingDatetime } = getDateRange(dateFilter, now)

  return {
    type: HomepageModuleType.OffersModule,
    id: `generalPublicHome-freeEvents-${themeId ?? 'all'}`,
    title,
    displayParameters: { title, layout: 'two-items', minOffers: 1 },
    offersModuleParameters: [
      {
        title,
        priceMin: 0,
        priceMax: 0,
        isGeolocated: true,
        aroundRadius,
        beginningDatetime,
        endingDatetime,
        categories: theme?.categories,
        hitsPerPage: FREE_EVENTS_HITS_PER_PAGE,
      },
    ],
  }
}
