import React from 'react'

import { initialFavoritesState } from 'features/favorites/context/reducer'
import { ProfileOnline } from 'features/profile/containers/ProfileOnline/ProfileOnline'
import { beneficiaryUser } from 'fixtures/user'
import { mockAuthContextWithUser, mockAuthContextWithoutUser } from 'tests/AuthContextUtils'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { checkAccessibilityFor, render, screen } from 'tests/utils/web'

jest.mock('libs/firebase/analytics/analytics')
jest.mock('features/auth/context/AuthContext')

const mockFavoritesState = initialFavoritesState
jest.mock('features/favorites/context/FavoritesWrapper', () => ({
  useFavoritesState: () => ({ ...mockFavoritesState, dispatch: jest.fn() }),
}))

describe('<ProfileOnline />', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues when user is logged in', async () => {
      mockAuthContextWithUser(beneficiaryUser)
      const { container } = await renderProfileOnline()

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })

    it('should not have basic accessibility issues when user is logged out', async () => {
      mockAuthContextWithoutUser()
      const { container } = await renderProfileOnline()

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})

const renderProfileOnline = async () => {
  const renderResult = render(reactQueryProviderHOC(<ProfileOnline />))
  await screen.findByTestId(/profile-logged/)
  return renderResult
}
