import React from 'react'

import { firestoreRemoteStore } from 'libs/firebase/firestore/client'
import { FirestoreNetworkObserver } from 'libs/firebase/firestore/FirestoreNetworkObserver/FirestoreNetworkObserver'
import { enableNetwork, disableNetwork } from 'libs/firebase/shims/firestore'
import { captureMonitoringError } from 'libs/monitoring/errors'
import { useNetInfo } from 'libs/network/useNetInfo'
import { render } from 'tests/utils'

const mockFirestoreInstance = { _isMock: true }

jest.mock('libs/firebase/shims/firestore', () => ({
  getFirestore: jest.fn(() => mockFirestoreInstance),
  enableNetwork: jest.fn(),
  disableNetwork: jest.fn(),
}))

jest.mock('libs/monitoring/services')
jest.mock('libs/monitoring/errors')

const mockEnableNetwork = enableNetwork as jest.Mock
const mockDisableNetwork = disableNetwork as jest.Mock
const mockUseNetInfo = useNetInfo as jest.Mock

describe('FirestoreNetworkObserver', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should enable Firestore network when user is connected', () => {
    mockUseNetInfo.mockReturnValueOnce({ isConnected: true, isInternetReachable: true })
    render(<FirestoreNetworkObserver />)

    // Verify it was called with the instance exported from client.ts
    expect(mockEnableNetwork).toHaveBeenCalledWith(firestoreRemoteStore)
  })

  it('should capture Sentry error if enable Firestore network catch an exception', () => {
    const mockError = new Error('enableNetwork failed')
    mockEnableNetwork.mockImplementationOnce(() => {
      throw mockError
    })
    mockUseNetInfo.mockReturnValueOnce({ isConnected: true, isInternetReachable: true })

    render(<FirestoreNetworkObserver />)

    expect(captureMonitoringError).toHaveBeenCalledWith(
      'enableNetwork failed',
      'Error updating Firestore network state'
    )
  })

  it('should disable Firestore network when user is not connected', () => {
    mockUseNetInfo.mockReturnValueOnce({ isConnected: false, isInternetReachable: false })
    render(<FirestoreNetworkObserver />)

    expect(mockDisableNetwork).toHaveBeenCalledWith(firestoreRemoteStore)
  })

  it('should capture Sentry error if disable Firestore network catch an exception', () => {
    const mockError = new Error('disableNetwork failed')
    mockDisableNetwork.mockImplementationOnce(() => {
      throw mockError
    })
    mockUseNetInfo.mockReturnValueOnce({ isConnected: false, isInternetReachable: false })

    render(<FirestoreNetworkObserver />)

    expect(captureMonitoringError).toHaveBeenCalledWith(
      'disableNetwork failed',
      'Error updating Firestore network state'
    )
  })
})
