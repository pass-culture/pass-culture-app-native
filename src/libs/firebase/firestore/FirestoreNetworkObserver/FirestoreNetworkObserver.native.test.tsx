import React from 'react'

import { firestoreRemoteStore } from 'libs/firebase/firestore/client'
import { FirestoreNetworkObserver } from 'libs/firebase/firestore/FirestoreNetworkObserver/FirestoreNetworkObserver'
import { captureMonitoringError } from 'libs/monitoring/errors'
import { useNetInfo } from 'libs/network/useNetInfo'
import { render } from 'tests/utils'

jest.mock('libs/firebase/firestore/client')
jest.mock('libs/monitoring/services')
jest.mock('libs/monitoring/errors')

const mockFirestoreEnableNetwork = firestoreRemoteStore.enableNetwork as jest.Mock
const mockFirestoreDisableNetwork = firestoreRemoteStore.disableNetwork as jest.Mock

const mockUseNetInfo = useNetInfo as jest.Mock

describe('FirestoreNetworkObserver', () => {
  it('should enable Firestore network when user is connected', () => {
    mockUseNetInfo.mockReturnValueOnce({ isConnected: true, isInternetReachable: true })
    render(<FirestoreNetworkObserver />)

    expect(mockFirestoreEnableNetwork).toHaveBeenCalledTimes(1)
  })

  it('should capture Sentry error if enable Firestore network catch an exception', () => {
    const mockError = new Error('enableNetwork failed')
    mockFirestoreEnableNetwork.mockImplementationOnce(() => {
      throw mockError
    })
    mockUseNetInfo.mockReturnValueOnce({ isConnected: true, isInternetReachable: true })

    render(<FirestoreNetworkObserver />)

    expect(captureMonitoringError).toHaveBeenCalledWith(
      `enableNetwork failed`,
      'Error updating Firestore network state'
    )
  })

  it('should disable Firestore network when user is not connected', () => {
    mockUseNetInfo.mockReturnValueOnce({ isConnected: false, isInternetReachable: false })
    render(<FirestoreNetworkObserver />)

    expect(mockFirestoreDisableNetwork).toHaveBeenCalledTimes(1)
  })

  it('should capture Sentry error if disable Firestore network catch an exception', () => {
    const mockError = new Error('disableNetwork failed')
    mockFirestoreDisableNetwork.mockImplementationOnce(() => {
      throw mockError
    })
    mockUseNetInfo.mockReturnValueOnce({ isConnected: false, isInternetReachable: false })

    render(<FirestoreNetworkObserver />)

    expect(captureMonitoringError).toHaveBeenCalledWith(
      `disableNetwork failed`,
      'Error updating Firestore network state'
    )
  })
})
