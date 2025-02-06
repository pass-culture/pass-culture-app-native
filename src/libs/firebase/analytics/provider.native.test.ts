// eslint-disable-next-line no-restricted-imports
import { firebaseAnalytics } from 'libs/firebase/analytics/analytics'

jest.mock('libs/firebase/analytics/analytics')

describe('analytics - getAppInstanceId', () => {
  it('should be user pseudo id', async () => {
    expect(await firebaseAnalytics.getAppInstanceId()).toEqual('firebase_pseudo_id')
  })
})
