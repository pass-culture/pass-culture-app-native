import React from 'react'

import { initialFavoritesState as mockFavoritesState } from 'features/favorites/context/reducer'
import { Profile } from 'features/profile/pages/Profile/Profile'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import * as useNetInfoContextDefault from 'libs/network/NetInfoWrapper'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

const mockUseNetInfoContext = jest.spyOn(useNetInfoContextDefault, 'useNetInfoContext') as jest.Mock
mockUseNetInfoContext.mockReturnValue({ isConnected: true, isInternetReachable: true })

jest.mock('libs/firebase/analytics/analytics')

jest.mock('features/favorites/context/FavoritesWrapper', () => ({
  useFavoritesState: () => ({ ...mockFavoritesState, dispatch: jest.fn() }),
}))

describe('<Profile />', () => {
  it('should display ProfileV1 when ENABLE_PROFILE_V2 flag is not set', async () => {
    setFeatureFlags()
    render(reactQueryProviderHOC(<Profile />))

    expect(await screen.findByTestId('profile-V1')).toBeOnTheScreen()
  })

  it('should display ProfileV2 when ENABLE_PROFILE_V2 flag is set', async () => {
    setFeatureFlags([RemoteStoreFeatureFlags.ENABLE_PROFILE_V2])
    render(reactQueryProviderHOC(<Profile />))

    expect(await screen.findByTestId('profile-V2')).toBeOnTheScreen()
  })
})
