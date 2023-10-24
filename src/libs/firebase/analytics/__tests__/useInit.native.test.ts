import mockdate from 'mockdate'

import { firebaseAnalytics } from 'libs/firebase/analytics/analytics'
import { useInit } from 'libs/firebase/analytics/useInit'
import { renderHook } from 'tests/utils'

const CURRENT_DATE = new Date('2020-12-02T00:00:01.000Z')
const START_TWENTY_THREE_HOURS_IN_THE_PAST = new Date('2020-12-01T23:00:00.000Z')
const START_TWENTY_FOUR_HOURS_IN_THE_PAST = new Date('2020-12-01T00:00:00.000Z')

mockdate.set(CURRENT_DATE)

let mockCampaignDate = START_TWENTY_FOUR_HOURS_IN_THE_PAST

jest.mock('libs/utm', () => ({
  useUtmParams: () => ({
    campaignDate: mockCampaignDate,
  }),
}))

describe('useInit', () => {
  it('should log analytics setDefaultEventParameters if the campaign date started more than 24 hours later', async () => {
    renderHook(() => useInit())

    expect(firebaseAnalytics.setDefaultEventParameters).toHaveBeenCalledWith(undefined)
  })

  it('should not log analytics setDefaultEventParameters if the campaign date started less than 24 hours ago', async () => {
    mockCampaignDate = START_TWENTY_THREE_HOURS_IN_THE_PAST
    renderHook(() => useInit())

    expect(firebaseAnalytics.setDefaultEventParameters).not.toHaveBeenCalled()
  })
})
