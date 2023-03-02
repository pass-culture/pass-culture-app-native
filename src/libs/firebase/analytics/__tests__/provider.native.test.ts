import { analytics } from 'libs/firebase/analytics'

describe('analytics - getAppInstanceId', () => {
  it('should be user pseudo id', async () => {
    expect(await analytics.getAppInstanceId()).toEqual('firebase_pseudo_id')
  })
})
