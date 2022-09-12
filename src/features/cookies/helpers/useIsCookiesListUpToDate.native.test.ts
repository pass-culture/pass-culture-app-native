import mockdate from 'mockdate'

import {
  CookiesLastUpdate,
  useIsCookiesListUpToDate,
} from 'features/cookies/helpers/useIsCookiesListUpToDate'
import * as Firestore from 'libs/firebase/firestore/getCookiesLastUpdate'
import { storage } from 'libs/storage'
import { flushAllPromisesWithAct, renderHook } from 'tests/utils'

import Package from '../../../../package.json'

const MILLISECONDS_IN_A_DAY = 24 * 60 * 60 * 1000
const COOKIES_CONSENT_KEY = 'cookies_consent'
const TODAY = new Date('2022-09-16')
const TOMORROW = new Date(TODAY.getTime() + MILLISECONDS_IN_A_DAY)
const A_SECOND_AGO = new Date(TODAY.getTime() - 1000)
const LAST_WEEK = new Date(TODAY.getTime() - 7 * MILLISECONDS_IN_A_DAY)
const THREE_MONTHS_AGO = new Date(TODAY.getTime() - 180 * MILLISECONDS_IN_A_DAY)
mockdate.set(TODAY)

const defaultMockFirestore: CookiesLastUpdate = {
  lastUpdated: TODAY,
  lastUpdateBuildVersion: Package.build,
}

const mockFirestore = jest
  .spyOn(Firestore, 'getCookiesLastUpdate')
  .mockResolvedValue(defaultMockFirestore)

describe('isCookiesListUpToDate', () => {
  beforeEach(() => storage.clear(COOKIES_CONSENT_KEY))

  it('should be false if no consent date', async () => {
    await storage.saveObject(COOKIES_CONSENT_KEY, {
      buildVersion: Package.build,
    })

    const { result } = renderHook(useIsCookiesListUpToDate)
    await flushAllPromisesWithAct()

    expect(result.current).toEqual(false)
  })

  it('should be false if no consent build version', async () => {
    await storage.saveObject(COOKIES_CONSENT_KEY, {
      choiceDatetime: TODAY,
    })

    const { result } = renderHook(useIsCookiesListUpToDate)
    await flushAllPromisesWithAct()

    expect(result.current).toEqual(false)
  })

  it.each([A_SECOND_AGO, LAST_WEEK, THREE_MONTHS_AGO])(
    'should be false if user has made choice before last list update',
    async (choiceDatetime) => {
      await storage.saveObject(COOKIES_CONSENT_KEY, {
        buildVersion: Package.build - 1,
        choiceDatetime: choiceDatetime.toISOString(),
      })

      const { result } = renderHook(useIsCookiesListUpToDate)
      await flushAllPromisesWithAct()

      expect(result.current).toEqual(false)
    }
  )

  it('should be true if no data from firestore', async () => {
    mockFirestore.mockResolvedValueOnce(undefined)

    const { result } = renderHook(useIsCookiesListUpToDate)
    await flushAllPromisesWithAct()

    expect(result.current).toEqual(true)
  })

  it('should be true if user has made choice after last list update', async () => {
    await storage.saveObject(COOKIES_CONSENT_KEY, {
      buildVersion: Package.build,
      choiceDatetime: TODAY,
    })

    const { result } = renderHook(useIsCookiesListUpToDate)
    await flushAllPromisesWithAct()

    expect(result.current).toEqual(true)
  })

  it('should be true if current app version does not contain cookies update', async () => {
    mockFirestore.mockResolvedValueOnce({
      ...defaultMockFirestore,
      lastUpdateBuildVersion: Package.build + 1,
    })

    await storage.saveObject(COOKIES_CONSENT_KEY, {
      buildVersion: Package.build,
      choiceDatetime: TODAY,
    })

    const { result } = renderHook(useIsCookiesListUpToDate)
    await flushAllPromisesWithAct()

    expect(result.current).toEqual(true)
  })

  it('should be true if cookies list update is in the future', async () => {
    mockFirestore.mockResolvedValueOnce({ ...defaultMockFirestore, lastUpdated: TOMORROW })

    await storage.saveObject(COOKIES_CONSENT_KEY, {
      buildVersion: Package.build,
      choiceDatetime: TODAY,
    })

    const { result } = renderHook(useIsCookiesListUpToDate)
    await flushAllPromisesWithAct()

    expect(result.current).toEqual(true)
  })
})
