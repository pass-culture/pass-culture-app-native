// eslint-disable-next-line no-restricted-imports
import { NetInfoStateType } from '@react-native-community/netinfo'
import React from 'react'

import { analytics } from 'libs/analytics/provider'
import { NetInfoWrapper, useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { useNetInfo } from 'libs/network/useNetInfo'
import { render } from 'tests/utils'

const mockedUseNetInfo = useNetInfo as unknown as jest.Mock<{
  isConnected: boolean
  isInternetReachable: boolean
  type: NetInfoStateType
  details?: Record<string, unknown>
}>

describe('NetInfoWrapper', () => {
  describe('useNetInfoContext', () => {
    const onConnection = jest.fn()
    const onConnectionLost = jest.fn()
    const onInternetConnection = jest.fn()
    const onInternetConnectionLost = jest.fn()

    it('should call onConnection when connected', () => {
      renderNetInfoWrapper({
        onInternetConnection,
        onInternetConnectionLost,
        onConnection,
        onConnectionLost,
      })

      expect(onConnection).toHaveBeenCalledTimes(1)
      expect(onConnectionLost).not.toHaveBeenCalled()
    })

    it('should call onConnectionLost', () => {
      mockedUseNetInfo.mockReturnValueOnce({
        isConnected: false,
        isInternetReachable: true,
        type: NetInfoStateType.wifi,
      })
      renderNetInfoWrapper({
        onInternetConnection,
        onInternetConnectionLost,
        onConnection,
        onConnectionLost,
      })

      expect(onConnection).not.toHaveBeenCalled()
      expect(onConnectionLost).toHaveBeenCalledTimes(1)
    })

    it('should call onInternetConnection', () => {
      mockedUseNetInfo.mockReturnValueOnce({
        isConnected: true,
        isInternetReachable: true,
        type: NetInfoStateType.wifi,
      })
      renderNetInfoWrapper({
        onInternetConnection,
        onInternetConnectionLost,
        onConnection,
        onConnectionLost,
      })

      expect(onInternetConnection).toHaveBeenCalledTimes(1)
      expect(onInternetConnectionLost).not.toHaveBeenCalled()
    })

    it('should call onInternetConnectionLost', () => {
      mockedUseNetInfo.mockReturnValueOnce({
        isConnected: true,
        isInternetReachable: false,
        type: NetInfoStateType.wifi,
      })
      renderNetInfoWrapper({
        onInternetConnection,
        onInternetConnectionLost,
        onConnection,
        onConnectionLost,
      })

      expect(onInternetConnection).not.toHaveBeenCalled()
      expect(onInternetConnectionLost).toHaveBeenCalledTimes(1)
    })

    it('should log network information when wifi is used', async () => {
      mockedUseNetInfo.mockReturnValueOnce({
        isConnected: false,
        isInternetReachable: true,
        type: NetInfoStateType.wifi,
      })
      renderNetInfoWrapper({
        onInternetConnection,
        onInternetConnectionLost,
        onConnection,
        onConnectionLost,
      })

      expect(analytics.logConnectionInfo).toHaveBeenCalledWith({ type: 'wifi' })
    })

    it('should log network information when cellular is used', async () => {
      mockedUseNetInfo.mockReturnValueOnce({
        isConnected: false,
        isInternetReachable: true,
        type: NetInfoStateType.cellular,
        details: {
          cellularGeneration: '4g',
        },
      })
      renderNetInfoWrapper({
        onInternetConnection,
        onInternetConnectionLost,
        onConnection,
        onConnectionLost,
      })

      expect(analytics.logConnectionInfo).toHaveBeenCalledWith({
        type: 'cellular',
        generation: '4g',
      })
    })

    it('should not log network information when connection is unknown', async () => {
      mockedUseNetInfo.mockReturnValueOnce({
        isConnected: false,
        isInternetReachable: true,
        type: NetInfoStateType.unknown,
      })
      renderNetInfoWrapper({
        onInternetConnection,
        onInternetConnectionLost,
        onConnection,
        onConnectionLost,
      })

      expect(analytics.logConnectionInfo).not.toHaveBeenCalled()
    })
  })
})

type Props = {
  onConnectionLost?: VoidFunction
  onConnection?: VoidFunction
  onInternetConnectionLost?: VoidFunction
  onInternetConnection?: VoidFunction
}

const DumbComponent = ({
  onConnection,
  onInternetConnection,
  onInternetConnectionLost,
  onConnectionLost,
}: Props) => {
  useNetInfoContext({
    onConnection,
    onInternetConnection,
    onConnectionLost,
    onInternetConnectionLost,
  })

  return null
}

function renderNetInfoWrapper({
  onConnection,
  onConnectionLost,
  onInternetConnectionLost,
  onInternetConnection,
}: Props) {
  return render(
    <NetInfoWrapper>
      <DumbComponent
        onConnection={onConnection}
        onConnectionLost={onConnectionLost}
        onInternetConnection={onInternetConnection}
        onInternetConnectionLost={onInternetConnectionLost}
      />
    </NetInfoWrapper>
  )
}
