import React from 'react'

import { initialFavoritesState } from 'features/favorites/context/reducer'
import { getShouldDisplayHelpButton } from 'features/profile/helpers/getShouldDisplayHelpButton'
import { beneficiaryUser, nonBeneficiaryUser } from 'fixtures/user'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

import { LoggedInContent } from './LoggedInContent'

jest.mock('libs/firebase/analytics/analytics')

jest.mock('features/profile/helpers/getShouldDisplayHelpButton', () => ({
  getShouldDisplayHelpButton: jest.fn(),
}))

const mockGetShouldDisplayHelpButton = getShouldDisplayHelpButton as jest.MockedFunction<
  typeof getShouldDisplayHelpButton
>

const mockFavoritesState = initialFavoritesState

jest.mock('features/favorites/context/FavoritesWrapper', () => ({
  useFavoritesState: () => ({
    ...mockFavoritesState,
    dispatch: jest.fn(),
  }),
}))

describe('LoggedInContent', () => {
  afterEach(() => {
    jest.clearAllMocks()
    setFeatureFlags([])
  })

  describe('Rendering by user type', () => {
    it('should render beneficiary content when user is beneficiary', () => {
      render(reactQueryProviderHOC(<LoggedInContent user={beneficiaryUser} />))

      expect(screen.getByTestId('logged-in-beneficiary-content')).toBeTruthy()
    })

    it('should render non beneficiary content when user is not beneficiary', () => {
      render(reactQueryProviderHOC(<LoggedInContent user={nonBeneficiaryUser} />))

      expect(screen.getByTestId('logged-in-non-beneficiary-content')).toBeTruthy()
    })

    it('should render non beneficiary content when user is undefined', () => {
      render(reactQueryProviderHOC(<LoggedInContent user={undefined} />))

      expect(screen.getByTestId('logged-in-non-beneficiary-content')).toBeTruthy()
    })
  })

  describe('ChatbotButton', () => {
    it('should not display ChatbotButton when feature flag is disabled', () => {
      setFeatureFlags([])

      render(reactQueryProviderHOC(<LoggedInContent user={beneficiaryUser} />))

      expect(screen.queryByText('Poser une question')).toBeNull()
    })

    it('should display ChatbotButton when feature flag is enabled', () => {
      setFeatureFlags([RemoteStoreFeatureFlags.ENABLE_CHATBOT])

      render(reactQueryProviderHOC(<LoggedInContent user={beneficiaryUser} />))

      expect(screen.getByText('Poser une question')).toBeTruthy()
    })
  })

  describe('AppearanceButton', () => {
    it('should not display AppearanceButton when feature flag is disabled', () => {
      setFeatureFlags([])

      render(reactQueryProviderHOC(<LoggedInContent user={beneficiaryUser} />))

      expect(screen.queryByText('Apparence')).toBeNull()
    })

    it('should display AppearanceButton when feature flag is enabled', () => {
      setFeatureFlags([RemoteStoreFeatureFlags.WIP_ENABLE_DARK_MODE])

      render(reactQueryProviderHOC(<LoggedInContent user={beneficiaryUser} />))

      expect(screen.getByText('Apparence')).toBeTruthy()
    })
  })

  describe('HelpButton (non beneficiary only)', () => {
    it('should not display HelpButton when helper returns false', () => {
      mockGetShouldDisplayHelpButton.mockReturnValueOnce(false)

      render(reactQueryProviderHOC(<LoggedInContent user={nonBeneficiaryUser} />))

      expect(screen.queryByText('Comment ça marche ?')).toBeNull()
    })

    it('should display HelpButton when helper returns true', () => {
      mockGetShouldDisplayHelpButton.mockReturnValueOnce(true)

      render(reactQueryProviderHOC(<LoggedInContent user={nonBeneficiaryUser} />))

      expect(screen.getByText('Comment ça marche ?')).toBeTruthy()
    })

    it('should not display HelpButton for beneficiary even if helper returns true', () => {
      mockGetShouldDisplayHelpButton.mockReturnValueOnce(true)

      render(reactQueryProviderHOC(<LoggedInContent user={beneficiaryUser} />))

      expect(screen.queryByText('Comment ça marche ?')).toBeNull()
    })
  })
})
