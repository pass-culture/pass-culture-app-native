import { ALL_OPTIONAL_COOKIES, COOKIES_BY_CATEGORY } from 'features/cookies/CookiesPolicy'
import { setMarketingParams } from 'features/cookies/helpers/setMarketingParams'
// eslint-disable-next-line no-restricted-imports
import { firebaseAnalytics } from 'libs/firebase/analytics/analytics'
import { storage, StorageKey } from 'libs/storage'
import * as getUtmParamsConsentAPI from 'libs/utm/getUtmParamsConsent'
import { act } from 'tests/utils'

const UTM_PARAMS = {
  utm_campaign: 'test',
  utm_content: 'test',
  utm_gen: 'marketing',
  utm_medium: 'test',
  utm_source: 'test',
  campaign_date: new Date().getTime().toString(),
}

const EXPECTED_STORAGE: { [key in StorageKey]?: string } = {
  traffic_campaign: UTM_PARAMS.utm_campaign,
  traffic_content: UTM_PARAMS.utm_content,
  traffic_gen: UTM_PARAMS.utm_gen,
  traffic_medium: UTM_PARAMS.utm_medium,
  traffic_source: UTM_PARAMS.utm_source,
  campaign_date: UTM_PARAMS.campaign_date,
}

const storageKeys = Object.keys(EXPECTED_STORAGE)
const storageKeysWithoutDate = Object.keys(EXPECTED_STORAGE).filter(
  (key) => key !== 'campaign_date'
)
const { campaign_date: _campaign_date, ...EXPECTED_STORAGE_WITHOUT_DATE } = EXPECTED_STORAGE

const spyOnGetUtmParamsConsent = jest.spyOn(getUtmParamsConsentAPI, 'getUtmParamsConsent')

jest.useFakeTimers()

jest.mock('libs/firebase/analytics/analytics')

describe('setMarketingParams', () => {
  beforeEach(() => {
    spyOnGetUtmParamsConsent.mockResolvedValueOnce({
      acceptedCampaignDate: true,
      acceptedTrafficCampaign: true,
      acceptedTrafficMedium: true,
      acceptedTrafficSource: true,
    })
  })

  it('should not set marketing params when no params are available', async () => {
    await setMarketingParams(undefined, ALL_OPTIONAL_COOKIES)

    jest.runOnlyPendingTimers()

    expect(firebaseAnalytics.setDefaultEventParameters).not.toHaveBeenCalled()
    expect(await storage.readMultiString(storageKeys)).not.toEqual(EXPECTED_STORAGE)
  })

  describe('user has refused customization cookies', () => {
    it('should not set marketing params', async () => {
      await setMarketingParams(UTM_PARAMS, [
        ...COOKIES_BY_CATEGORY.performance,
        ...COOKIES_BY_CATEGORY.marketing,
      ])

      jest.runOnlyPendingTimers()

      await act(() => {}) // Because of the "await" in the setTimeout

      expect(Object.fromEntries(await storage.readMultiString(storageKeys))).toEqual({
        traffic_campaign: null,
        traffic_content: null,
        traffic_gen: null,
        traffic_medium: null,
        traffic_source: null,
        campaign_date: null,
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

      await act(() => {}) // Because of the "await" in the setTimeout

      expect(Object.fromEntries(await storage.readMultiString(storageKeysWithoutDate))).toEqual(
        EXPECTED_STORAGE_WITHOUT_DATE
      )
      // setTimeout creates delay so we have to round to ignore difference.
      expect(
        Math.round(Number(await storage.readString('campaign_date')) / 100).toString()
      ).toEqual(Math.round(new Date().getTime() / 100).toString())
    })

    it('should set analytics event params', async () => {
      await setMarketingParams(UTM_PARAMS, COOKIES_BY_CATEGORY.customization)

      jest.runOnlyPendingTimers()

      await act(() => {}) // Because of the "await" in the setTimeout

      expect(firebaseAnalytics.setDefaultEventParameters).toHaveBeenCalledWith({
        traffic_campaign: 'test',
        traffic_content: 'test',
        traffic_gen: 'marketing',
        traffic_medium: 'test',
        traffic_source: 'test',
      })
    })
  })
})
