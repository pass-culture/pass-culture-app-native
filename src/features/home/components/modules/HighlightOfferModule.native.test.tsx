import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { FavoriteResponse, PaginatedFavoritesResponse, SubcategoriesResponseModelv2 } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { favoriteResponseSnap } from 'features/favorites/fixtures/favoriteResponseSnap'
import { simulateBackend } from 'features/favorites/helpers/simulateBackend'
import { useHighlightOffer } from 'features/home/api/useHighlightOffer'
import { HighlightOfferModule } from 'features/home/components/modules/HighlightOfferModule'
import { highlightOfferModuleFixture } from 'features/home/fixtures/highlightOfferModule.fixture'
import { analytics } from 'libs/analytics'
import { placeholderData } from 'libs/subcategories/placeholderData'
import { offersFixture } from 'shared/offer/offer.fixture'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen } from 'tests/utils'

const offerFixture = offersFixture[0]
const duoOfferFixture = offersFixture[2]

jest.mock('features/home/api/useHighlightOffer')
const mockUseHighlightOffer = useHighlightOffer as jest.Mock

jest.mock('features/auth/context/AuthContext')
const mockUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>
mockUseAuthContext.mockReturnValue({
  isLoggedIn: true,
  setIsLoggedIn: jest.fn(),
  refetchUser: jest.fn(),
  isUserLoading: false,
})

describe('HighlightOfferModule', () => {
  beforeEach(() => {
    const favoritesResponseWithoutOfferIn: PaginatedFavoritesResponse = {
      page: 1,
      nbFavorites: 0,
      favorites: [],
    }
    mockServer.getApiV1<SubcategoriesResponseModelv2>(`/subcategories/v2`, { ...placeholderData })
    mockServer.getApiV1<PaginatedFavoritesResponse>(
      '/me/favorites',
      favoritesResponseWithoutOfferIn
    )
    mockServer.postApiV1<FavoriteResponse>('/me/favorites', favoriteResponseSnap)
  })

  it('should navigate to offer page on press', async () => {
    mockUseHighlightOffer.mockReturnValueOnce(offerFixture)

    renderHighlightModule()
    await act(async () => {
      fireEvent.press(screen.getByText(highlightOfferModuleFixture.offerTitle))
    })

    // @ts-expect-error: because of noUncheckedIndexedAccess
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

    expect(analytics.logModuleDisplayedOnHomepage).toHaveBeenCalledTimes(1)
    expect(analytics.logModuleDisplayedOnHomepage).toHaveBeenCalledWith(
      'fH2FmoYeTzZPjhbz4ZHUW',
      'highlightOffer',
      0,
      'entryId'
    )
  })

  it('should send analytics event on offer press', async () => {
    mockUseHighlightOffer.mockReturnValueOnce(offerFixture)

    renderHighlightModule()

    await act(async () => {
      fireEvent.press(screen.getByText(highlightOfferModuleFixture.offerTitle))
    })

    expect(analytics.logConsultOffer).toHaveBeenCalledTimes(1)
    expect(analytics.logConsultOffer).toHaveBeenCalledWith({
      // @ts-expect-error: because of noUncheckedIndexedAccess
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

    await act(async () => {
      fireEvent.press(screen.getByRole('checkbox', { name: 'Mettre en favoris' }))
    })

    await act(async () => {})

    expect(analytics.logHasAddedOfferToFavorites).toHaveBeenCalledTimes(1)
    expect(analytics.logHasAddedOfferToFavorites).toHaveBeenCalledWith({
      // @ts-expect-error: because of noUncheckedIndexedAccess
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
      expect(screen.getByText('34 € - Duo')).toBeOnTheScreen()
      expect(screen.queryByText('34 €')).not.toBeOnTheScreen()
    })
  })

  it('should not show "- Duo" after price if offer is not isDuo', async () => {
    mockUseHighlightOffer.mockReturnValueOnce(offerFixture)

    renderHighlightModule()

    await act(async () => {
      expect(screen.getByText('28 €')).toBeOnTheScreen()
      expect(screen.queryByText('28 € - Duo')).not.toBeOnTheScreen()
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
})

const renderHighlightModule = () => {
  return render(
    reactQueryProviderHOC(
      <HighlightOfferModule {...highlightOfferModuleFixture} index={0} homeEntryId="entryId" />
    )
  )
}
