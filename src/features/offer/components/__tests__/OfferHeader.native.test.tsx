import { rest } from 'msw'
import React from 'react'
import { Animated } from 'react-native'

import { useRoute } from '__mocks__/@react-navigation/native'
import { FavoriteResponse, OfferResponse, PaginatedFavoritesResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/AuthContext'
import {
  paginatedFavoritesResponseSnap,
  addFavoriteJsonResponseSnap,
} from 'features/favorites/fixtures/favoritesResponse'
import { mockGoBack } from 'features/navigation/__mocks__/useGoBack'
import { offerResponseSnap } from 'features/offer/api/snaps/offerResponseSnap'
import { env } from 'libs/environment'
import { EmptyResponse } from 'libs/fetch'
import { analytics } from 'libs/firebase/analytics'
import { reactQueryProviderHOC, queryCache } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { act, fireEvent, render, waitFor } from 'tests/utils'
import {
  showSuccessSnackBar,
  showErrorSnackBar,
  hideSnackBar,
  showInfoSnackBar,
} from 'ui/components/snackBar/__mocks__/SnackBarContext'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'

import { OfferHeader } from '../OfferHeader'

jest.mock('features/auth/AuthContext')
const mockUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>

jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: jest.fn(() => ({})),
}))
const mockedUseSnackBarContext = useSnackBarContext as jest.MockedFunction<
  typeof useSnackBarContext
>

