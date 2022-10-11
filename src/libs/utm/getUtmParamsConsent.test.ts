import mockdate from 'mockdate'

import { ALL_OPTIONAL_COOKIES, COOKIES_BY_CATEGORY } from 'features/cookies/CookiesPolicy'
import { useCookies } from 'features/cookies/helpers/useCookies'
import { storage } from 'libs/storage'
import { getUtmParamsConsent } from 'libs/utm/getUtmParamsConsent'
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

describe('getUtmParamsConsent', () => {
  beforeEach(() => {
    storage.clear(COOKIES_CONSENT_KEY)
  })

  it('should return false for all params when user has not made consent', async () => {
    storage.saveObject(COOKIES_CONSENT_KEY, {})

    const paramsConsent = await getUtmParamsConsent()

    expect(paramsConsent).toEqual({
      acceptedTrafficCampaign: false,
      acceptedTrafficMedium: false,
      acceptedTrafficSource: false,
      acceptedCampaignDate: false,
    })
  })

  it('should return true for all params when cookies are accepted', async () => {
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
    const paramsConsent = await getUtmParamsConsent()

    expect(paramsConsent).toEqual({
      acceptedTrafficCampaign: true,
      acceptedTrafficMedium: true,
      acceptedTrafficSource: true,
      acceptedCampaignDate: true,
    })
  })

  it('should return false for all params when cookies are refused', async () => {
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
    const paramsConsent = await getUtmParamsConsent()

    expect(paramsConsent).toEqual({
      acceptedTrafficCampaign: false,
      acceptedTrafficMedium: false,
      acceptedTrafficSource: false,
      acceptedCampaignDate: false,
    })
  })

  it('should return true for all params when customization cookies are accepted', async () => {
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
    const paramsConsent = await getUtmParamsConsent()

    expect(paramsConsent).toEqual({
      acceptedTrafficCampaign: true,
      acceptedTrafficMedium: true,
      acceptedTrafficSource: true,
      acceptedCampaignDate: true,
    })
  })
})
