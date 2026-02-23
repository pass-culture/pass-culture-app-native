import React from 'react'

import { initialFavoritesState } from 'features/favorites/context/reducer'
import { LoggedOutContent } from 'features/profile/containers/ProfileLoggedOut/LoggedOutContent/LoggedOutContent'
import { getShouldDisplayHelpButton } from 'features/profile/helpers/getShouldDisplayHelpButton'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { render, screen } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

const mockGetShouldDisplayHelpButton = getShouldDisplayHelpButton as jest.MockedFunction<
  typeof getShouldDisplayHelpButton
>

jest.mock('features/profile/helpers/getShouldDisplayHelpButton', () => ({
  getShouldDisplayHelpButton: jest.fn(),
}))

const mockFavoritesState = initialFavoritesState
jest.mock('features/favorites/context/FavoritesWrapper', () => ({
  useFavoritesState: () => ({ ...mockFavoritesState, dispatch: jest.fn() }),
}))

describe('LoggedOutContent', () => {
  beforeEach(() => {
    setFeatureFlags([])
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('HelpButton', () => {
    it('should not display HelpButton when getShouldDisplayHelpButton returns false', () => {
      mockGetShouldDisplayHelpButton.mockReturnValueOnce(false)
      render(<LoggedOutContent user={undefined} />)

      expect(screen.queryByText('Comment ça marche\u00a0?')).toBeNull()
    })

    it('should display HelpButton when getShouldDisplayHelpButton returns true', () => {
      mockGetShouldDisplayHelpButton.mockReturnValueOnce(true)
      render(<LoggedOutContent user={undefined} />)

      expect(screen.getByText('Comment ça marche\u00a0?')).toBeTruthy()
    })
  })

  describe('AppearanceButton', () => {
    it('should display AppearanceButton by default', () => {
      setFeatureFlags([])
      render(<LoggedOutContent user={undefined} />)

      expect(screen.getByText('Apparence')).toBeTruthy()
    })
  })
})