describe('<OfferHeader />', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })

  it('should render all the icons', () => {
    const offerHeader = renderOfferHeader({ isLoggedIn: true })
    expect(offerHeader.queryByTestId('icon-back')).toBeTruthy()
    expect(offerHeader.queryByTestId('icon-share')).toBeTruthy()
    expect(offerHeader.queryByTestId('icon-favorite')).toBeTruthy()
  })

  it('should goBack when we press on the back button', () => {
    const { getByTestId } = renderOfferHeader({ isLoggedIn: true })
    fireEvent.press(getByTestId('icon-back'))
    expect(mockGoBack).toBeCalledTimes(1)
  })

  it('should fully display the title at the end of the animation', () => {
    const { animatedValue, getByTestId } = renderOfferHeader({ isLoggedIn: true })
    expect(getByTestId('offerHeaderName').props['aria-hidden']).toBeTruthy()
    expect(getByTestId('offerHeaderName').props.style.opacity).toBe(0)

    act(() => {
      Animated.timing(animatedValue, { duration: 100, toValue: 1, useNativeDriver: false }).start()
      jest.advanceTimersByTime(100)
    })

    waitFor(() => {
      expect(getByTestId('offerHeaderName').props['aria-hidden']).toBeFalsy()
      expect(getByTestId('offerHeaderName').props.style.opacity).toBe(1)
    })
  })

  it('should display SignIn modal when pressing Favorite - not logged in users', () => {
    const { getByTestId, queryByText } = renderOfferHeader({ isLoggedIn: false })
    fireEvent.press(getByTestId('icon-favorite'))
    expect(
      queryByText('Ton compte te permettra de retrouver tous tes favoris en un clin d’oeil !')
    ).toBeTruthy()
  })

  it('should show a favorite filled icon when viewing a offer in favorite - logged in users', () => {
    const favoriteOfferId = 146193
    const { getByTestId } = renderOfferHeader({ isLoggedIn: true, id: favoriteOfferId })
    waitFor(() => {
      expect(getByTestId('icon-favorite-filled')).toBeTruthy()
    })
  })

  it('should add favorite when adding an offer in favorite - logged in users', () => {
    const { getByTestId } = renderOfferHeader({
      isLoggedIn: true,
      id: addFavoriteJsonResponseSnap.offer.id,
    })

    fireEvent.press(getByTestId('icon-favorite'))

    waitFor(() => {
      expect(getByTestId('icon-favorite-filled')).toBeTruthy()

      const mutateData = queryCache.find('favorites')?.state?.data as PaginatedFavoritesResponse
      expect(
        mutateData.favorites?.find(
          (f: FavoriteResponse) => f.offer.id === addFavoriteJsonResponseSnap.offer.id
        )?.offer.id
      ).toEqual(addFavoriteJsonResponseSnap.offer.id)

      expect(
        (queryCache.find('favorites')?.state?.data as PaginatedFavoritesResponse).favorites?.find(
          (f: FavoriteResponse) => f.id === 1000
        )
      ).toEqual({
        ...addFavoriteJsonResponseSnap,
        offer: {
          ...addFavoriteJsonResponseSnap.offer,
          date: addFavoriteJsonResponseSnap.offer.date,
        },
      })
    })
  })

  it('should add favorite and show error when adding an offer in favorite, and undo favorite add - logged in users', async () => {
    const { queryByTestId, getByTestId } = renderOfferHeader({
      isLoggedIn: true,
      hasAddFavoriteError: true,
      id: addFavoriteJsonResponseSnap.offer.id,
    })

    fireEvent.press(getByTestId('icon-favorite'))

    waitFor(() => {
      const mutateDataBetween = queryCache.find('favorites')?.state
        ?.data as PaginatedFavoritesResponse
      expect(
        mutateDataBetween.favorites?.find(
          (f: FavoriteResponse) => f.offer.id === addFavoriteJsonResponseSnap.offer.id
        )?.offer.id
      ).toBe(10000)

      expect(queryByTestId('icon-favorite-filled')).toBeTruthy()

      expect(showErrorSnackBar).toBeCalledWith({
        message: 'L’offre n’a pas été ajoutée à tes favoris',
        timeout: SNACK_BAR_TIME_OUT,
      })

      const mutateDataAfter = queryCache.find('favorites')?.state
        ?.data as PaginatedFavoritesResponse
      expect(
        mutateDataAfter.favorites?.find(
          (f: FavoriteResponse) => f.offer.id === addFavoriteJsonResponseSnap.offer.id
        )?.offer.id
      ).toBe(undefined)
    })
  })

  it('should remove favorite when pressing filled favorite icon - logged in users', () => {
    const favoriteOfferId = 146193
    const { getByTestId } = renderOfferHeader({ isLoggedIn: true, id: favoriteOfferId })

    waitFor(() => {
      const mutateDataBefore = queryCache.find('favorites')?.state
        ?.data as PaginatedFavoritesResponse
      expect(
        mutateDataBefore.favorites?.find((f: FavoriteResponse) => f.offer.id === favoriteOfferId)
          ?.offer.id
      ).toBe(favoriteOfferId)

      fireEvent.press(getByTestId('icon-favorite-filled'))
    })

    expect(getByTestId('icon-favorite')).toBeTruthy()

    waitFor(() => {
      const mutateData = queryCache.find('favorites')?.state?.data as PaginatedFavoritesResponse
      expect(
        mutateData.favorites?.find((f: FavoriteResponse) => f.offer.id === favoriteOfferId)?.offer
          .id
      ).toBe(undefined)
    })
  })

  it('should remove favorite and show error when pressing filled favorite icon, and restore favorite - logged in users', () => {
    const favoriteOfferId = 146193
    const { getByTestId } = renderOfferHeader({
      isLoggedIn: true,
      id: favoriteOfferId,
      hasRemoveFavoriteError: true,
    })

    waitFor(() => {
      fireEvent.press(getByTestId('icon-favorite-filled'))
    })

    waitFor(() => {
      expect(getByTestId('icon-favorite')).toBeTruthy()

      const mutateData = queryCache.find('favorites')?.state?.data as PaginatedFavoritesResponse
      expect(
        mutateData.favorites?.find((f: FavoriteResponse) => f.offer.id === favoriteOfferId)?.offer
          .id
      ).toBe(undefined)
    })

    waitFor(() => {
      expect(showErrorSnackBar).toBeCalledWith({
        message: 'L’offre n’a pas été retirée de tes favoris',
        timeout: SNACK_BAR_TIME_OUT,
      })

      const dataAfter = queryCache.find('favorites')?.state?.data as PaginatedFavoritesResponse
      expect(
        dataAfter.favorites?.find((f: FavoriteResponse) => f.offer.id === favoriteOfferId)?.offer.id
      ).toBe(favoriteOfferId)
    })
  })

  it('should add favorite and show error when user as too many favorites - logged in users', () => {
    const { getByTestId } = renderOfferHeader({
      isLoggedIn: true,
      id: addFavoriteJsonResponseSnap.offer.id,
      hasTooManyFavorites: true,
    })

    fireEvent.press(getByTestId('icon-favorite'))

    waitFor(() => {
      expect(showErrorSnackBar).toBeCalledWith({
        message: 'Trop de favoris enregistrés. Supprime des favoris pour en ajouter de nouveaux.',
        timeout: SNACK_BAR_TIME_OUT,
      })
    })
  })

  it('should add favorite and log analytic event logHasAddedOfferToFavorites with "favorites" as argument - logged in users', () => {
    const from = 'favorites'
    const moduleName = 'testModule'
    const offerId = addFavoriteJsonResponseSnap.offer.id
    useRoute.mockImplementationOnce(() => ({
      params: {
        from,
        moduleName,
      },
    }))
    const { getByTestId } = renderOfferHeader({
      isLoggedIn: true,
      id: offerId,
    })

    fireEvent.press(getByTestId('icon-favorite'))

    waitFor(() => {
      expect(analytics.logHasAddedOfferToFavorites).toBeCalledWith({ from, offerId, moduleName })
    })
  })

  describe('<OfferHeader /> - Analytics', () => {
    it('should log ShareOffer once when clicking on the Share button', () => {
      const { getByTestId } = renderOfferHeader({ isLoggedIn: true })

      fireEvent.press(getByTestId('icon-share'))
      expect(analytics.logShareOffer).toHaveBeenCalledTimes(1)
      expect(analytics.logShareOffer).toHaveBeenCalledWith(offerId)

      fireEvent.press(getByTestId('icon-share'))
      fireEvent.press(getByTestId('icon-share'))
      expect(analytics.logShareOffer).toHaveBeenCalledTimes(1)
    })
  })
})

