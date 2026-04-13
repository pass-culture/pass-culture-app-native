import React from 'react'

import { initialFavoritesState } from 'features/favorites/context/reducer'
import { ProfileLoggedOut } from 'features/profile/containers/ProfileLoggedOut/ProfileLoggedOut'
import { useFeatureFlagOptionsQuery } from 'libs/firebase/firestore/featureFlags/queries/useFeatureFlagOptionsQuery'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'
import * as useVersion from 'ui/hooks/useVersion'

jest.mock('libs/firebase/analytics/analytics')
jest.spyOn(useVersion, 'useVersion').mockReturnValue('Version\u00A01.100.1')
jest.mock('libs/firebase/firestore/featureFlags/queries/useFeatureFlagOptionsQuery', () => ({
  useFeatureFlagOptionsQuery: jest.fn(),
}))

const mockUseFeatureFlagOptionsQuery = useFeatureFlagOptionsQuery as jest.Mock

const mockFavoritesState = initialFavoritesState
jest.mock('features/favorites/context/FavoritesWrapper', () => ({
  useFavoritesState: () => ({ ...mockFavoritesState, dispatch: jest.fn() }),
}))

describe('<ProfileLoggedOut />', () => {
  beforeEach(() =>
    mockUseFeatureFlagOptionsQuery.mockReturnValueOnce({ options: { message: 'désactivé' } })
  )

  it('should match snapshot', async () => {
    render(
      reactQueryProviderHOC(
        <ProfileLoggedOut
          featureFlags={{
            enableProfileV2: true,
            disableActivation: false,
          }}
        />
      )
    )

    await screen.findByTestId('profile-logged-out')

    expect(screen).toMatchSnapshot()
  })
})
