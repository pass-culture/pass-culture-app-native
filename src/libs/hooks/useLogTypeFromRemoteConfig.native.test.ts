import { remoteConfigResponseFixture } from 'libs/firebase/remoteConfig/fixtures/remoteConfigResponse.fixture'
import * as useRemoteConfigQuery from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import { DEFAULT_REMOTE_CONFIG } from 'libs/firebase/remoteConfig/remoteConfig.constants'
import { useLogTypeFromRemoteConfig } from 'libs/hooks/useLogTypeFromRemoteConfig'
import { LogTypeEnum } from 'libs/monitoring/errors'
import { renderHook } from 'tests/utils'

const useRemoteConfigSpy = jest.spyOn(useRemoteConfigQuery, 'useRemoteConfigQuery')

describe('useLogTypeFromRemoteConfig', () => {
  describe('When shouldLogInfo remote config is false', () => {
    beforeAll(() => {
      useRemoteConfigSpy.mockReturnValue({
        ...remoteConfigResponseFixture,
        data: {
          ...DEFAULT_REMOTE_CONFIG,
          shouldLogInfo: false,
        },
      })
    })

    afterAll(() => {
      useRemoteConfigSpy.mockReturnValue(remoteConfigResponseFixture)
    })

    it('should return ignored as log type', () => {
      const { result } = renderHook(() => useLogTypeFromRemoteConfig())

      expect(result.current.logType).toEqual(LogTypeEnum.IGNORED)
    })
  })

  describe('When shouldLogInfo remote config is true', () => {
    beforeAll(() => {
      useRemoteConfigSpy.mockReturnValue({
        ...remoteConfigResponseFixture,
        data: {
          ...DEFAULT_REMOTE_CONFIG,
          shouldLogInfo: true,
        },
      })
    })

    afterAll(() => {
      useRemoteConfigSpy.mockReturnValue(remoteConfigResponseFixture)
    })

    it('should return info as log type', () => {
      const { result } = renderHook(() => useLogTypeFromRemoteConfig())

      expect(result.current.logType).toEqual(LogTypeEnum.INFO)
    })
  })
})
