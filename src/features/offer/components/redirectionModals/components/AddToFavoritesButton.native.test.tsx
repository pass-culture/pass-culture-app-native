import { rest } from 'msw'
import React from 'react'

import { FavoriteResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/AuthContext'
import {
  paginatedFavoritesResponseSnap,
  addFavoriteJsonResponseSnap,
} from 'features/favorites/fixtures/favoritesResponse'
import { AddToFavoritesButton } from 'features/offer/components/redirectionModals/components/AddToFavoritesButton'
import { env } from 'libs/environment'
import { EmptyResponse } from 'libs/fetch'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { fireEvent, waitFor, render } from 'tests/utils'

jest.mock('features/auth/AuthContext')
const mockUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>
mockUseAuthContext.mockReturnValue({
  isLoggedIn: true,
  setIsLoggedIn: jest.fn(),
})

const mockPostFavorite = jest.fn()

describe('<AddToFavoriteButton />', () => {
  it('should render nothing when offer already in favorite', async () => {
    const favoriteOfferId = 146193
    const { queryByText } = renderButton({ offerId: favoriteOfferId })

    await waitFor(() => {
      expect(queryByText('Mettre en favori')).toBeNull()
    })
  })

  it('should add favorite', async () => {
    const { getByText } = renderButton({
      offerId: addFavoriteJsonResponseSnap.offer.id,
    })

    fireEvent.press(getByText('Mettre en favori'))

    await waitFor(() => {
      expect(mockPostFavorite).toHaveBeenCalledTimes(1)
    })
  })
})

type Options = {
  offerId?: number
  hasAddFavoriteError?: boolean
  hasTooManyFavorites?: boolean
}

const defaultOptions = {
  offerId: 116656,
  hasAddFavoriteError: false,
  hasTooManyFavorites: false,
}

const renderButton = (options?: Options) => {
  const { offerId, hasAddFavoriteError } = {
    ...defaultOptions,
    ...options,
  }

  server.use(
    rest.get<Array<FavoriteResponse>>(
      `${env.API_BASE_URL}/native/v1/me/favorites`,
      (_req, res, ctx) => res(ctx.status(200), ctx.json(paginatedFavoritesResponseSnap))
    ),
    rest.post<EmptyResponse>(`${env.API_BASE_URL}/native/v1/me/favorites`, (_req, res, ctx) => {
      if (hasAddFavoriteError) {
        return res(ctx.status(415), ctx.json({}))
      } else {
        mockPostFavorite()
        return res(ctx.status(200), ctx.json(addFavoriteJsonResponseSnap))
      }
    })
  )
  // eslint-disable-next-line local-rules/no-react-query-provider-hoc
  return render(reactQueryProviderHOC(<AddToFavoritesButton offerId={offerId} />))
}
