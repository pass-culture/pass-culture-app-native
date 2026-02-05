import React from 'react'

import { initialFavoritesState } from 'features/favorites/context/reducer'
import { LoggedInBeneficiaryContent } from 'features/profile/containers/ProfileLoggedIn/LoggedInContent/LoggedInBeneficiaryContent/LoggedInBeneficiaryContent'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

const mockFavoritesState = initialFavoritesState
jest.mock('features/favorites/context/FavoritesWrapper', () => ({
  useFavoritesState: () => ({ ...mockFavoritesState, dispatch: jest.fn() }),
}))

describe('LoggedInBeneficiaryContent', () => {
  describe('ChatbotButton', () => {
    it('should not display ChatbotButton when the feature flag is disabled', () => {
      setFeatureFlags([])
      render(reactQueryProviderHOC(<LoggedInBeneficiaryContent />))

      expect(screen.queryByText('Poser une question')).toBeNull()
    })

    it('should display ChatbotButton when the feature flag is enabled', () => {
      setFeatureFlags([RemoteStoreFeatureFlags.ENABLE_CHATBOT])
      render(reactQueryProviderHOC(<LoggedInBeneficiaryContent />))

      expect(screen.getByText('Poser une question')).toBeTruthy()
    })
  })

  describe('AppearanceButton', () => {
    it('should not display AppearanceButton when the feature flag is disabled', () => {
      setFeatureFlags([])
      render(reactQueryProviderHOC(<LoggedInBeneficiaryContent />))

      expect(screen.queryByText('Apparence')).toBeNull()
    })

    it('should display AppearanceButton when the feature flag is enabled', () => {
      setFeatureFlags([RemoteStoreFeatureFlags.WIP_ENABLE_DARK_MODE])
      render(reactQueryProviderHOC(<LoggedInBeneficiaryContent />))

      expect(screen.getByText('Apparence')).toBeTruthy()
    })
  })
})
