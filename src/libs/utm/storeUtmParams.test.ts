import mockdate from 'mockdate'

import { CookieNameEnum } from 'features/cookies/enums'
import { storage } from 'libs/storage'
import { storeUtmParams } from 'libs/utm/storeUtmParams'

const COOKIES_CONSENT_KEY = 'cookies'
const Today = new Date(2022, 9, 29)
mockdate.set(Today)
const expectedParams = { campaign: 'campaign', medium: 'medium', source: 'source' }

describe('storeUtmParams', () => {
  beforeEach(async () => {
    await storage.clear(COOKIES_CONSENT_KEY)
  })

  it('should not save utmParams to storage when there are no params', async () => {
    await storeUtmParams({ campaign: null })
    const utmParams = await getUtmParamsFromStorage()

    expect(utmParams).toEqual({
      campaign: null,
      medium: null,
      source: null,
      campaignDate: null,
    })
  })

  it('should store utmParams to local storage', async () => {
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
