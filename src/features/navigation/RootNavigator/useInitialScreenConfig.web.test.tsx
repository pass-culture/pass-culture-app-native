import React from 'react'

import { analytics } from 'libs/analytics'
import { SplashScreenProvider } from 'libs/splashscreen'
import { storage } from 'libs/storage'
import { renderHook, waitFor } from 'tests/utils/web'

import { useInitialScreen } from './useInitialScreenConfig'

const wrapper = (props: { children: unknown }) => (
  <SplashScreenProvider>{props.children as React.JSX.Element}</SplashScreenProvider>
)

jest.mock('libs/firebase/analytics/analytics')

describe('useInitialScreen()', () => {
  afterAll(async () => {
    await storage.clear('has_seen_tutorials')
    await storage.clear('has_seen_eligible_card')
  })

  it('should redirect to Home if user has not seen tutorials', async () => {
    const { result } = renderHook(useInitialScreen, { wrapper })

    await waitFor(() => {
      expect(result.current).toEqual('TabNavigator')
      expect(analytics.logScreenView).toHaveBeenCalledTimes(1)
      expect(analytics.logScreenView).toHaveBeenCalledWith('Home')
    })
  })
})
