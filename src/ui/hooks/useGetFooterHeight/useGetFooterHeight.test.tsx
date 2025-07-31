import React from 'react'

import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { remoteConfigResponseFixture } from 'libs/firebase/remoteConfig/fixtures/remoteConfigResponse.fixture'
import * as useRemoteConfigQuery from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import { ThemeProvider } from 'libs/styled'
import { ColorScheme } from 'libs/styled/useColorScheme'
import { computedTheme } from 'tests/computedTheme'
import { renderHook } from 'tests/utils'
import { useGetFooterHeight } from 'ui/hooks/useGetFooterHeight/useGetFooterHeight'

jest
  .spyOn(useRemoteConfigQuery, 'useRemoteConfigQuery')
  .mockReturnValue(remoteConfigResponseFixture)

describe('useGetFooterHeight', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  it('should return correct footer height', () => {
    const footerHeight = 40
    const { result } = renderHook(() => useGetFooterHeight(footerHeight), {
      wrapper: ({ children }) => (
        <ThemeProvider theme={computedTheme} colorScheme={ColorScheme.LIGHT}>
          {children}
        </ThemeProvider>
      ),
    })

    expect(result.current).toEqual(49)
  })
})
