import React from 'react'

import { YoungStatusType } from 'api/gen'
import { initialFavoritesState } from 'features/favorites/context/reducer'
import { getShouldDisplayHelpButton } from 'features/profile/helpers/getShouldDisplayHelpButton'
import { UserProfileResponseWithoutSurvey } from 'features/share/types'
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

    it('should display ChatbotButton when feature flag is enabled and user is beneficiary', () => {
      setFeatureFlags([RemoteStoreFeatureFlags.ENABLE_CHATBOT])

      render(reactQueryProviderHOC(<LoggedInContent user={beneficiaryUser} />))

      expect(screen.getByText('Poser une question')).toBeTruthy()
    })

    it('should display ChatbotButton when feature flag is enabled and user is eligible', () => {
      setFeatureFlags([RemoteStoreFeatureFlags.ENABLE_CHATBOT])
      const eligibleUser: UserProfileResponseWithoutSurvey = {
        ...nonBeneficiaryUser,
        status: { statusType: YoungStatusType.eligible },
      }

      render(reactQueryProviderHOC(<LoggedInContent user={eligibleUser} />))

      expect(screen.getByText('Poser une question')).toBeTruthy()
    })

    it('should display ChatbotButton when feature flag is enabled and user is ex_beneficiary', () => {
      setFeatureFlags([RemoteStoreFeatureFlags.ENABLE_CHATBOT])
      const exBeneficiary: UserProfileResponseWithoutSurvey = {
        ...beneficiaryUser,
        status: { statusType: YoungStatusType.ex_beneficiary },
      }

      render(reactQueryProviderHOC(<LoggedInContent user={exBeneficiary} />))

      expect(screen.getByText('Poser une question')).toBeTruthy()
    })

    it('should not display ChatbotButton when feature flag is enabled but user is non_eligible', () => {
      setFeatureFlags([RemoteStoreFeatureFlags.ENABLE_CHATBOT])

      render(reactQueryProviderHOC(<LoggedInContent user={nonBeneficiaryUser} />))

      expect(screen.queryByText('Poser une question')).toBeNull()
    })
  })

  describe('AppearanceButton', () => {
    it('should display AppearanceButton by default', () => {
      setFeatureFlags([])

      render(reactQueryProviderHOC(<LoggedInContent user={beneficiaryUser} />))

      expect(screen.getByText('Apparence')).toBeTruthy()
    })
  })

  describe('HelpButton', () => {
    it('should not display HelpButton when helper returns false', () => {
      mockGetShouldDisplayHelpButton.mockReturnValueOnce(false)

      render(reactQueryProviderHOC(<LoggedInContent user={nonBeneficiaryUser} />))

      expect(screen.queryByText('Comment ça marche\u00a0?')).toBeNull()
    })

    it('should display HelpButton when helper returns true', () => {
      mockGetShouldDisplayHelpButton.mockReturnValueOnce(true)

      render(reactQueryProviderHOC(<LoggedInContent user={nonBeneficiaryUser} />))

      expect(screen.getByText('Comment ça marche\u00a0?')).toBeTruthy()
    })

    it('should display HelpButton for beneficiary when helper returns true', () => {
      mockGetShouldDisplayHelpButton.mockReturnValueOnce(true)

      render(reactQueryProviderHOC(<LoggedInContent user={beneficiaryUser} />))

      expect(screen.getByText('Comment ça marche\u00a0?')).toBeTruthy()
    })
  })
})
