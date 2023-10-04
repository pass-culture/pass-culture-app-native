import React from 'react'

import * as API from 'api/api'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { favoriteResponseSnap } from 'features/favorites/fixtures/favoriteResponseSnap'
import { simulateBackend } from 'features/favorites/helpers/simulateBackend'
import { AddToFavoritesButton } from 'features/offer/components/AddToFavoritesButton/AddToFavoritesButton'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, waitFor, render, screen } from 'tests/utils'

jest.mock('features/auth/context/AuthContext')
const mockUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>
mockUseAuthContext.mockReturnValue({
  isLoggedIn: true,
  setIsLoggedIn: jest.fn(),
  refetchUser: jest.fn(),
  isUserLoading: false,
})
const apiPostFavoritesSpy = jest.spyOn(API.api, 'postNativeV1MeFavorites')

describe('<AddToFavoriteButton />', () => {
  it('should render nothing when offer already in favorite', async () => {
    const favoriteOfferId = 146193
    renderButton({ offerId: favoriteOfferId })

    await waitFor(() => {
      expect(screen.queryByText('Mettre en favori')).not.toBeOnTheScreen()
    })
  })

  it('should add favorite', async () => {
    renderButton({
      offerId: favoriteResponseSnap.offer.id,
    })

    fireEvent.press(screen.getByText('Mettre en favori'))

    await waitFor(() => {
      expect(apiPostFavoritesSpy).toHaveBeenCalledTimes(1)
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

  simulateBackend({
    id: offerId,
    hasAddFavoriteError,
  })
  if (hasAddFavoriteError) {
    mockServer.postAPIV1('/native/v1/me/favorites', { statuscode: 415 })
  } else {
    mockServer.postAPIV1('/native/v1/me/favorites', favoriteResponseSnap)
  }
  // eslint-disable-next-line local-rules/no-react-query-provider-hoc
  return render(reactQueryProviderHOC(<AddToFavoritesButton offerId={offerId} />))
}
