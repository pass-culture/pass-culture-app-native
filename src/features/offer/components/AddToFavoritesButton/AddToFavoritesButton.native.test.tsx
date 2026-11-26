import React from 'react'

import { api } from 'api/api'
import { FavoriteOfferResponseV2, PaginatedResponseFavoriteOfferResponseV2 } from 'api/gen'
import { favoriteResponseSnap } from 'features/favorites/fixtures/favoriteResponseSnap'
import { paginatedOfferFavoritesResponseSnap } from 'features/favorites/fixtures/paginatedOfferFavoritesResponseSnap'
import { simulateBackendForOffer } from 'features/favorites/tests/simulateBackendForOffer'
import { AddToFavoritesButton } from 'features/offer/components/AddToFavoritesButton/AddToFavoritesButton'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent, waitFor } from 'tests/utils'
import * as SnackBarStore from 'ui/designSystem/Snackbar/snackBar.store'

jest.mock('libs/network/NetInfoWrapper')

jest.mock('libs/jwt/jwt')
jest.mock('features/auth/context/AuthContext')

const postFavoritesSpy = jest.spyOn(api, 'postNativeV2MeFavoritesOffers')
const mockSnackBarOpen = jest.spyOn(SnackBarStore.snackBarActions, 'open')

const user = userEvent.setup()

jest.useFakeTimers()

describe('<AddToFavoriteButton />', () => {
  beforeEach(() => {
    mockServer.getApi<PaginatedResponseFavoriteOfferResponseV2>(
      '/v2/me/favorites/offers',
      paginatedOfferFavoritesResponseSnap
    )
    setFeatureFlags()
  })

  it('should render nothing when offer already in favorite', async () => {
    const favoriteOfferId = 146193
    renderButton({ offerId: favoriteOfferId })

    await waitFor(() => {
      expect(screen.queryByText('Mettre en favori')).not.toBeOnTheScreen()
    })
  })

  it('should add favorite', async () => {
    mockServer.postApi<FavoriteOfferResponseV2>('/v2/me/favorites/offers', favoriteResponseSnap)

    renderButton({
      offerId: favoriteResponseSnap.offer.id,
    })

    await user.press(screen.getByText('Mettre en favori'))

    expect(postFavoritesSpy).toHaveBeenCalledTimes(1)
  })

  it('should not call onFavoriteSuccess when adding favorite fails', async () => {
    simulateBackendForOffer({
      id: favoriteResponseSnap.offer.id,
      hasAddFavoriteError: true,
    })
    const onFavoriteSuccess = jest.fn()
    renderButton({ offerId: favoriteResponseSnap.offer.id, onFavoriteSuccess })

    await user.press(screen.getByText('Mettre en favori'))

    await waitFor(() => {
      expect(mockSnackBarOpen).toHaveBeenCalledWith(
        'L’offre n’a pas été ajoutée à tes favoris',
        'error'
      )
    })

    expect(onFavoriteSuccess).not.toHaveBeenCalled()
  })
})

const renderButton = ({
  offerId,
  onFavoriteSuccess,
}: {
  offerId: number
  onFavoriteSuccess?: () => void
}) => {
  return render(
    reactQueryProviderHOC(
      <AddToFavoritesButton offerId={offerId} onFavoriteSuccess={onFavoriteSuccess} />
    )
  )
}
