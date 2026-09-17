import { analytics } from 'libs/analytics/provider'
import { AnalyticsEvent } from 'libs/firebase/analytics/events'

type ViewItemCommonParams = {
  playlistIndex: number
  index: number
  type: 'offer' | 'venue' | 'artist'
  id: string
  moduleId: string
}

export type ViewItemParams =
  | (ViewItemCommonParams & {
      origin: 'home'
      homeEntryId: string
    })
  | (ViewItemCommonParams & {
      origin: 'search'
      searchId: string
    })
  | (ViewItemCommonParams & {
      origin: 'offer' | 'artist' | 'venue' | 'venueMap'
    })

export const logViewItem = (params: ViewItemParams) => {
  void analytics.logEvent(
    { firebase: AnalyticsEvent.VIEW_ITEM },
    {
      viewedAt: new Date().toISOString(),
      ...params,
    }
  )
}
