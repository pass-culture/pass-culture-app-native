import mockdate from 'mockdate'

import { ALL_OPTIONAL_COOKIES, COOKIES_BY_CATEGORY } from 'features/cookies/CookiesPolicy'
import { useCookies } from 'features/cookies/helpers/useCookies'
import { storage } from 'libs/storage'
import { getUtmParamsConsent } from 'libs/utm/getUtmParamsConsent'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook } from 'tests/utils'

jest.mock('queries/profile/usePatchProfileMutation')
jest.mock('api/api')

const COOKIES_CONSENT_KEY = 'cookies'
const Today = new Date(2022, 9, 29)
mockdate.set(Today)

jest.mock('libs/firebase/analytics/analytics')

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
    const { result } = renderUseCookies()

    await act(async () => {
      result.current.setCookiesConsent({
        mandatory: COOKIES_BY_CATEGORY.essential,
        accepted: ALL_OPTIONAL_COOKIES,
        refused: [],
      })
    })

    const paramsConsent = await getUtmParamsConsent()

    expect(paramsConsent).toEqual({
      acceptedTrafficCampaign: true,
      acceptedTrafficMedium: true,
      acceptedTrafficSource: true,
      acceptedCampaignDate: true,
    })
  })

  it('should return false for all params when cookies are refused', async () => {
    const { result } = renderUseCookies()

    await act(async () => {
      result.current.setCookiesConsent({
        mandatory: COOKIES_BY_CATEGORY.essential,
        accepted: [],
        refused: ALL_OPTIONAL_COOKIES,
      })
    })

    const paramsConsent = await getUtmParamsConsent()

    expect(paramsConsent).toEqual({
      acceptedTrafficCampaign: false,
      acceptedTrafficMedium: false,
      acceptedTrafficSource: false,
      acceptedCampaignDate: false,
    })
  })

  it('should return true for all params when customization cookies are accepted', async () => {
    const { result } = renderUseCookies()

    await act(async () => {
      result.current.setCookiesConsent({
        mandatory: COOKIES_BY_CATEGORY.essential,
        accepted: COOKIES_BY_CATEGORY.customization,
        refused: [...COOKIES_BY_CATEGORY.marketing, ...COOKIES_BY_CATEGORY.performance],
      })
    })

    const paramsConsent = await getUtmParamsConsent()

    expect(paramsConsent).toEqual({
      acceptedTrafficCampaign: true,
      acceptedTrafficMedium: true,
      acceptedTrafficSource: true,
      acceptedCampaignDate: true,
    })
  })
})

const renderUseCookies = () =>
  renderHook(useCookies, {
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
