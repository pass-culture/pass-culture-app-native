import { ALL_OPTIONAL_COOKIES, COOKIES_BY_CATEGORY } from 'features/cookies/CookiesPolicy'
import { setMarketingParams } from 'features/cookies/helpers/setMarketingParams'
import * as StateFromPath from 'features/navigation/RootNavigator/linking/getStateFromPath'
// eslint-disable-next-line no-restricted-imports
import { firebaseAnalytics } from 'libs/firebase/analytics'
import { storage, StorageKey } from 'libs/storage'

const UTM_PARAMS = {
  utm_campaign: 'test',
  utm_content: 'test',
  utm_gen: 'marketing',
  utm_medium: 'test',
  utm_source: 'test',
  campaign_date: new Date().toISOString(),
}

const EXPECTED_STORAGE: { [key in StorageKey]?: string } = {
  traffic_campaign: UTM_PARAMS.utm_campaign,
  traffic_content: UTM_PARAMS.utm_content,
  traffic_gen: UTM_PARAMS.utm_gen,
  traffic_medium: UTM_PARAMS.utm_medium,
  traffic_source: UTM_PARAMS.utm_source,
  campaign_date: UTM_PARAMS.campaign_date,
}

const storageKeys = Object.keys(EXPECTED_STORAGE) as StorageKey[]

const setUtmParamsSpy = jest.spyOn(StateFromPath, 'setUtmParameters')

jest.useFakeTimers()

jest.mock('libs/firebase/analytics/analytics')

describe('setMarketingParams', () => {
  it('should not set marketing params when no params are available', async () => {
    await setMarketingParams(undefined, ALL_OPTIONAL_COOKIES)

    jest.runOnlyPendingTimers()

    expect(firebaseAnalytics.setDefaultEventParameters).not.toHaveBeenCalled()
    expect(setUtmParamsSpy).not.toHaveBeenCalled()
  })

  describe('user has refused customization cookies', () => {
    it('should not set marketing params', async () => {
      await setMarketingParams(UTM_PARAMS, [
        ...COOKIES_BY_CATEGORY.performance,
        ...COOKIES_BY_CATEGORY.marketing,
      ])

      jest.runOnlyPendingTimers()

      storageKeys.forEach(async (key) => {
        expect(await storage.readString(key)).toBe(null)
      })
    })

    it('should not set analytics event params', async () => {
      await setMarketingParams(UTM_PARAMS, [
        ...COOKIES_BY_CATEGORY.performance,
        ...COOKIES_BY_CATEGORY.marketing,
      ])

      jest.runOnlyPendingTimers()

      expect(firebaseAnalytics.setDefaultEventParameters).not.toHaveBeenCalled()
    })
  })

  describe('user has accepted customization cookies', () => {
    it('should set marketing params', async () => {
      await setMarketingParams(UTM_PARAMS, COOKIES_BY_CATEGORY.customization)

      jest.runOnlyPendingTimers()

      expect(setUtmParamsSpy).toHaveBeenNthCalledWith(1, UTM_PARAMS)
    })

    it('should set analytics event params', async () => {
      await setMarketingParams(UTM_PARAMS, COOKIES_BY_CATEGORY.customization)

      jest.runOnlyPendingTimers()

      expect(firebaseAnalytics.setDefaultEventParameters).toHaveBeenCalledWith({
        traffic_campaign: null,
        traffic_content: null,
        traffic_gen: null,
        traffic_medium: null,
        traffic_source: null,
      })
    })
  })
})
