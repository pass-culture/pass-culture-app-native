import * as useRemoteConfig from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import { DEFAULT_REMOTE_CONFIG } from 'libs/firebase/remoteConfig/remoteConfig.constants'
import { useLogTypeFromRemoteConfig } from 'libs/hooks/useLogTypeFromRemoteConfig'
import { LogTypeEnum } from 'libs/monitoring/errors'
import { renderHook } from 'tests/utils'

const useRemoteConfigSpy = jest.spyOn(useRemoteConfig, 'useRemoteConfig')

describe('useLogTypeFromRemoteConfig', () => {
  describe('When shouldLogInfo remote config is false', () => {
    beforeAll(() => {
      useRemoteConfigSpy.mockReturnValue({
        ...DEFAULT_REMOTE_CONFIG,
        shouldLogInfo: false,
      })
    })

    afterAll(() => {
      useRemoteConfigSpy.mockReturnValue(DEFAULT_REMOTE_CONFIG)
    })

    it('should return ignored as log type', () => {
      const { result } = renderHook(() => useLogTypeFromRemoteConfig())

      expect(result.current.logType).toEqual(LogTypeEnum.IGNORED)
    })
  })

  describe('When shouldLogInfo remote config is true', () => {
    beforeAll(() => {
      useRemoteConfigSpy.mockReturnValue({
        ...DEFAULT_REMOTE_CONFIG,
        shouldLogInfo: true,
      })
    })

    afterAll(() => {
      useRemoteConfigSpy.mockReturnValue(DEFAULT_REMOTE_CONFIG)
    })

    it('should return info as log type', () => {
      const { result } = renderHook(() => useLogTypeFromRemoteConfig())

      expect(result.current.logType).toEqual(LogTypeEnum.INFO)
    })
  })
})
