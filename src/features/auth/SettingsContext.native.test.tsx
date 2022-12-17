import React from 'react'

import { mockDefaultSettings } from 'features/auth/__mocks__/SettingsContext'
import { SettingsWrapper, useSettingsContext } from 'features/auth/SettingsContext'
import { NetInfoWrapper } from 'libs/network/NetInfoWrapper'
import { useNetInfo } from 'libs/network/useNetInfo'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'

jest.unmock('libs/network/NetInfoWrapper')
const mockedUseNetInfo = useNetInfo as jest.Mock

describe('SettingsContext', () => {
  describe('useSettingsContext', () => {
    it('should not return settings when no internet connection', async () => {
      mockedUseNetInfo.mockReturnValueOnce({ isConnected: false, isInternetReachable: false })
      const result = renderUseSettingsContext()

      expect(result.current.data).toBeUndefined()
    })

    it('should return settings when internet connection', async () => {
      mockedUseNetInfo.mockReturnValueOnce({ isConnected: true, isInternetReachable: true })
      const result = renderUseSettingsContext()

      await waitFor(() => {
        expect(result.current.data).toEqual(mockDefaultSettings)
      })
    })
  })
})

const renderUseSettingsContext = () => {
  const { result } = renderHook(useSettingsContext, {
    wrapper: ({ children }) =>
      // eslint-disable-next-line local-rules/no-react-query-provider-hoc
      reactQueryProviderHOC(
        <NetInfoWrapper>
          <SettingsWrapper>{children}</SettingsWrapper>
        </NetInfoWrapper>
      ),
  })

  return result
}
