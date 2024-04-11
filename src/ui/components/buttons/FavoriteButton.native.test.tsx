import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { FavoriteResponse, PaginatedFavoritesResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import * as useAddFavoriteAPI from 'features/favorites/api/useAddFavorite'
import * as useRemoveFavoriteAPI from 'features/favorites/api/useRemoveFavorite'
import { favoriteResponseSnap } from 'features/favorites/fixtures/favoriteResponseSnap'
import { simulateBackend } from 'features/favorites/helpers/simulateBackend'
import { PlaylistType } from 'features/offer/enums'
import { analytics } from 'libs/analytics'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RecommendationApiParams } from 'shared/offer/types'
import { reactQueryProviderHOC, queryCache } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen, waitFor } from 'tests/utils'
import { FavoriteButton } from 'ui/components/buttons/FavoriteButton'
import {
  showSuccessSnackBar,
  showErrorSnackBar,
  hideSnackBar,
  showInfoSnackBar,
} from 'ui/components/snackBar/__mocks__/SnackBarContext'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'

jest.mock('features/auth/context/AuthContext')
const mockUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>
mockUseAuthContext.mockReturnValue({
  isLoggedIn: true,
  setIsLoggedIn: jest.fn(),
  refetchUser: jest.fn(),
  isUserLoading: false,
})

jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: jest.fn(() => ({})),
}))
const mockedUseSnackBarContext = useSnackBarContext as jest.MockedFunction<
  typeof useSnackBarContext
>

mockedUseSnackBarContext.mockReturnValue({
  hideSnackBar,
  showInfoSnackBar,
  showSuccessSnackBar,
  showErrorSnackBar,
})

const useFeatureFlagSpy = jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(true)
const useAddFavoriteSpy = jest.spyOn(useAddFavoriteAPI, 'useAddFavorite')
const useRemoveFavoriteSpy = jest.spyOn(useRemoveFavoriteAPI, 'useRemoveFavorite')

const mockUseAddFavoriteLoading = () => {
  // @ts-ignore we don't use the other properties of UseMutationResult (such as failureCount)
  useAddFavoriteSpy.mockImplementation(() => ({
    mutate: jest.fn(),
    isLoading: true,
  }))
}

const mockUseRemoveFavorite = () => {
  // @ts-ignore we don't use the other properties of UseMutationResult (such as failureCount)
  useRemoveFavoriteSpy.mockImplementation(() => ({
    mutate: jest.fn(),
    isLoading: true,
  }))
}

jest.useFakeTimers()

