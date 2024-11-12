import mockdate from 'mockdate'

import { removeGeneratedStorageKey } from 'features/cookies/helpers/removeGeneratedStorageKey'
import { generateUTMKeys } from 'features/cookies/helpers/startTrackingAcceptedCookies'
import { firebaseAnalytics } from 'libs/firebase/analytics/analytics'
import { useInit } from 'libs/firebase/analytics/useInit'
import * as UtmAPI from 'libs/utm/useUtmParams'
import { act, renderHook } from 'tests/utils'

const CURRENT_DATE = new Date('2020-12-02T00:00:01.000Z')
const TWENTY_THREE_HOURS_AGO = new Date('2020-12-01T01:00:00.000Z')
const TWENTY_FOUR_HOURS_AGO = new Date('2020-12-01T00:00:00.000Z')

mockdate.set(CURRENT_DATE)

const useUtmParamsSpy = jest.spyOn(UtmAPI, 'useUtmParams')

jest.mock('libs/firebase/analytics/analytics')
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

jest.mock('features/cookies/helpers/removeGeneratedStorageKey')
const mockRemoveGeneratedStorageKey = removeGeneratedStorageKey as jest.Mock

describe('useInit', () => {
  it('should set default event parameters to null when the campaign date started more than 24 hours ago', async () => {
    useUtmParamsSpy.mockReturnValueOnce({ campaignDate: TWENTY_FOUR_HOURS_AGO })
    renderHook(useInit)

    expect(firebaseAnalytics.setDefaultEventParameters).toHaveBeenCalledWith({
      traffic_campaign: null,
      traffic_content: null,
      traffic_gen: null,
      traffic_medium: null,
      traffic_source: null,
    })
  })

  it('should set default event parameters to null when there is no campaign date', async () => {
    useUtmParamsSpy.mockReturnValueOnce({ campaignDate: null })
    renderHook(useInit)

    expect(firebaseAnalytics.setDefaultEventParameters).toHaveBeenCalledWith({
      traffic_campaign: null,
      traffic_content: null,
      traffic_gen: null,
      traffic_medium: null,
      traffic_source: null,
    })
  })

  it('should not reset default event parameters if the campaign date started less than 24 hours ago', async () => {
    useUtmParamsSpy.mockReturnValueOnce({ campaignDate: TWENTY_THREE_HOURS_AGO })
    renderHook(useInit)

    expect(firebaseAnalytics.setDefaultEventParameters).not.toHaveBeenCalled()
  })

  it('should not reset default event parameters while reading campaign date', async () => {
    useUtmParamsSpy.mockReturnValueOnce({ campaignDate: undefined })
    renderHook(useInit)

    expect(firebaseAnalytics.setDefaultEventParameters).not.toHaveBeenCalled()
  })

  it('should remove generate UTM keys from localStorage when campaignDate is null', async () => {
    useUtmParamsSpy.mockReturnValueOnce({ campaignDate: null })
    renderHook(useInit)

    await act(() => {})

    generateUTMKeys.forEach((generateKey, index) =>
      expect(mockRemoveGeneratedStorageKey).toHaveBeenNthCalledWith(index + 1, generateKey)
    )
  })
})
