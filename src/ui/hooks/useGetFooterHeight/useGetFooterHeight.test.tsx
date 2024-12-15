import React from 'react'

import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { ThemeProvider } from 'libs/styled'
import { computedTheme } from 'tests/computedTheme'
import { renderHook } from 'tests/utils'
import { useGetFooterHeight } from 'ui/hooks/useGetFooterHeight/useGetFooterHeight'

jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

describe('useGetFooterHeight', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  it('should return correct footer height', () => {
    const footerHeight = 40
    const { result } = renderHook(() => useGetFooterHeight(footerHeight), {
      wrapper: ({ children }) => <ThemeProvider theme={computedTheme}>{children}</ThemeProvider>,
    })

    expect(result.current).toEqual(49)
  })
})
