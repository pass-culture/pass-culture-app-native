import React from 'react'

import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { ThemeProvider } from 'libs/styled'
import { computedTheme } from 'tests/computedTheme'
import { renderHook } from 'tests/utils'
import { useGetFooterHeight } from 'ui/hooks/useGetFooterHeight/useGetFooterHeight'

jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(false)
jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

describe('useGetFooterHeight', () => {
  it('should return correct footer height', () => {
    const footerHeight = 40
    const { result } = renderHook(() => useGetFooterHeight(footerHeight), {
      wrapper: ({ children }) => <ThemeProvider theme={computedTheme}>{children}</ThemeProvider>,
    })

    expect(result.current).toEqual(49)
  })
})
