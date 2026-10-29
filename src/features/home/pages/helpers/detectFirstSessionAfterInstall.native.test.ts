import { COOKIES_CONSENT_KEY } from 'features/cookies/helpers/cookiesConsentKey'
import { detectFirstSessionAfterInstall } from 'features/home/pages/helpers/detectFirstSessionAfterInstall'
import {
  spectacleVivantAdjustEventsStoreActions,
  spectacleVivantAdjustEventsStoreSelectors,
} from 'features/home/pages/helpers/spectacleVivantAdjustEventsStore'
import { storage } from 'libs/storage'

describe('detectFirstSessionAfterInstall', () => {
  beforeEach(async () => {
    await storage.clear('has_launched_app_once')
    await storage.clear(COOKIES_CONSENT_KEY)
    spectacleVivantAdjustEventsStoreActions.resetForTests()
  })

  it('should detect the first session after install at the first launch', async () => {
    await detectFirstSessionAfterInstall()

    expect(spectacleVivantAdjustEventsStoreSelectors.selectIsFirstSessionAfterInstall()).toBe(true)
  })

  it('should not detect the first session after install at the next launches', async () => {
    await detectFirstSessionAfterInstall()
    spectacleVivantAdjustEventsStoreActions.resetForTests()

    await detectFirstSessionAfterInstall()

    expect(spectacleVivantAdjustEventsStoreSelectors.selectIsFirstSessionAfterInstall()).toBe(false)
  })

  describe('when the app is updated from a version that did not save the first launch', () => {
    it('should not detect the first session after install when a cookies choice is saved', async () => {
      await storage.saveObject(COOKIES_CONSENT_KEY, {
        buildVersion: 10_000_000,
        deviceId: 'deviceId',
        choiceDatetime: '2026-10-01T10:00:00.000Z',
        consent: { mandatory: [], accepted: [], refused: [] },
      })

      await detectFirstSessionAfterInstall()

      expect(spectacleVivantAdjustEventsStoreSelectors.selectIsFirstSessionAfterInstall()).toBe(
        false
      )
    })

    it('should not detect the first session after install at the next launches, even without the cookies choice', async () => {
      await storage.saveObject(COOKIES_CONSENT_KEY, {
        buildVersion: 10_000_000,
        deviceId: 'deviceId',
      })
      await detectFirstSessionAfterInstall()
      await storage.clear(COOKIES_CONSENT_KEY)
      spectacleVivantAdjustEventsStoreActions.resetForTests()

      await detectFirstSessionAfterInstall()

      expect(spectacleVivantAdjustEventsStoreSelectors.selectIsFirstSessionAfterInstall()).toBe(
        false
      )
    })

    it('should not detect the first session after install when the cookies consent has expired', async () => {
      // an expired consent keeps the record, without consent nor choice date
      await storage.saveObject(COOKIES_CONSENT_KEY, {
        buildVersion: 10_000_000,
        deviceId: 'deviceId',
      })

      await detectFirstSessionAfterInstall()

      expect(spectacleVivantAdjustEventsStoreSelectors.selectIsFirstSessionAfterInstall()).toBe(
        false
      )
    })
  })
})
