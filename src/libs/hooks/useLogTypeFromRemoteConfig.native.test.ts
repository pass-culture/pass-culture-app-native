import { DEFAULT_REMOTE_CONFIG } from 'libs/firebase/remoteConfig/remoteConfig.constants'
import * as useRemoteConfigContext from 'libs/firebase/remoteConfig/RemoteConfigProvider'
import { useLogTypeFromRemoteConfig } from 'libs/hooks/useLogTypeFromRemoteConfig'
import { LogTypeEnum } from 'libs/monitoring/errors'
import { renderHook } from 'tests/utils'

const useRemoteConfigContextSpy = jest.spyOn(useRemoteConfigContext, 'useRemoteConfigContext')

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

describe('useLogTypeFromRemoteConfig', () => {
  describe('When shouldLogInfo remote config is false', () => {
    beforeAll(() => {
      useRemoteConfigContextSpy.mockReturnValue({
        ...DEFAULT_REMOTE_CONFIG,
        shouldLogInfo: false,
      })
    })

    afterAll(() => {
      useRemoteConfigContextSpy.mockReturnValue(DEFAULT_REMOTE_CONFIG)
    })

    it('should return ignored as log type', () => {
      const { result } = renderHook(() => useLogTypeFromRemoteConfig())

      expect(result.current.logType).toEqual(LogTypeEnum.IGNORED)
    })
  })

  describe('When shouldLogInfo remote config is true', () => {
    beforeAll(() => {
      useRemoteConfigContextSpy.mockReturnValue({
        ...DEFAULT_REMOTE_CONFIG,
        shouldLogInfo: true,
      })
    })

    afterAll(() => {
      useRemoteConfigContextSpy.mockReturnValue(DEFAULT_REMOTE_CONFIG)
    })

    it('should return info as log type', () => {
      const { result } = renderHook(() => useLogTypeFromRemoteConfig())

      expect(result.current.logType).toEqual(LogTypeEnum.INFO)
    })
  })
})
