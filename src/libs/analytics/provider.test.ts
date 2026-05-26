// eslint-disable-next-line no-restricted-imports
import { resetDedupCache } from 'libs/analytics/eventDeduplication'
// eslint-disable-next-line no-restricted-imports
import { analytics } from 'libs/analytics/provider'
import { LocationType } from 'libs/analytics/types'
// eslint-disable-next-line no-restricted-imports
import { firebaseAnalytics } from 'libs/firebase/analytics/analytics'
import { AnalyticsEvent } from 'libs/firebase/analytics/events'
import { LocationMode } from 'libs/location/types'
import { locationActions } from 'libs/locationV2/location.store'
import { act } from 'tests/utils'

const EVENT_PARAMS = { param: 1 }
const SCREEN_NAME = 'Home'

jest.unmock('libs/analytics/provider')

jest.mock('libs/firebase/analytics/analytics')

describe('analyticsProvider - logEvent', () => {
  afterEach(() => {
    locationActions.setLocationMode(LocationMode.EVERYWHERE)
    resetDedupCache()
  })

  describe('with firebase', () => {
    it.each`
      locationType              | locationMode
      ${'UserGeolocation'}      | ${LocationMode.AROUND_ME}
      ${'UserSpecificLocation'} | ${LocationMode.AROUND_PLACE}
      ${'undefined'}            | ${LocationMode.EVERYWHERE}
    `(
      'should log firebase event with locationType=$locationType and locationMode=$locationMode',
      async ({
        locationType,
        locationMode,
      }: {
        locationType: LocationType
        locationMode: LocationMode
      }) => {
        locationActions.setLocationMode(locationMode)

        await analytics.logEvent({ firebase: AnalyticsEvent.CONSULT_OFFER }, EVENT_PARAMS)

        expect(firebaseAnalytics.logEvent).toHaveBeenCalledWith(AnalyticsEvent.CONSULT_OFFER, {
          ...EVENT_PARAMS,
          locationType,
        })
      }
    )

    it('should log screen view when logScreenView is called', async () => {
      await analytics.logScreenView(SCREEN_NAME)
      await act(() => {})

      expect(firebaseAnalytics.logScreenView).toHaveBeenCalledWith(SCREEN_NAME, 'undefined')
    })
  })

  describe('deduplication', () => {
    it('should not send the same event twice within the dedup window', async () => {
      await analytics.logEvent({ firebase: AnalyticsEvent.CONSULT_OFFER }, EVENT_PARAMS)
      await analytics.logEvent({ firebase: AnalyticsEvent.CONSULT_OFFER }, EVENT_PARAMS)

      expect(firebaseAnalytics.logEvent).toHaveBeenCalledTimes(1)
    })

    it('should send events with different params', async () => {
      await analytics.logEvent({ firebase: AnalyticsEvent.CONSULT_OFFER }, { param: 1 })
      await analytics.logEvent({ firebase: AnalyticsEvent.CONSULT_OFFER }, { param: 2 })

      expect(firebaseAnalytics.logEvent).toHaveBeenCalledTimes(2)
    })

    it('should not send the same screen view twice within the dedup window', async () => {
      await analytics.logScreenView(SCREEN_NAME)
      await analytics.logScreenView(SCREEN_NAME)
      await act(() => {})

      expect(firebaseAnalytics.logScreenView).toHaveBeenCalledTimes(1)
    })

    it('should send different screen views', async () => {
      await analytics.logScreenView('Home')
      await analytics.logScreenView('Offer')
      await act(() => {})

      expect(firebaseAnalytics.logScreenView).toHaveBeenCalledTimes(2)
    })
  })
})
