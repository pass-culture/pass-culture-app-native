import { firebaseAnalytics } from 'libs/firebase/analytics'

describe('analytics - getAppInstanceId', () => {
  it('should be user pseudo id', async () => {
    expect(await firebaseAnalytics.getAppInstanceId()).toEqual('firebase_pseudo_id')
  })
})
