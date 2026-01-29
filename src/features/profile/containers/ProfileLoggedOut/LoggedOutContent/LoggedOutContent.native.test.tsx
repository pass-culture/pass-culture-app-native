import React from 'react'

import { initialFavoritesState } from 'features/favorites/context/reducer'
import { LoggedOutContent } from 'features/profile/containers/ProfileLoggedOut/LoggedOutContent/LoggedOutContent'
import { getShouldDisplayHelpButton } from 'features/profile/helpers/getShouldDisplayHelpButton'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
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
  describe('ChatbotButton', () => {
    it('should not display ChatbotButton when the feature flag is disabled', () => {
      setFeatureFlags([])

      render(<LoggedOutContent user={undefined} />)

      expect(screen.queryByText('Poser une question')).toBeNull()
    })

    it('should display ChatbotButton when the feature flag is enabled', () => {
      setFeatureFlags([RemoteStoreFeatureFlags.ENABLE_CHATBOT])
      render(<LoggedOutContent user={undefined} />)

      expect(screen.getByText('Poser une question')).toBeTruthy()
    })
  })

  describe('HelpButton', () => {
    it('should not display HelpButton when getShouldDisplayHelpButton returns false', () => {
      mockGetShouldDisplayHelpButton.mockReturnValueOnce(false)
      render(<LoggedOutContent user={undefined} />)

      expect(screen.queryByText('Comment ça marche ?')).toBeNull()
    })

    it('should display HelpButton when getShouldDisplayHelpButton returns true', () => {
      mockGetShouldDisplayHelpButton.mockReturnValueOnce(true)
      render(<LoggedOutContent user={undefined} />)

      expect(screen.getByText('Comment ça marche ?')).toBeTruthy()
    })
  })

  describe('AppearanceButton', () => {
    it('should not display AppearanceButton when the feature flag is disabled', () => {
      setFeatureFlags([])
      render(<LoggedOutContent user={undefined} />)

      expect(screen.queryByText('Apparence')).toBeNull()
    })

    it('should display AppearanceButton when the feature flag is enabled', () => {
      setFeatureFlags([RemoteStoreFeatureFlags.WIP_ENABLE_DARK_MODE])
      render(<LoggedOutContent user={undefined} />)

      expect(screen.getByText('Apparence')).toBeTruthy()
    })
  })
})
