import { getHardBuildByFingerprint } from 'libs/firebase/firestore/hardBuilds/getHardBuildByFingerprint'
import { HARD_BUILDS_COLLECTION } from 'libs/firebase/firestore/hardBuilds/types'
import { doc, getDoc, getFirestore } from 'libs/firebase/shims/firestore'
import { eventMonitoring } from 'libs/monitoring/services'
import { waitFor } from 'tests/utils'

jest.mock('@react-native-firebase/firestore')

const firestoreInstance = getFirestore()
const mockGet = getDoc as jest.Mock

describe('getHardBuildByFingerprint', () => {
  beforeAll(() => {
    doc(firestoreInstance, HARD_BUILDS_COLLECTION, 'ios_abc')
  })

  it('should call the hardBuilds collection with platform_fingerprint id', async () => {
    mockGet.mockResolvedValueOnce({
      exists: false,
      data: () => undefined,
    })

    await getHardBuildByFingerprint({ platform: 'ios', fingerprint: 'abc' })

    expect(doc).toHaveBeenCalledWith({}, HARD_BUILDS_COLLECTION, 'ios_abc')
  })

  it('should return hard build when document exists', async () => {
    mockGet.mockResolvedValueOnce({
      exists: true,
      data: () => ({
        fingerprint: 'abc',
        platform: 'ios',
        env: 'testing',
        version: '1.403.2',
        buildNumber: 10403002,
        testingUri: 'https://appdistribution.firebase.google.com/testerapps/test',
        firebaseConsoleUri: 'https://console.firebase.google.com/test',
      }),
    })

    const hardBuild = await getHardBuildByFingerprint({ platform: 'ios', fingerprint: 'abc' })

    expect(hardBuild).toEqual({
      fingerprint: 'abc',
      platform: 'ios',
      env: 'testing',
      version: '1.403.2',
      buildNumber: 10403002,
      testingUri: 'https://appdistribution.firebase.google.com/testerapps/test',
      firebaseConsoleUri: 'https://console.firebase.google.com/test',
    })
  })

  it('should send log to Sentry when Firestore throws an error', async () => {
    mockGet.mockRejectedValueOnce(new Error('error'))

    await getHardBuildByFingerprint({ platform: 'android', fingerprint: 'def' })

    await waitFor(() => {
      expect(eventMonitoring.captureException).toHaveBeenCalledWith(new Error('error'))
    })
  })
})
