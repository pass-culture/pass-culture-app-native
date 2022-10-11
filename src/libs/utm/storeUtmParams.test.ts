import mockdate from 'mockdate'

import { ALL_OPTIONAL_COOKIES, COOKIES_BY_CATEGORY } from 'features/cookies/CookiesPolicy'
import { CookieNameEnum } from 'features/cookies/enums'
import { useCookies } from 'features/cookies/helpers/useCookies'
import { storage } from 'libs/storage'
import { storeUtmParams } from 'libs/utm/storeUtmParams'
import { act, flushAllPromisesWithAct, renderHook } from 'tests/utils'

const mockSettings = jest.fn().mockReturnValue({ data: { appEnableCookiesV2: true } })
jest.mock('features/auth/settings', () => ({
  useAppSettings: jest.fn(() => mockSettings()),
}))

jest.mock('features/profile/api')
jest.mock('api/api')

const COOKIES_CONSENT_KEY = 'cookies'
const Today = new Date(2022, 9, 29)
mockdate.set(Today)
const expectedParams = { campaign: 'campaign', medium: 'medium', source: 'source' }

describe('storeUtmParams', () => {
  beforeEach(() => {
    storage.clear(COOKIES_CONSENT_KEY)
    storage.clear(CookieNameEnum.TRAFFIC_CAMPAIGN)
    storage.clear(CookieNameEnum.TRAFFIC_MEDIUM)
    storage.clear(CookieNameEnum.TRAFFIC_SOURCE)
    storage.clear(CookieNameEnum.CAMPAIGN_DATE)
  })

  it('should save utmParams to storage if cookies are accepted', async () => {
    const { result } = renderHook(useCookies)
    const { setCookiesConsent } = result.current

    act(() => {
      setCookiesConsent({
        mandatory: COOKIES_BY_CATEGORY.essential,
        accepted: ALL_OPTIONAL_COOKIES,
        refused: [],
      })
    })
    await flushAllPromisesWithAct()
    await storeUtmParams(expectedParams)
    const utmParams = await getUtmParamsFromStorage()

    expect(utmParams).toEqual({ ...expectedParams, campaignDate: Today.valueOf().toString() })
  })

  it('should not save utmParams to storage if cookies are accepted', async () => {
    const { result } = renderHook(useCookies)
    const { setCookiesConsent } = result.current

    act(() => {
      setCookiesConsent({
        mandatory: COOKIES_BY_CATEGORY.essential,
        accepted: [],
        refused: ALL_OPTIONAL_COOKIES,
      })
    })
    await flushAllPromisesWithAct()
    await storeUtmParams(expectedParams)
    const utmParams = await getUtmParamsFromStorage()

    expect(utmParams).toEqual({ campaign: null, medium: null, source: null, campaignDate: null })
  })

  it('should save utmParams if customization cookies are accepted', async () => {
    const { result } = renderHook(useCookies)
    const { setCookiesConsent } = result.current

    act(() => {
      setCookiesConsent({
        mandatory: COOKIES_BY_CATEGORY.essential,
        accepted: COOKIES_BY_CATEGORY.customization,
        refused: [...COOKIES_BY_CATEGORY.marketing, ...COOKIES_BY_CATEGORY.performance],
      })
    })
    await flushAllPromisesWithAct()
    await storeUtmParams(expectedParams)
    const utmParams = await getUtmParamsFromStorage()

    expect(utmParams).toEqual({ ...expectedParams, campaignDate: Today.valueOf().toString() })
  })
})

const getUtmParamsFromStorage = async () => {
  const [campaign, medium, source, campaignDate] = await storage.readMultiString([
    CookieNameEnum.TRAFFIC_CAMPAIGN,
    CookieNameEnum.TRAFFIC_MEDIUM,
    CookieNameEnum.TRAFFIC_SOURCE,
    CookieNameEnum.CAMPAIGN_DATE,
  ])
  return {
    campaign: campaign[1],
    medium: medium[1],
    source: source[1],
    campaignDate: campaignDate[1],
  }
}
