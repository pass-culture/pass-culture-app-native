import { analytics } from 'libs/firebase/analytics'

jest.unmock('libs/firebase/analytics/analytics')
jest.unmock('libs/firebase/analytics/provider')

describe('analytics - getAppInstanceId', () => {
  it('should be null', async () => {
    expect(await analytics.getAppInstanceId()).toBeNull()
  })
})
