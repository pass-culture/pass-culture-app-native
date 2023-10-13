// eslint-disable-next-line no-restricted-imports
import { amplitude } from 'libs/amplitude'
import { AmplitudeEvent } from 'libs/amplitude/events'
import { analytics } from 'libs/analytics'
// eslint-disable-next-line no-restricted-imports
import { firebaseAnalytics } from 'libs/firebase/analytics'
import { AnalyticsEvent } from 'libs/firebase/analytics/events'
import { storage } from 'libs/storage'

const EVENT_PARAMS = { param: 1 }
const SCREEN_NAME = 'Home'

jest.unmock('libs/analytics/provider')

describe('analyticsProvider - logEvent', () => {
  describe('with firebase', () => {
    it('should log event when firebase event name is specified', async () => {
      await analytics.logEvent({ firebase: AnalyticsEvent.CONSULT_OFFER }, EVENT_PARAMS)
      expect(firebaseAnalytics.logEvent).toHaveBeenCalledWith(AnalyticsEvent.CONSULT_OFFER, {
        ...EVENT_PARAMS,
        locationType: 'Undefined',
      })
    })

    it.each`
      locationType
      ${'Undefined'}
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

    it('should not log event when firebase event name is not specified', () => {
      analytics.logEvent({ amplitude: AmplitudeEvent.ONBOARDING_STARTED })

      expect(firebaseAnalytics.logEvent).not.toHaveBeenCalled()
    })

    it('should log screen view when logScreenView is called', () => {
      analytics.logScreenView(SCREEN_NAME)
      expect(firebaseAnalytics.logScreenView).toHaveBeenCalledWith(SCREEN_NAME)
    })
  })

  describe('with amplitude', () => {
    it('should log event when amplitude event name is specified', () => {
      analytics.logEvent({ amplitude: AmplitudeEvent.ONBOARDING_STARTED }, EVENT_PARAMS)
      expect(amplitude.logEvent).toHaveBeenCalledWith(
        AmplitudeEvent.ONBOARDING_STARTED,
        EVENT_PARAMS
      )
    })

    it('should not log event when amplitude event name is not specified', () => {
      analytics.logEvent({ firebase: AnalyticsEvent.CONSULT_OFFER })
      expect(amplitude.logEvent).not.toHaveBeenCalledWith()
    })

    it('should not log event when logScreenView is called', () => {
      analytics.logScreenView(SCREEN_NAME)
      expect(amplitude.logEvent).not.toHaveBeenCalledWith()
    })
  })
})