const offerId = 116656

interface Options {
  id?: number
  isLoggedIn?: boolean
  hasAddFavoriteError?: boolean
  hasRemoveFavoriteError?: boolean
  hasTooManyFavorites?: boolean
}

const defaultOptions = {
  id: offerId,
  isLoggedIn: true,
  hasAddFavoriteError: false,
  hasRemoveFavoriteError: false,
  hasTooManyFavorites: false,
}

function renderOfferHeader(options: Options = defaultOptions) {
  const { id, isLoggedIn, hasAddFavoriteError, hasRemoveFavoriteError, hasTooManyFavorites } = {
    ...defaultOptions,
    ...options,
  }

  server.use(
    rest.get<OfferResponse>(`${env.API_BASE_URL}/native/v1/offer/${id}`, (req, res, ctx) =>
      res(ctx.status(200), ctx.json(offerResponseSnap))
    ),
    rest.get<Array<FavoriteResponse>>(
      `${env.API_BASE_URL}/native/v1/me/favorites`,
      (_req, res, ctx) => res(ctx.status(200), ctx.json(paginatedFavoritesResponseSnap))
    ),
    rest.post<EmptyResponse>(`${env.API_BASE_URL}/native/v1/me/favorites`, (req, res, ctx) => {
      if (hasAddFavoriteError) {
        return res(ctx.status(415), ctx.json({}))
      } else if (hasTooManyFavorites) {
        return res(ctx.status(400), ctx.json({ code: 'MAX_FAVORITES_REACHED' }))
      } else {
        return res(ctx.status(200), ctx.json(addFavoriteJsonResponseSnap))
      }
    }),
    rest.delete<EmptyResponse>(
      `${env.API_BASE_URL}/native/v1/me/favorites/${
        paginatedFavoritesResponseSnap.favorites.find((f) => f.offer.id === id)?.id
      }`,
      (_req, res, ctx) => (!hasRemoveFavoriteError ? res(ctx.status(204)) : res(ctx.status(422)))
    )
  )
  mockUseAuthContext.mockImplementationOnce(() => ({ isLoggedIn, setIsLoggedIn: jest.fn() }))
  mockedUseSnackBarContext.mockReturnValueOnce({
    hideSnackBar,
    showInfoSnackBar,
    showSuccessSnackBar,
    showErrorSnackBar,
  })
  const animatedValue = new Animated.Value(0)
  const wrapper = render(
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    reactQueryProviderHOC(
      <OfferHeader title="Some very nice offer" headerTransition={animatedValue} offerId={id} />
    )
  )
  return { ...wrapper, animatedValue }
}
