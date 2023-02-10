import { rest } from 'msw'
import React from 'react'
import { Animated } from 'react-native'

import { useRoute } from '__mocks__/@react-navigation/native'
import { FavoriteResponse, OfferResponse, PaginatedFavoritesResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { favoriteResponseSnap } from 'features/favorites/fixtures/favoriteResponseSnap'
import { paginatedFavoritesResponseSnap } from 'features/favorites/fixtures/paginatedFavoritesResponseSnap'
import { mockGoBack } from 'features/navigation/__mocks__/useGoBack'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { env } from 'libs/environment'
import { EmptyResponse } from 'libs/fetch'
import { analytics } from 'libs/firebase/analytics'
import { reactQueryProviderHOC, queryCache } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { act, fireEvent, render, screen, waitFor } from 'tests/utils'
import {
  showSuccessSnackBar,
  showErrorSnackBar,
  hideSnackBar,
  showInfoSnackBar,
} from 'ui/components/snackBar/__mocks__/SnackBarContext'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { LINE_BREAK } from 'ui/theme/constants'

import { OfferHeader } from '../OfferHeader/OfferHeader'

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

describe('<OfferHeader />', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })

  it('should render all the icons', () => {
    const offerHeader = renderOfferHeader()
    expect(offerHeader.queryByTestId('animated-icon-back')).toBeTruthy()
    expect(offerHeader.queryByTestId('animated-icon-share')).toBeTruthy()
    expect(offerHeader.queryByTestId('animated-icon-favorite')).toBeTruthy()
  })

  it('should goBack when we press on the back button', () => {
    const { getByTestId } = renderOfferHeader()
    fireEvent.press(getByTestId('animated-icon-back'))
    expect(mockGoBack).toHaveBeenCalledTimes(1)
  })

  it('should fully display the title at the end of the animation', async () => {
    const { animatedValue, getByTestId } = renderOfferHeader()
    expect(getByTestId('offerHeaderName').props.accessibilityHidden).toBeTruthy()
    expect(getByTestId('offerHeaderName').props.style.opacity).toBe(0)

    act(() => {
      Animated.timing(animatedValue, { duration: 100, toValue: 1, useNativeDriver: false }).start()
      jest.advanceTimersByTime(100)
    })

    await waitFor(() => {
      expect(getByTestId('offerHeaderName').props.accessibilityHidden).toBeFalsy()
      expect(getByTestId('offerHeaderName').props.style.opacity).toBe(1)
    })
  })

  it('should display SignIn modal when pressing Favorite - not logged in users', () => {
    mockUseAuthContext.mockReturnValueOnce({
      isLoggedIn: false,
      setIsLoggedIn: jest.fn(),
      refetchUser: jest.fn(),
      isUserLoading: false,
    })
    const { getByTestId, getByText } = renderOfferHeader()
    fireEvent.press(getByTestId('animated-icon-favorite'))
    expect(getByText('Identifie-toi pour' + LINE_BREAK + 'retrouver tes favoris')).toBeTruthy()
  })

  it('should show a favorite filled icon when viewing a offer in favorite - logged in users', async () => {
    const favoriteOfferId = 146193
    const { getByTestId } = renderOfferHeader({ id: favoriteOfferId })

    await waitFor(() => {
      expect(getByTestId('animated-icon-favorite-filled')).toBeTruthy()
    })
  })

  it('should add favorite when adding an offer in favorite - logged in users', async () => {
    const { getByTestId } = renderOfferHeader({
      id: favoriteResponseSnap.offer.id,
    })

    fireEvent.press(getByTestId('animated-icon-favorite'))

    await waitFor(() => {
      expect(getByTestId('animated-icon-favorite-filled')).toBeTruthy()

      const mutateData = queryCache.find('favorites')?.state?.data as PaginatedFavoritesResponse
      expect(
        mutateData.favorites?.find(
          (f: FavoriteResponse) => f.offer.id === favoriteResponseSnap.offer.id
        )?.offer.id
      ).toEqual(favoriteResponseSnap.offer.id)

      expect(
        (queryCache.find('favorites')?.state?.data as PaginatedFavoritesResponse).favorites?.find(
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

  it('should show favorite list modal when pressing favorite icon', async () => {
    const favoriteOfferId = 146193
    renderOfferHeader({ id: favoriteOfferId })

    await act(async () => fireEvent.press(screen.getByTestId('animated-icon-favorite')))

    expect(screen.getByText('Crée une liste de favoris !')).toBeTruthy()
  })

  it('should remove favorite when pressing filled favorite icon - logged in users', async () => {
    const favoriteOfferId = 146193
    const { getByTestId } = renderOfferHeader({ id: favoriteOfferId })

    await waitFor(async () => {
      fireEvent.press(getByTestId('animated-icon-favorite-filled'))

      await waitFor(() => {
        expect(getByTestId('animated-icon-favorite')).toBeTruthy()
      })
    })
  })

  it('should show error snackbar when remove favorite fails - logged in users', async () => {
    const favoriteOfferId = 146193
    const { getByTestId } = renderOfferHeader({
      id: favoriteOfferId,
      hasRemoveFavoriteError: true,
    })

    await waitFor(async () => {
      fireEvent.press(getByTestId('animated-icon-favorite-filled'))

      await waitFor(() => {
        expect(showErrorSnackBar).toHaveBeenCalledWith({
          message: 'L’offre n’a pas été retirée de tes favoris',
          timeout: SNACK_BAR_TIME_OUT,
        })
      })
    })
  })

  it('should show error when adding an offer in favorite fails because user as too many favorites - logged in users', async () => {
    const { getByTestId } = renderOfferHeader({
      hasTooManyFavorites: true,
      id: favoriteResponseSnap.offer.id,
    })

    fireEvent.press(getByTestId('animated-icon-favorite'))

    await waitFor(() => {
      expect(showErrorSnackBar).toHaveBeenCalledWith({
        message: 'Trop de favoris enregistrés. Supprime des favoris pour en ajouter de nouveaux.',
        timeout: SNACK_BAR_TIME_OUT,
      })
    })
  })

  it('should add favorite and log analytic event logHasAddedOfferToFavorites with "favorites" as argument - logged in users', async () => {
    const from = 'favorites'
    const moduleName = 'testModule'
    const offerId = favoriteResponseSnap.offer.id
    useRoute.mockImplementationOnce(() => ({
      params: {
        from,
        moduleName,
      },
    }))
    const { getByTestId } = renderOfferHeader({
      id: offerId,
    })

    fireEvent.press(getByTestId('animated-icon-favorite'))

    await waitFor(() => {
      expect(analytics.logHasAddedOfferToFavorites).toHaveBeenCalledWith({
        from,
        offerId,
        moduleName,
      })
    })
  })

  it('should log analytics when clicking on the share button', () => {
    const { getByLabelText } = renderOfferHeader()

    const shareButton = getByLabelText('Partager')
    fireEvent.press(shareButton)

    expect(analytics.logShare).toHaveBeenNthCalledWith(1, {
      type: 'Offer',
      from: 'offer',
      id: offerId,
    })
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

function renderOfferHeader(options: Options = defaultOptions) {
  const { id, hasAddFavoriteError, hasRemoveFavoriteError, hasTooManyFavorites } = {
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
    rest.post<EmptyResponse>(`${env.API_BASE_URL}/native/v1/me/favorites`, (_req, res, ctx) => {
      if (hasAddFavoriteError) {
        return res(ctx.status(415), ctx.json({}))
      } else if (hasTooManyFavorites) {
        return res(ctx.status(400), ctx.json({ code: 'MAX_FAVORITES_REACHED' }))
      } else {
        return res(ctx.status(200), ctx.json(favoriteResponseSnap))
      }
    }),
    rest.delete<EmptyResponse>(
      `${env.API_BASE_URL}/native/v1/me/favorites/${
        paginatedFavoritesResponseSnap.favorites.find((f) => f.offer.id === id)?.id
      }`,
      (_req, res, ctx) => (!hasRemoveFavoriteError ? res(ctx.status(204)) : res(ctx.status(422)))
    )
  )

  const animatedValue = new Animated.Value(0)
  const wrapper = render(
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    reactQueryProviderHOC(
      <OfferHeader title="Some very nice offer" headerTransition={animatedValue} offerId={id} />
    )
  )
  return { ...wrapper, animatedValue }
}
