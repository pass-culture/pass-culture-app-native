import { env } from 'libs/environment'
// eslint-disable-next-line no-restricted-imports
import { firebaseAnalytics } from 'libs/firebase/analytics'
import { mockServer } from 'tests/mswServer'

jest.unmock('libs/firebase/analytics/analytics')
jest.unmock('libs/firebase/analytics/provider')

describe('analytics - getAppInstanceId', () => {
  it('should be null', async () => {
    mockServer.universalGet(
      `https://firebase.googleapis.com/v1alpha/projects/-/apps/${env.FIREBASE_APPID}/webConfig`,
      {}
    )
    expect(await firebaseAnalytics.getAppInstanceId()).toBeNull()
  })
})
