import mockdate from 'mockdate'

import { firebaseAnalytics } from 'libs/firebase/analytics/analytics'
import { useInit } from 'libs/firebase/analytics/useInit'
import * as UtmAPI from 'libs/utm/useUtmParams'
import { renderHook } from 'tests/utils'

const CURRENT_DATE = new Date('2020-12-02T00:00:01.000Z')
const TWENTY_THREE_HOURS_AGO = new Date('2020-12-01T01:00:00.000Z')
const TWENTY_FOUR_HOURS_AGO = new Date('2020-12-01T00:00:00.000Z')

mockdate.set(CURRENT_DATE)

const useUtmParamsSpy = jest.spyOn(UtmAPI, 'useUtmParams')

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

  it('should not reset default event parameters if the campaign date started less than 24 hours ago', async () => {
    useUtmParamsSpy.mockReturnValueOnce({ campaignDate: TWENTY_THREE_HOURS_AGO })
    renderHook(useInit)

    expect(firebaseAnalytics.setDefaultEventParameters).not.toHaveBeenCalled()
  })
})
