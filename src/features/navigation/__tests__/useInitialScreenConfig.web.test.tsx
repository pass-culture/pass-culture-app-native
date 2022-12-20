import React from 'react'

import { analytics } from 'libs/firebase/analytics'
import { SplashScreenProvider } from 'libs/splashscreen'
import { storage } from 'libs/storage'
import { renderHook, waitFor } from 'tests/utils'

import { useInitialScreen } from '../RootNavigator/useInitialScreenConfig'

const wrapper = (props: { children: unknown }) => (
  <SplashScreenProvider>{props.children as JSX.Element}</SplashScreenProvider>
)

describe('useInitialScreen()', () => {
  afterAll(async () => {
    await storage.clear('has_seen_tutorials')
    await storage.clear('has_seen_eligible_card')
  })

  it('should redirect to Home if user has not seen tutorials', async () => {
    const { result } = renderHook(useInitialScreen, { wrapper })

    await waitFor(() => {
      expect(result.current).toEqual('TabNavigator')
      expect(analytics.logScreenView).toBeCalledTimes(1)
      expect(analytics.logScreenView).toBeCalledWith('Home')
    })
  })
})
