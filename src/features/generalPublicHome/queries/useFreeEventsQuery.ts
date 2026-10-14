import { format } from 'date-fns'
import { useMemo } from 'react'

import { buildFreeEventsModule } from 'features/generalPublicHome/helpers/buildFreeEventsModule'
import { DateFilter, ThemeId } from 'features/generalPublicHome/types'
import { useGetOffersModuleDataQuery } from 'features/home/queries/useGetOffersDataQuery'
import { ModuleData, OffersModule } from 'features/home/types'
import { VenueHit } from 'libs/algolia/types'
import { useLocationConfiguration, useLocationMode } from 'libs/locationV2/location.store'
import { Offer } from 'shared/offer/types'

type Params = {
  dateFilter: DateFilter
  themeId?: ThemeId
}

type FreeEventsQueryResult = {
  offers: Offer[]
  isLoading: boolean
  module: OffersModule
  data: ModuleData | undefined
}

const NO_OFFERS: Offer[] = []

const isOfferList = (items: Offer[] | VenueHit[]): items is Offer[] => {
  const firstItem = items[0]
  return firstItem !== undefined && 'objectID' in firstItem
}

// `now` ends up in the query key: it must only change when the day does, not on every render
const useNowStablePerDay = (): Date => {
  const today = format(new Date(), 'yyyy-MM-dd')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => new Date(), [today])
}

export const useFreeEventsQuery = ({ dateFilter, themeId }: Params): FreeEventsQueryResult => {
  const now = useNowStablePerDay()
  const locationMode = useLocationMode()
  const { radius: aroundRadius } = useLocationConfiguration(locationMode)

  const module = useMemo(
    () => buildFreeEventsModule({ dateFilter, themeId, now, aroundRadius }),
    [dateFilter, themeId, now, aroundRadius]
  )
  const { data, isLoading } = useGetOffersModuleDataQuery(module)
  const playlistItems = data?.playlistItems ?? NO_OFFERS

  return {
    offers: isOfferList(playlistItems) ? playlistItems : NO_OFFERS,
    isLoading,
    module,
    data,
  }
}
