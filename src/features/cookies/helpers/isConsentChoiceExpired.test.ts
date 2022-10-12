import mockdate from 'mockdate'

import { isConsentChoiceExpired } from 'features/cookies/helpers/isConsentChoiceExpired'
import { storage } from 'libs/storage'

const COOKIES_CONSENT_KEY = 'cookies'
const TODAY = new Date('2022-09-12')
const LAST_WEEK = new Date('2022-09-05')
// 1 month = 30 days
const THREE_MONTHS_AGO = new Date('2022-06-14')
const SIX_MONTHS_MINUS_A_SECOND_AGO = new Date('2022-03-16T00:00:01')
const EXACTLY_SIX_MONTHS_AGO = new Date('2022-03-16')
const SIX_MONTHS_AND_ONE_SECOND_AGO = new Date('2022-03-15T23:59:59')
const EIGHT_MONTHS_AGO = new Date('2021-01-15')
const ONE_YEAR_AGO = new Date('2021-09-12')
mockdate.set(TODAY)

describe('isConsentChoiceExpired', () => {
  it.each([TODAY, LAST_WEEK, THREE_MONTHS_AGO, SIX_MONTHS_MINUS_A_SECOND_AGO])(
    'should not be expired if user has made choice less than 6 months ago',
    (choiceDatetime) => {
      storage.saveObject(COOKIES_CONSENT_KEY, {
        choiceDatetime: choiceDatetime.toISOString(),
      })

      const hasExpired = isConsentChoiceExpired(choiceDatetime)
      expect(hasExpired).toEqual(false)
    }
  )

  it.each([EXACTLY_SIX_MONTHS_AGO, SIX_MONTHS_AND_ONE_SECOND_AGO, EIGHT_MONTHS_AGO, ONE_YEAR_AGO])(
    'should be expired if user has made choice 6 months ago or more than 6 months ago',
    (choiceDatetime) => {
      storage.saveObject(COOKIES_CONSENT_KEY, {
        choiceDatetime: choiceDatetime.toISOString(),
      })

      const hasExpired = isConsentChoiceExpired(choiceDatetime)
      expect(hasExpired).toEqual(true)
    }
  )
})
