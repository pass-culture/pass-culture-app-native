import { PropsWithChildren } from 'react'

import { analytics } from 'libs/analytics'
import { storage } from 'libs/storage'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils/web'

import { useInitialScreen } from './useInitialScreenConfig'

const wrapper = ({ children }: PropsWithChildren) => reactQueryProviderHOC(children)

jest.mock('libs/firebase/analytics/analytics')
jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

describe('useInitialScreen()', () => {
  afterAll(async () => {
    await storage.clear('has_seen_tutorials')
    await storage.clear('has_seen_eligible_card')
  })

  it('should redirect to Home if user has not seen tutorials', async () => {
    const { result } = renderHook(useInitialScreen, { wrapper })
    await waitFor(() => {
      expect(result.current).toEqual('TabNavigator')
      expect(analytics.logScreenView).toHaveBeenNthCalledWith(1, 'Home')
    })
  })
})
