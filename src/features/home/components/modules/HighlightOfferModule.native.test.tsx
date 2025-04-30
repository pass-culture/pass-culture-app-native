import mockdate from 'mockdate'
import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { FavoriteResponse, PaginatedFavoritesResponse, SubcategoriesResponseModelv2 } from 'api/gen'
import { favoriteResponseSnap } from 'features/favorites/fixtures/favoriteResponseSnap'
import { useHighlightOffer } from 'features/home/api/useHighlightOffer'
import { HighlightOfferModule } from 'features/home/components/modules/HighlightOfferModule'
import { highlightOfferModuleFixture } from 'features/home/fixtures/highlightOfferModule.fixture'
import { analytics } from 'libs/analytics/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { subcategoriesDataTest } from 'libs/subcategories/fixtures/subcategoriesResponse'
import { offersFixture } from 'shared/offer/offer.fixture'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, render, screen, userEvent } from 'tests/utils'
const offerFixture = offersFixture[0]

const today = 1736870746 // 14/01/2025 - 17:05:46
const tomorrow = today + 24 * 60 * 60

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
    mockdate.set(new Date(today * 1000))
    setFeatureFlags([RemoteStoreFeatureFlags.ENABLE_PACIFIC_FRANC_CURRENCY])
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
    await user.press(screen.getByText(offerFixture.offer.name))

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

  it('should display publication date when displayPublicationDate is true and has a publicationDate in future', async () => {
    mockUseHighlightOffer.mockReturnValueOnce({
      ...offerFixture,
      offer: { ...offerFixture.offer, publicationDate: tomorrow },
    })
    const displayPublicationDate = true
    renderHighlightModule(displayPublicationDate)

    await act(async () => {
      expect(screen.getByText('Disponible le 15 janvier')).toBeOnTheScreen()
    })
  })

  it('should not display publication date when displayPublicationDate is false and has a publicationDate in future', async () => {
    mockUseHighlightOffer.mockReturnValueOnce({
      ...offerFixture,
      offer: { ...offerFixture.offer, publicationDate: tomorrow },
    })

    const displayPublicationDate = false
    renderHighlightModule(displayPublicationDate)

    await act(async () => {
      expect(screen.getByText('Bientôt disponible')).toBeOnTheScreen()
    })
  })
})

const renderHighlightModule = (displayPublicationDate = false) => {
  return render(
    reactQueryProviderHOC(
      <HighlightOfferModule
        {...highlightOfferModuleFixture}
        index={0}
        homeEntryId="entryId"
        displayPublicationDate={displayPublicationDate}
      />
    )
  )
}