describe('<FavoriteButton />', () => {
  it('should render favorite icon', async () => {
    renderFavoriteButton()
    await act(async () => {})

    expect(screen.getByTestId('icon-favorite')).toBeOnTheScreen()
  })

  it('should display SignIn modal when pressing Favorite - not logged in users', async () => {
    mockUseAuthContext.mockReturnValueOnce({
      isLoggedIn: false,
      setIsLoggedIn: jest.fn(),
      refetchUser: jest.fn(),
      isUserLoading: false,
    })
    renderFavoriteButton()

    await act(async () => {
      fireEvent.press(screen.getByTestId('icon-favorite'))
    })

    expect(screen.getByText('Identifie-toi pour retrouver tes favoris')).toBeOnTheScreen()
  })

  it('should show a favorite filled icon when viewing a offer in favorite - logged in users', async () => {
    const favoriteOfferId = 146193
    renderFavoriteButton({ id: favoriteOfferId })

    await waitFor(() => {
      expect(screen.getByTestId('icon-favorite-filled')).toBeOnTheScreen()
    })
  })

  it('should update correctly the cache when adding a favorite - logged in users', async () => {
    renderFavoriteButton({
      id: favoriteResponseSnap.offer.id,
    })
    fireEvent.press(screen.getByTestId('icon-favorite'))

    await waitFor(() => {
      const mutateData = queryCache.find(['favorites'])?.state?.data as PaginatedFavoritesResponse

      expect(
        mutateData.favorites?.find(
          (f: FavoriteResponse) => f.offer.id === favoriteResponseSnap.offer.id
        )?.offer.id
      ).toEqual(favoriteResponseSnap.offer.id)

      expect(
        (queryCache.find(['favorites'])?.state?.data as PaginatedFavoritesResponse).favorites?.find(
          (f: FavoriteResponse) => f.id === 1000
        )
      ).toEqual({
        ...favoriteResponseSnap,
        offer: {
          ...favoriteResponseSnap.offer,
          date: favoriteResponseSnap.offer.date,
        },
      })
    })
  })

  it('should not show favorite list modal when pressing favorite icon but feature flag is not activated', async () => {
    useFeatureFlagSpy.mockReturnValueOnce(false)
    renderFavoriteButton()

    await act(async () => {
      fireEvent.press(screen.getByTestId('icon-favorite'))
    })

    expect(screen.queryByText('Crée une liste de favoris !')).not.toBeOnTheScreen()
  })

  it('should show error snackbar when remove favorite fails - logged in users', async () => {
    const favoriteOfferId = 146193
    renderFavoriteButton({
      id: favoriteOfferId,
      hasRemoveFavoriteError: true,
    })

    await act(async () => {
      fireEvent.press(await screen.findByTestId('icon-favorite-filled'))
    })

    expect(showErrorSnackBar).toHaveBeenCalledWith({
      message: 'L’offre n’a pas été retirée de tes favoris',
      timeout: SNACK_BAR_TIME_OUT,
    })
  })

  it('should show error when adding an offer in favorite fails because user as too many favorites - logged in users', async () => {
    renderFavoriteButton({
      hasTooManyFavorites: true,
      id: favoriteResponseSnap.offer.id,
    })

    fireEvent.press(screen.getByTestId('icon-favorite'))

    await waitFor(() => {
      expect(showErrorSnackBar).toHaveBeenCalledWith({
        message: 'Trop de favoris enregistrés. Supprime des favoris pour en ajouter de nouveaux.',
        timeout: SNACK_BAR_TIME_OUT,
      })
    })
  })

  describe('should log analytic event logHasAddedOfferToFavorites when adding an offer to favorite - logged in users', () => {
    it('With "home" as argument for from', async () => {
      const from = 'home'
      const moduleName = 'testModule'
      const offerId = favoriteResponseSnap.offer.id
      useRoute.mockImplementationOnce(() => ({
        params: {
          from,
          moduleName,
        },
      }))
      renderFavoriteButton({
        id: offerId,
      })
      fireEvent.press(screen.getByTestId('icon-favorite'))

      await waitFor(() => {
        expect(analytics.logHasAddedOfferToFavorites).toHaveBeenCalledWith({
          from,
          offerId,
          moduleName,
        })
      })
    })

    it('With "search" and search id as argument', async () => {
      const from = 'search'
      const offerId = favoriteResponseSnap.offer.id
      const searchId = '539b285e'
      useRoute.mockImplementationOnce(() => ({
        params: {
          from,
          searchId,
        },
      }))
      renderFavoriteButton({
        id: offerId,
      })
      fireEvent.press(screen.getByTestId('icon-favorite'))

      await waitFor(() => {
        expect(analytics.logHasAddedOfferToFavorites).toHaveBeenCalledWith({
          from,
          offerId,
          searchId,
        })
      })
    })

    it('With "apiRecoParams" as argument', async () => {
      const offerId = favoriteResponseSnap.offer.id

      const apiRecoParams: RecommendationApiParams = {
        call_id: '1',
        filtered: true,
        geo_located: false,
        model_endpoint: 'default',
        model_name: 'similar_offers_default_prod',
        model_version: 'similar_offers_clicks_v2_1_prod_v_20230317T173445',
        reco_origin: 'algo',
      }

      useRoute.mockImplementationOnce(() => ({
        params: {
          apiRecoParams: JSON.stringify(apiRecoParams),
          playlistType: PlaylistType.SAME_CATEGORY_SIMILAR_OFFERS,
        },
      }))
      renderFavoriteButton({
        id: offerId,
      })
      fireEvent.press(screen.getByTestId('icon-favorite'))

      await waitFor(() => {
        expect(analytics.logHasAddedOfferToFavorites).toHaveBeenCalledWith({
          offerId,
          ...apiRecoParams,
          playlistType: PlaylistType.SAME_CATEGORY_SIMILAR_OFFERS,
        })
      })
    })
  })

  it('should enable the favorites button when is not loading', async () => {
    renderFavoriteButton()
    await act(async () => {})

    expect(screen.getByLabelText('Mettre en favoris')).not.toBeDisabled()
  })

  it('should disabled the favorites button when is loading', async () => {
    mockUseAddFavoriteLoading()
    mockUseRemoveFavorite()
    renderFavoriteButton()
    await act(async () => {})

    expect(screen.getByLabelText('Mettre en favoris')).toBeDisabled()
  })
})

const offerId = 116656

interface Options {
  id?: number
  hasAddFavoriteError?: boolean
  hasRemoveFavoriteError?: boolean
  hasTooManyFavorites?: boolean
}

const defaultOptions = {
  id: offerId,
  hasAddFavoriteError: false,
  hasRemoveFavoriteError: false,
  hasTooManyFavorites: false,
}

function renderFavoriteButton(options: Options = defaultOptions) {
  const { id, hasAddFavoriteError, hasRemoveFavoriteError, hasTooManyFavorites } = {
    ...defaultOptions,
    ...options,
  }

  simulateBackend({
    id,
    hasAddFavoriteError,
    hasRemoveFavoriteError,
    hasTooManyFavorites,
  })

  return render(reactQueryProviderHOC(<FavoriteButton offerId={id} animationState={undefined} />))
}
