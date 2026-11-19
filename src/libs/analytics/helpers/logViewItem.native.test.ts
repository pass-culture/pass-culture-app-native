import mockdate from 'mockdate'

// eslint-disable-next-line no-restricted-imports
import { asHomeEntryId, asOfferId, logViewItem } from 'libs/analytics/helpers/logViewItem'
import { analytics } from 'libs/analytics/provider'
import { AnalyticsEvent } from 'libs/firebase/analytics/events'

mockdate.set(new Date('2026-11-04T10:00:00.000Z'))

describe('logViewItem', () => {
  it('should log a ViewItem event with the log timestamp', () => {
    const params = {
      origin: 'home',
      playlistIndex: 1,
      index: 0,
      type: 'offer',
      id: asOfferId('102280'),
      playlistId: asHomeEntryId('moduleId'),
      originId: asHomeEntryId('homeEntryId'),
    } as const

    logViewItem(params)

    expect(analytics.logEvent).toHaveBeenCalledWith(
      { firebase: AnalyticsEvent.VIEW_ITEM },
      { ...params, eventTimestamp: '2026-11-04T10:00:00.000Z' }
    )
  })
})
