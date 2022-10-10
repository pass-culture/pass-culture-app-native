import React from 'react'

import { NetInfoWrapper, useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { useNetInfo } from 'libs/network/useNetInfo'
import { render } from 'tests/utils'

jest.unmock('libs/network/NetInfoWrapper')
const mockedUseNetInfo = useNetInfo as unknown as jest.Mock<{
  isConnected: boolean
  isInternetReachable: boolean
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

      expect(onConnection).toHaveBeenCalled()
      expect(onConnectionLost).not.toHaveBeenCalled()
    })

    it('should call onConnectionLost', () => {
      mockedUseNetInfo.mockReturnValueOnce({ isConnected: false, isInternetReachable: true })
      renderNetInfoWrapper({
        onInternetConnection,
        onInternetConnectionLost,
        onConnection,
        onConnectionLost,
      })

      expect(onConnection).not.toHaveBeenCalled()
      expect(onConnectionLost).toHaveBeenCalled()
    })

    it('should call onInternetConnection', () => {
      mockedUseNetInfo.mockReturnValueOnce({ isConnected: true, isInternetReachable: true })
      renderNetInfoWrapper({
        onInternetConnection,
        onInternetConnectionLost,
        onConnection,
        onConnectionLost,
      })

      expect(onInternetConnection).toHaveBeenCalled()
      expect(onInternetConnectionLost).not.toHaveBeenCalled()
    })

    it('should call onInternetConnectionLost', () => {
      mockedUseNetInfo.mockReturnValueOnce({ isConnected: true, isInternetReachable: false })
      renderNetInfoWrapper({
        onInternetConnection,
        onInternetConnectionLost,
        onConnection,
        onConnectionLost,
      })

      expect(onInternetConnection).not.toHaveBeenCalled()
      expect(onInternetConnectionLost).toHaveBeenCalled()
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
