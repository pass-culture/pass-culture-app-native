import React from 'react'
import { Share } from 'react-native'

import { navigate } from '__mocks__/@react-navigation/native'
import { api } from 'api/api'
import {
  ExpenseDomain,
  FavoriteResponse,
  SubcategoriesResponseModelv2,
  UserProfileResponse,
  YoungStatusType,
} from 'api/gen'
import { initialFavoritesState } from 'features/favorites/context/reducer'
import { favoriteResponseSnap as favorite } from 'features/favorites/fixtures/favoriteResponseSnap'
import { analytics } from 'libs/analytics'
import { EmptyResponse } from 'libs/fetch'
import { placeholderData } from 'libs/subcategories/placeholderData'
import { Credit } from 'shared/user/useAvailableCredit'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, waitFor, screen, act } from 'tests/utils'
import { SNACK_BAR_TIME_OUT } from 'ui/components/snackBar/SnackBarContext'
import { SnackBarHelperSettings } from 'ui/components/snackBar/types'

import { Favorite } from './Favorite'

const mockShowErrorSnackBar = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showErrorSnackBar: jest.fn((props: SnackBarHelperSettings) => mockShowErrorSnackBar(props)),
  }),
}))

const credit: Credit = { amount: 100, isExpired: false }

const user: UserProfileResponse = {
  isBeneficiary: true,
  bookedOffers: {},
  domainsCredit: { [ExpenseDomain.all]: { initial: 500, remaining: 300 } },
  status: {
    statusType: YoungStatusType.beneficiary,
  },
} as UserProfileResponse
const onInAppBooking = jest.fn()

let mockDistance: string | null = null
jest.mock('libs/location/hooks/useDistance', () => ({
  useDistance: () => mockDistance,
}))

const mockFavoritesState = initialFavoritesState
jest.mock('features/favorites/context/FavoritesWrapper', () => ({
  useFavoritesState: () => ({
    favoritesState: mockFavoritesState,
  }),
}))

const shareSpy = jest.spyOn(Share, 'share').mockResolvedValue({ action: Share.sharedAction })

describe('<Favorite /> component', () => {
  beforeEach(() => {
    mockServer.getApiV1<SubcategoriesResponseModelv2>(`/subcategories/v2`, { ...placeholderData })
  })

  it('should navigate to the offer when clicking on the favorite', async () => {
    renderFavorite()

    const offre = screen.getByText(favorite.offer.name)
    await act(async () => {
      fireEvent.press(offre)
    })

    expect(navigate).toHaveBeenCalledWith('Offer', {
      from: 'favorites',
      id: favorite.offer.id,
    })
  })

  it('should show distance if geolocation enabled', async () => {
    mockDistance = '10 km'
    renderFavorite()
    await act(async () => {})

    expect(await screen.findByText('10 km')).toBeOnTheScreen()
  })

  it('should delete favorite on button click', async () => {
    const deleteFavoriteSpy = jest.spyOn(api, 'deleteNativeV1MeFavoritesfavoriteId')
    simulateBackend()
    mockDistance = '10 km'
    renderFavorite()

    fireEvent.press(screen.getByText('Supprimer'))

    await waitFor(() => {
      expect(deleteFavoriteSpy).toHaveBeenNthCalledWith(1, favorite.id)
      expect(mockShowErrorSnackBar).not.toHaveBeenCalled()
    })
  })

  it('should fail to delete favorite on button click', async () => {
    const deleteFavoriteSpy = jest.spyOn(api, 'deleteNativeV1MeFavoritesfavoriteId')
    const id = 0
    simulateBackend({ id, hasRemoveFavoriteError: true })
    mockDistance = '10 km'
    renderFavorite({
      favorite: { ...favorite, id, offer: { ...favorite.offer, id } },
    })

    fireEvent.press(screen.getByText('Supprimer'))

    await waitFor(() => {
      expect(deleteFavoriteSpy).toHaveBeenNthCalledWith(1, id)
      expect(mockShowErrorSnackBar).toHaveBeenCalledWith({
        message: 'L’offre n’a pas été retirée de tes favoris',
        timeout: SNACK_BAR_TIME_OUT,
      })
    })
  })

  it('should call share when press share icon', async () => {
    renderFavorite()

    const shareButton = await screen.findByLabelText(`Partager l’offre ${favorite.offer.name}`)
    await act(async () => {
      fireEvent.press(shareButton)
    })

    expect(shareSpy).toHaveBeenCalledTimes(1)
  })

  it('should log analytics when press share icon', async () => {
    renderFavorite()

    const shareButton = await screen.findByLabelText(`Partager l’offre ${favorite.offer.name}`)
    await act(async () => {
      fireEvent.press(shareButton)
    })

    expect(analytics.logShare).toHaveBeenNthCalledWith(1, {
      type: 'Offer',
      from: 'favorites',
      offerId: favorite.offer.id,
    })
  })
})

type Options = {
  id?: number
  hasRemoveFavoriteError?: boolean
}

const DEFAULT_GET_FAVORITE_OPTIONS = {
  id: favorite.id,
  hasRemoveFavoriteError: false,
}

function simulateBackend(options: Options = DEFAULT_GET_FAVORITE_OPTIONS) {
  const { id, hasRemoveFavoriteError } = { ...DEFAULT_GET_FAVORITE_OPTIONS, ...options }
  mockServer.deleteApiV1<EmptyResponse>(`/me/favorites/${id}`, {
    responseOptions: {
      statusCode: hasRemoveFavoriteError ? 422 : 204,
      data: {},
    },
  })
}

const DEFAULT_PROPS = {
  credit,
  favorite,
  user,
  onInAppBooking,
}

type RenderFavoriteParams = {
  favorite?: FavoriteResponse
  user?: UserProfileResponse
}

function renderFavorite(props: RenderFavoriteParams = DEFAULT_PROPS) {
  const { favorite, user } = { ...DEFAULT_PROPS, ...props }
  return render(
    reactQueryProviderHOC(
      <Favorite favorite={favorite} user={user} onInAppBooking={onInAppBooking} />
    )
  )
}
