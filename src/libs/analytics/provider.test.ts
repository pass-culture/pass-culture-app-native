// eslint-disable-next-line no-restricted-imports
import { analytics } from 'libs/analytics/provider'
// eslint-disable-next-line no-restricted-imports
import { firebaseAnalytics } from 'libs/firebase/analytics/analytics'
import { AnalyticsEvent } from 'libs/firebase/analytics/events'
import { storage } from 'libs/storage'
import { act } from 'tests/utils'

const EVENT_PARAMS = { param: 1 }
const SCREEN_NAME = 'Home'

jest.unmock('libs/analytics/provider')

jest.mock('libs/firebase/analytics/analytics')

describe('analyticsProvider - logEvent', () => {
  afterEach(() => {
    storage.clear('location_type')
  })

  describe('with firebase', () => {
    it('should log event when firebase event name is specified', async () => {
      await analytics.logEvent({ firebase: AnalyticsEvent.CONSULT_OFFER }, EVENT_PARAMS)

      expect(firebaseAnalytics.logEvent).toHaveBeenCalledWith(AnalyticsEvent.CONSULT_OFFER, {
        ...EVENT_PARAMS,
        locationType: 'undefined',
      })
    })

    it.each`
      locationType
      ${'UserGeolocation'}
      ${'UserSpecificLocation'}
    `('should log firebase event with locationType=$locationType', async ({ locationType }) => {
      await storage.saveString('location_type', locationType)

      await analytics.logEvent({ firebase: AnalyticsEvent.CONSULT_OFFER }, EVENT_PARAMS)

      expect(firebaseAnalytics.logEvent).toHaveBeenCalledWith(AnalyticsEvent.CONSULT_OFFER, {
        ...EVENT_PARAMS,
        locationType: locationType,
      })
    })

    it('should log firebase event with locationType: undefined when locationType is cleared', async () => {
      await storage.clear('location_type')

      await analytics.logEvent({ firebase: AnalyticsEvent.CONSULT_OFFER }, EVENT_PARAMS)

      expect(firebaseAnalytics.logEvent).toHaveBeenCalledWith(AnalyticsEvent.CONSULT_OFFER, {
        ...EVENT_PARAMS,
        locationType: 'undefined',
      })
    })

    it('should log screen view when logScreenView is called', async () => {
      analytics.logScreenView(SCREEN_NAME)
      await act(() => {})

      expect(firebaseAnalytics.logScreenView).toHaveBeenCalledWith(SCREEN_NAME, 'undefined')
    })

    it('should set default event parameters when setEventLocationType is called', async () => {
      analytics.setEventLocationType()
      await act(() => {})

      expect(firebaseAnalytics.setDefaultEventParameters).toHaveBeenCalledWith({
        locationType: 'undefined',
      })
    })
  })
})
