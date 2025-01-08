import { firestoreRemoteStore } from 'libs/firebase/firestore/client'
import { captureMonitoringError } from 'libs/monitoring'
import { updateFirestoreNetworkState } from 'libs/network/helpers/updateFirestoreNetworkState/updateFirestoreNetworkState'

jest.mock('libs/firebase/firestore/client')
jest.mock('libs/monitoring')

const mockFirestoreEnableNetwork = firestoreRemoteStore.enableNetwork as jest.Mock
const mockFirestoreDisableNetwork = firestoreRemoteStore.disableNetwork as jest.Mock

describe('updateFirestoreNetworkState', () => {
  it('should enable Firestore network when user is connected', () => {
    updateFirestoreNetworkState(true)

    expect(mockFirestoreEnableNetwork).toHaveBeenCalledTimes(1)
  })

  it('should capture Sentry error if enable Firestore network catch an exception', () => {
    const mockError = new Error('enableNetwork failed')
    mockFirestoreEnableNetwork.mockImplementationOnce(() => {
      throw mockError
    })

    updateFirestoreNetworkState(true)

    expect(captureMonitoringError).toHaveBeenCalledWith(
      `enableNetwork failed`,
      'Error updating Firestore network state'
    )
  })

  it('should disable Firestore network when user is not connected', () => {
    updateFirestoreNetworkState(false)

    expect(mockFirestoreDisableNetwork).toHaveBeenCalledTimes(1)
  })

  it('should capture Sentry error if disable Firestore network catch an exception', () => {
    const mockError = new Error('disableNetwork failed')
    mockFirestoreDisableNetwork.mockImplementationOnce(() => {
      throw mockError
    })

    updateFirestoreNetworkState(false)

    expect(captureMonitoringError).toHaveBeenCalledWith(
      `disableNetwork failed`,
      'Error updating Firestore network state'
    )
  })
})
