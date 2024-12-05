import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { FavoriteResponse, PaginatedFavoritesResponse, SubcategoriesResponseModelv2 } from 'api/gen'
import { favoriteResponseSnap } from 'features/favorites/fixtures/favoriteResponseSnap'
import { simulateBackend } from 'features/favorites/helpers/simulateBackend'
import { useHighlightOffer } from 'features/home/api/useHighlightOffer'
import { HighlightOfferModule } from 'features/home/components/modules/HighlightOfferModule'
import { highlightOfferModuleFixture } from 'features/home/fixtures/highlightOfferModule.fixture'
import { analytics } from 'libs/analytics'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { subcategoriesDataTest } from 'libs/subcategories/fixtures/subcategoriesResponse'
import { offersFixture } from 'shared/offer/offer.fixture'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, render, screen, userEvent } from 'tests/utils'

const useFeatureFlagSpy = jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag')

const offerFixture = offersFixture[0]
const duoOfferFixture = offersFixture[2]

jest.mock('libs/jwt/jwt')
jest.mock('features/home/api/useHighlightOffer')
const mockUseHighlightOffer = useHighlightOffer as jest.Mock

jest.mock('features/auth/context/AuthContext')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})
const user = userEvent.setup()

jest.useFakeTimers()

describe('HighlightOfferModule', () => {
  beforeEach(() => {
    activateFeatureFlags([RemoteStoreFeatureFlags.ENABLE_PACIFIC_FRANC_CURRENCY])
    const favoritesResponseWithoutOfferIn: PaginatedFavoritesResponse = {
      page: 1,
      nbFavorites: 0,
      favorites: [],
    }
    mockServer.getApi<SubcategoriesResponseModelv2>(`/v1/subcategories/v2`, subcategoriesDataTest)
    mockServer.getApi<PaginatedFavoritesResponse>(
      '/v1/me/favorites',
      favoritesResponseWithoutOfferIn
    )
    mockServer.postApi<FavoriteResponse>('/v1/me/favorites', favoriteResponseSnap)
  })

  it('should navigate to offer page on press', async () => {
    mockUseHighlightOffer.mockReturnValueOnce(offerFixture)

    renderHighlightModule()
    await user.press(screen.getByText(highlightOfferModuleFixture.offerTitle))

    expect(navigate).toHaveBeenCalledWith('Offer', { id: offerFixture.objectID })
  })

  it('should not render anything when offer is not found', async () => {
    mockUseHighlightOffer.mockReturnValueOnce(undefined)

    renderHighlightModule()

    await act(async () => {})

    expect(screen.queryByText(highlightOfferModuleFixture.highlightTitle)).not.toBeOnTheScreen()
  })

  it('should send analytics event on module display', async () => {
    renderHighlightModule()

    await act(async () => {})

    expect(analytics.logModuleDisplayedOnHomepage).toHaveBeenNthCalledWith(1, {
      homeEntryId: 'entryId',
      index: 0,
      moduleId: 'fH2FmoYeTzZPjhbz4ZHUW',
      moduleType: 'highlightOffer',
      offers: ['20859'],
    })
  })

  it('should send analytics event on offer press', async () => {
    mockUseHighlightOffer.mockReturnValueOnce(offerFixture)

    renderHighlightModule()

    await user.press(screen.getByText(highlightOfferModuleFixture.offerTitle))

    expect(analytics.logConsultOffer).toHaveBeenCalledTimes(1)
    expect(analytics.logConsultOffer).toHaveBeenCalledWith({
      offerId: +offerFixture.objectID,
      from: 'highlightOffer',
      moduleId: 'fH2FmoYeTzZPjhbz4ZHUW',
      moduleName: 'L’offre du moment 💥',
      homeEntryId: 'entryId',
    })
  })

  it('should send analytics event on favorite press', async () => {
    simulateBackend()
    mockUseHighlightOffer.mockReturnValueOnce(offerFixture)

    renderHighlightModule()

    await user.press(screen.getByRole('checkbox', { name: 'Mettre en favoris' }))

    expect(analytics.logHasAddedOfferToFavorites).toHaveBeenCalledTimes(1)
    expect(analytics.logHasAddedOfferToFavorites).toHaveBeenCalledWith({
      offerId: +offerFixture.objectID,
      from: 'highlightOffer',
      moduleId: 'fH2FmoYeTzZPjhbz4ZHUW',
      moduleName: 'L’offre du moment 💥',
    })
  })

  it('should show "- Duo" after price if offer isDuo', async () => {
    mockUseHighlightOffer.mockReturnValueOnce(duoOfferFixture)

    renderHighlightModule()

    await act(async () => {
      expect(screen.getByText('Dès 34 € - Duo')).toBeOnTheScreen()
      expect(screen.queryByText('Dès 34 €')).not.toBeOnTheScreen()
    })
  })

  it('should not show "- Duo" after price if offer is not isDuo', async () => {
    mockUseHighlightOffer.mockReturnValueOnce(offerFixture)

    renderHighlightModule()

    await act(async () => {
      expect(screen.getByText('Dès 28 €')).toBeOnTheScreen()
      expect(screen.queryByText('Dès 28 € - Duo')).not.toBeOnTheScreen()
    })
  })

  it('should display venue publicName if it exists', async () => {
    mockUseHighlightOffer.mockReturnValueOnce({
      ...offerFixture,
      venue: { publicName: 'publicName' },
    })

    renderHighlightModule()

    await act(async () => {
      expect(screen.getByText('publicName')).toBeOnTheScreen()
    })
  })

  it('should fallback on venue name if venue publicName does not exist', async () => {
    mockUseHighlightOffer.mockReturnValueOnce({
      ...offerFixture,
      venue: { name: 'name', publicName: undefined },
    })

    renderHighlightModule()

    await act(async () => {
      expect(screen.getByText('name')).toBeOnTheScreen()
    })
  })

  it('should fallback on venue name if venue publicName is an empty string', async () => {
    mockUseHighlightOffer.mockReturnValueOnce({
      ...offerFixture,
      venue: { name: 'name', publicName: '' },
    })

    renderHighlightModule()

    await act(async () => {
      expect(screen.getByText('name')).toBeOnTheScreen()
    })
  })

  it('should render new design when feature flag is enabled', async () => {
    activateFeatureFlags([RemoteStoreFeatureFlags.WIP_NEW_EXCLUSIVITY_MODULE])
    mockUseHighlightOffer.mockReturnValueOnce({
      ...offerFixture,
    })

    renderHighlightModule()

    await act(async () => {
      expect(screen.queryByTestId('highlight-offer-image')).not.toBeOnTheScreen()
    })
  })

  it('should render old design when feature flag is disabled', async () => {
    mockUseHighlightOffer.mockReturnValueOnce({
      ...offerFixture,
    })

    renderHighlightModule()

    await act(async () => {
      expect(screen.getByTestId('highlight-offer-image')).toBeOnTheScreen()
    })
  })
})

const renderHighlightModule = (homeEntryId = 'entryId') => {
  return render(
    reactQueryProviderHOC(
      <HighlightOfferModule {...highlightOfferModuleFixture} index={0} homeEntryId={homeEntryId} />
    )
  )
}

const activateFeatureFlags = (activeFeatureFlags: RemoteStoreFeatureFlags[] = []) => {
  useFeatureFlagSpy.mockImplementation((flag) => activeFeatureFlags.includes(flag))
}
