import { renderHook } from '@testing-library/react-hooks'
import { rest } from 'msw'
import * as React from 'react'
import { View } from 'react-native'

import { FavoriteResponse, OfferResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/AuthContext'
import {
  addFavoriteJsonResponseSnap,
  paginatedFavoritesResponseSnap,
} from 'features/favorites/api/snaps/favorisResponseSnap'
import { FavoritesWrapper } from 'features/favorites/pages/FavoritesWrapper'
import { offerResponseSnap } from 'features/offer/api/snaps/offerResponseSnap'
import { env } from 'libs/environment'
import { EmptyResponse } from 'libs/fetch'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { superFlushWithAct } from 'tests/utils'

import { useFavorites, useRemoveFavorite, useAddFavorite, useFavorite } from '../useFavorites'

jest.mock('features/auth/AuthContext')
const mockUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>

const offerId = 116656

interface Options {
  id?: number
  hasAddFavoriteError?: boolean
  hasRemoveFavoriteError?: boolean
}

const defaultOptions = {
  id: offerId,
  hasAddFavoriteError: false,
  hasRemoveFavoriteError: false,
}

function simulateBackend(options: Options = defaultOptions) {
  const { id, hasAddFavoriteError, hasRemoveFavoriteError } = { ...defaultOptions, ...options }
  server.use(
    rest.get<OfferResponse>(`${env.API_BASE_URL}/native/v1/offer/${id}`, (req, res, ctx) =>
      res(ctx.status(200), ctx.json(offerResponseSnap))
    ),
    rest.get<Array<FavoriteResponse>>(
      `${env.API_BASE_URL}/native/v1/me/favorites`,
      (req, res, ctx) => res(ctx.status(200), ctx.json(paginatedFavoritesResponseSnap))
    ),
    rest.post<EmptyResponse>(`${env.API_BASE_URL}/native/v1/me/favorites`, (req, res, ctx) =>
      !hasAddFavoriteError
        ? res(ctx.status(200), ctx.json(addFavoriteJsonResponseSnap))
        : res(ctx.status(422), ctx.json({}))
    ),
    rest.delete<EmptyResponse>(
      `${env.API_BASE_URL}/native/v1/me/favorites/${
        paginatedFavoritesResponseSnap.favorites.find((f) => f.offer.id === id)?.id
      }`,
      (req, res, ctx) =>
        !hasRemoveFavoriteError ? res(ctx.status(204)) : res(ctx.status(422), ctx.json({}))
    )
  )
}

describe('useFavorites hook', () => {
  afterEach(jest.resetAllMocks)

  it('should retrieve favorite data when logged in', async () => {
    simulateBackend()
    mockUseAuthContext.mockImplementationOnce(() => ({
      isLoggedIn: true,
      setIsLoggedIn: jest.fn(),
    }))
    const { result, waitFor } = renderHook(useFavorites, {
      wrapper: (props) =>
        reactQueryProviderHOC(
          <FavoritesWrapper>
            <View>{props.children}</View>
          </FavoritesWrapper>
        ),
    })

    expect(result.current.isFetching).toEqual(true)
    await waitFor(() => result.current.isSuccess)

    expect(result.current.isSuccess).toEqual(true)
    expect(result.current.data?.favorites.length).toEqual(
      paginatedFavoritesResponseSnap.favorites.length
    )
  })

  it('should return null when not logged in', async () => {
    mockUseAuthContext.mockImplementationOnce(() => ({
      isLoggedIn: false,
      setIsLoggedIn: jest.fn(),
    }))

    const { result } = renderHook(useFavorites, {
      wrapper: (props) =>
        reactQueryProviderHOC(
          <FavoritesWrapper>
            <View>{props.children}</View>
          </FavoritesWrapper>
        ),
    })

    expect(result.current.isFetching).toEqual(false)
  })
})

describe('useAddFavorite hook', () => {
  afterEach(jest.resetAllMocks)

  it('should add favorite', async () => {
    simulateBackend({
      id: offerId,
      hasAddFavoriteError: false,
      hasRemoveFavoriteError: false,
    })
    mockUseAuthContext.mockImplementationOnce(() => ({
      isLoggedIn: true,
      setIsLoggedIn: jest.fn(),
    }))
    const onSuccess = jest.fn()
    const onMutate = jest.fn()
    const onError = jest.fn()
    const onSettled = jest.fn()
    const { result, waitFor } = renderHook(
      () =>
        useAddFavorite({
          onSuccess,
          onMutate,
          onError,
          onSettled,
        }),
      {
        wrapper: (props) =>
          reactQueryProviderHOC(
            <FavoritesWrapper>
              <View>{props.children}</View>
            </FavoritesWrapper>
          ),
      }
    )

    expect(result.current.isLoading).toBeFalsy()
    result.current.mutate({ offerId })
    await superFlushWithAct()
    await waitFor(() => {
      expect(onMutate).toBeCalledWith({ offerId })
    })

    await superFlushWithAct()
    expect(onSuccess).toBeCalledWith({
      ...addFavoriteJsonResponseSnap,
      offer: {
        ...addFavoriteJsonResponseSnap.offer,
        date: addFavoriteJsonResponseSnap.offer.date?.toISOString(),
      },
    })
    expect(onError).not.toBeCalled()
    expect(onSettled).toBeCalled()
  })

  it('should fail to add favorite', async () => {
    simulateBackend({
      id: offerId,
      hasAddFavoriteError: true,
      hasRemoveFavoriteError: false,
    })
    mockUseAuthContext.mockImplementationOnce(() => ({
      isLoggedIn: true,
      setIsLoggedIn: jest.fn(),
    }))
    const onSuccess = jest.fn()
    const onMutate = jest.fn()
    const onError = jest.fn()
    const onSettled = jest.fn()
    const { result, waitFor } = renderHook(
      () =>
        useAddFavorite({
          onSuccess,
          onMutate,
          onError,
          onSettled,
        }),
      {
        wrapper: (props) =>
          reactQueryProviderHOC(
            <FavoritesWrapper>
              <View>{props.children}</View>
            </FavoritesWrapper>
          ),
      }
    )

    expect(result.current.isLoading).toBeFalsy()
    result.current.mutate({ offerId })
    await superFlushWithAct()
    await waitFor(() => {
      expect(onMutate).toBeCalledWith({ offerId })
    })

    await superFlushWithAct()
    expect(onSuccess).not.toBeCalled()
    expect(onError).toBeCalled()
    expect(onSettled).toBeCalled()
  })
})

describe('useRemoveFavorite hook', () => {
  afterEach(jest.resetAllMocks)

  it('should remove favorite', async () => {
    const favorite = paginatedFavoritesResponseSnap.favorites[0]
    const favoriteId = favorite.id
    simulateBackend({
      id: favorite.offer.id,
      hasAddFavoriteError: false,
      hasRemoveFavoriteError: false,
    })
    mockUseAuthContext.mockImplementationOnce(() => ({
      isLoggedIn: true,
      setIsLoggedIn: jest.fn(),
    }))
    const onSuccess = jest.fn()
    const onMutate = jest.fn()
    const onError = jest.fn()
    const onSettled = jest.fn()
    const { result, waitFor } = renderHook(
      () =>
        useRemoveFavorite({
          onSuccess,
          onMutate,
          onError,
          onSettled,
        }),
      {
        wrapper: (props) =>
          reactQueryProviderHOC(
            <FavoritesWrapper>
              <View>{props.children}</View>
            </FavoritesWrapper>
          ),
      }
    )

    expect(result.current.isLoading).toBeFalsy()
    result.current.mutate(favoriteId)
    await superFlushWithAct()
    await waitFor(() => {
      expect(onMutate).toBeCalledWith(favoriteId)
    })

    await superFlushWithAct()
    expect(onSuccess).toBeCalled()
    expect(onError).not.toBeCalled()
    expect(onSettled).toBeCalled()
  })

  it('should fail to remove favorite', async () => {
    const favorite = paginatedFavoritesResponseSnap.favorites[0]
    const favoriteId = favorite.id
    simulateBackend({
      id: favorite.offer.id,
      hasAddFavoriteError: false,
      hasRemoveFavoriteError: true,
    })
    mockUseAuthContext.mockImplementationOnce(() => ({
      isLoggedIn: true,
      setIsLoggedIn: jest.fn(),
    }))
    const onSuccess = jest.fn()
    const onMutate = jest.fn()
    const onError = jest.fn()
    const onSettled = jest.fn()
    const { result, waitFor } = renderHook(
      () =>
        useRemoveFavorite({
          onSuccess,
          onMutate,
          onError,
          onSettled,
        }),
      {
        wrapper: (props) =>
          reactQueryProviderHOC(
            <FavoritesWrapper>
              <View>{props.children}</View>
            </FavoritesWrapper>
          ),
      }
    )

    expect(result.current.isLoading).toBeFalsy()
    result.current.mutate(favoriteId)
    await superFlushWithAct()
    await waitFor(() => {
      expect(onMutate).toBeCalledWith(favoriteId)
    })

    await superFlushWithAct()
    expect(onSuccess).not.toBeCalled()
    expect(onError).toBeCalled()
    expect(onSettled).toBeCalled()
  })
})

describe('useFavorite hook', () => {
  afterEach(jest.resetAllMocks)

  it('should get favorite from offer id', async () => {
    const favorite = paginatedFavoritesResponseSnap.favorites[0]
    simulateBackend({
      id: favorite.offer.id,
      hasAddFavoriteError: false,
      hasRemoveFavoriteError: false,
    })
    mockUseAuthContext.mockReturnValue({
      isLoggedIn: true,
      setIsLoggedIn: jest.fn(),
    })
    const { result, waitFor } = renderHook(
      () =>
        useFavorite({
          offerId: favorite.offer.id,
        }),
      {
        wrapper: (props) =>
          reactQueryProviderHOC(
            <FavoritesWrapper>
              <View>{props.children}</View>
            </FavoritesWrapper>
          ),
      }
    )
    await superFlushWithAct()
    await waitFor(() => {
      expect(result.current).toEqual({
        ...favorite,
        offer: {
          ...favorite.offer,
          date: favorite.offer.date?.toISOString(),
        },
      })
    })
  })

  it('should get favorite from id', async () => {
    const favorite = paginatedFavoritesResponseSnap.favorites[0]
    const favoriteId = favorite.id
    simulateBackend({
      id: favorite.offer.id,
      hasAddFavoriteError: false,
      hasRemoveFavoriteError: false,
    })
    mockUseAuthContext.mockReturnValue({
      isLoggedIn: true,
      setIsLoggedIn: jest.fn(),
    })
    const { result, waitFor } = renderHook(
      () =>
        useFavorite({
          id: favoriteId,
        }),
      {
        wrapper: (props) =>
          reactQueryProviderHOC(
            <FavoritesWrapper>
              <View>{props.children}</View>
            </FavoritesWrapper>
          ),
      }
    )
    await superFlushWithAct()
    await waitFor(() => {
      expect(result.current).toEqual({
        ...favorite,
        offer: {
          ...favorite.offer,
          date: favorite.offer.date?.toISOString(),
        },
      })
    })
  })

  it('should get favorite from id and offer id', async () => {
    const favorite = paginatedFavoritesResponseSnap.favorites[0]
    const favoriteId = favorite.id
    simulateBackend({
      id: favorite.offer.id,
      hasAddFavoriteError: false,
      hasRemoveFavoriteError: false,
    })
    mockUseAuthContext.mockReturnValue({
      isLoggedIn: true,
      setIsLoggedIn: jest.fn(),
    })
    const { result, waitFor } = renderHook(
      () =>
        useFavorite({
          id: favoriteId,
          offerId: favorite.offer.id,
        }),
      {
        wrapper: (props) =>
          reactQueryProviderHOC(
            <FavoritesWrapper>
              <View>{props.children}</View>
            </FavoritesWrapper>
          ),
      }
    )
    await superFlushWithAct()
    await waitFor(() => {
      expect(result.current).toEqual({
        ...favorite,
        offer: {
          ...favorite.offer,
          date: favorite.offer.date?.toISOString(),
        },
      })
    })
  })

  it('should not get favorite from offer id', async () => {
    const favorite = paginatedFavoritesResponseSnap.favorites[0]
    simulateBackend({
      id: favorite.offer.id,
      hasAddFavoriteError: false,
      hasRemoveFavoriteError: false,
    })
    mockUseAuthContext.mockReturnValue({
      isLoggedIn: true,
      setIsLoggedIn: jest.fn(),
    })
    const { result, waitFor } = renderHook(
      () =>
        useFavorite({
          offerId: 99999,
        }),
      {
        wrapper: (props) =>
          reactQueryProviderHOC(
            <FavoritesWrapper>
              <View>{props.children}</View>
            </FavoritesWrapper>
          ),
      }
    )
    await superFlushWithAct()
    await waitFor(() => {
      expect(result.current).toEqual(undefined)
    })
  })

  it('should not get favorite from id', async () => {
    const favorite = paginatedFavoritesResponseSnap.favorites[0]
    simulateBackend({
      id: favorite.offer.id,
      hasAddFavoriteError: false,
      hasRemoveFavoriteError: false,
    })
    mockUseAuthContext.mockReturnValue({
      isLoggedIn: true,
      setIsLoggedIn: jest.fn(),
    })
    const { result, waitFor } = renderHook(
      () =>
        useFavorite({
          id: 99999,
        }),
      {
        wrapper: (props) =>
          reactQueryProviderHOC(
            <FavoritesWrapper>
              <View>{props.children}</View>
            </FavoritesWrapper>
          ),
      }
    )
    await superFlushWithAct()
    await waitFor(() => {
      expect(result.current).toEqual(undefined)
    })
  })

  it('should not get favorite from id and offer id', async () => {
    const favorite = paginatedFavoritesResponseSnap.favorites[0]
    simulateBackend({
      id: favorite.offer.id,
      hasAddFavoriteError: false,
      hasRemoveFavoriteError: false,
    })
    mockUseAuthContext.mockReturnValue({
      isLoggedIn: true,
      setIsLoggedIn: jest.fn(),
    })
    const { result, waitFor } = renderHook(
      () =>
        useFavorite({
          id: 99999,
          offerId: 99999,
        }),
      {
        wrapper: (props) =>
          reactQueryProviderHOC(
            <FavoritesWrapper>
              <View>{props.children}</View>
            </FavoritesWrapper>
          ),
      }
    )
    await superFlushWithAct()
    await waitFor(() => {
      expect(result.current).toEqual(undefined)
    })
  })

  it('should not get favorite when not logged in', async () => {
    const favorite = paginatedFavoritesResponseSnap.favorites[0]
    simulateBackend({
      id: favorite.offer.id,
      hasAddFavoriteError: false,
      hasRemoveFavoriteError: false,
    })
    mockUseAuthContext.mockReturnValue({
      isLoggedIn: false,
      setIsLoggedIn: jest.fn(),
    })
    const { result, waitFor } = renderHook(
      () =>
        useFavorite({
          id: favorite.id,
        }),
      {
        wrapper: (props) =>
          reactQueryProviderHOC(
            <FavoritesWrapper>
              <View>{props.children}</View>
            </FavoritesWrapper>
          ),
      }
    )
    await superFlushWithAct()
    await waitFor(() => {
      expect(result.current).toEqual(null)
    })
  })
})
