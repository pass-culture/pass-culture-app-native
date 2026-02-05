import React from 'react'

import { initialFavoritesState } from 'features/favorites/context/reducer'
import { ProfileLoggedIn } from 'features/profile/containers/ProfileLoggedIn/ProfileLoggedIn'
import { beneficiaryUser } from 'fixtures/user'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { checkAccessibilityFor, render, screen } from 'tests/utils/web'
import * as useVersion from 'ui/hooks/useVersion'

jest.mock('libs/firebase/analytics/analytics')
jest.spyOn(useVersion, 'useVersion').mockReturnValue('Version\u00A01.100.1')

const mockFavoritesState = initialFavoritesState
jest.mock('features/favorites/context/FavoritesWrapper', () => ({
  useFavoritesState: () => ({ ...mockFavoritesState, dispatch: jest.fn() }),
}))

describe('<ProfileLoggedIn />', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = await renderProfileLoggedIn({ user: beneficiaryUser })

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})

const renderProfileLoggedIn = async ({ user }: { user: typeof beneficiaryUser }) => {
  const renderResult = render(
    reactQueryProviderHOC(
      <ProfileLoggedIn
        featureFlags={{
          enablePassForAll: true,
          enableProfileV2: true,
          disableActivation: false,
        }}
        user={user}
      />
    )
  )
  await screen.findByTestId('profile-logged-in')
  return renderResult
}
