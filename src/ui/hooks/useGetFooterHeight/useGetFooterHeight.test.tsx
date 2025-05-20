import React from 'react'

import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import * as useRemoteConfigQuery from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import { DEFAULT_REMOTE_CONFIG } from 'libs/firebase/remoteConfig/remoteConfig.constants'
import { ThemeProvider } from 'libs/styled'
import { ColorSchemeEnum } from 'libs/styled/useColorScheme'
import { computedTheme } from 'tests/computedTheme'
import { renderHook } from 'tests/utils'
import { useGetFooterHeight } from 'ui/hooks/useGetFooterHeight/useGetFooterHeight'

jest.mock('libs/firebase/remoteConfig/remoteConfig.services')
jest.spyOn(useRemoteConfigQuery, 'useRemoteConfigQuery').mockReturnValue(DEFAULT_REMOTE_CONFIG)

describe('useGetFooterHeight', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  it('should return correct footer height', () => {
    const footerHeight = 40
    const { result } = renderHook(() => useGetFooterHeight(footerHeight), {
      wrapper: ({ children }) => (
        <ThemeProvider theme={computedTheme} colorScheme={ColorSchemeEnum.LIGHT}>
          {children}
        </ThemeProvider>
      ),
    })

    expect(result.current).toEqual(49)
  })
})
