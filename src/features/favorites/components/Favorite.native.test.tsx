import { rest } from 'msw'
import React from 'react'
import { Share } from 'react-native'

import { navigate } from '__mocks__/@react-navigation/native'
import { api } from 'api/api'
import { ExpenseDomain, FavoriteResponse, SubcategoryIdEnum, UserProfileResponse } from 'api/gen'
import { initialFavoritesState } from 'features/favorites/context/reducer'
import { Credit } from 'features/user/helpers/useAvailableCredit'
import { env } from 'libs/environment'
import { EmptyResponse } from 'libs/fetch'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { act, fireEvent, render, cleanup, waitFor } from 'tests/utils'
import { SNACK_BAR_TIME_OUT } from 'ui/components/snackBar/SnackBarContext'
import { SnackBarHelperSettings } from 'ui/components/snackBar/types'

import { Favorite } from './Favorite'

// TODO(lucasBeneston): voir pour ne pas mocker
jest.mock('features/offer/api/useOffer')

const mockShowErrorSnackBar = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showErrorSnackBar: jest.fn((props: SnackBarHelperSettings) => mockShowErrorSnackBar(props)),
  }),
}))

const credit: Credit = { amount: 100, isExpired: false }
const favorite: FavoriteResponse = {
  id: 393,
  offer: {
    coordinates: { latitude: 48.9263, longitude: 2.49008 },
    date: null,
    expenseDomains: [ExpenseDomain.all],
    externalTicketOfficeUrl: 'https://externalbooking.test.com',
    id: 146105,
    subcategoryId: SubcategoryIdEnum.TELECHARGEMENT_MUSIQUE,
    image: {
      credit: null,
      url: 'https://storage.gra.cloud.ovh.net/v1/AUTH_688df1e25bd84a48a3804e7fa8938085/storage-pc-dev/thumbs/mediations/CWMA',
    },
    name: 'Un lit sous une rivière',
    price: null,
    startDate: '2021-03-04T20:00:00',
    startPrice: 270,
    isSoldOut: false,
    isExpired: false,
    isReleased: true,
  },
}
const user: UserProfileResponse = {
  isBeneficiary: true,
  bookedOffers: {},
  domainsCredit: { [ExpenseDomain.all]: { initial: 500, remaining: 300 } },
} as UserProfileResponse
const onInAppBooking = jest.fn()

let mockDistance: string | null = null
jest.mock('libs/geolocation/hooks/useDistance', () => ({
  useDistance: () => mockDistance,
}))

const mockFavoritesState = initialFavoritesState
jest.mock('features/favorites/context/FavoritesWrapper', () => ({
  useFavoritesState: () => ({
    favoritesState: mockFavoritesState,
  }),
}))

describe('<Favorite /> component', () => {
  beforeEach(() => jest.useFakeTimers())
  afterEach(async () => {
    jest.runOnlyPendingTimers()
    cleanup()
  })

  it('should navigate to the offer when clicking on the favorite', async () => {
    const { getByText } = renderFavorite()

    act(() => {
      const offre = getByText(favorite.offer.name)
      fireEvent.press(offre)
    })

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('Offer', {
        from: 'favorites',
        id: favorite.offer.id,
      })
    })
  })

  it('should show distance if geolocation enabled', () => {
    mockDistance = '10 km'
    const { queryByText } = renderFavorite()
    expect(queryByText('10 km')).toBeTruthy()
  })

  it('should delete favorite on button click', async () => {
    const deleteFavoriteSpy = jest.spyOn(api, 'deletenativev1mefavoritesfavoriteId')
    simulateBackend()
    mockDistance = '10 km'
    const { getByText } = renderFavorite()

    act(() => {
      fireEvent.press(getByText('Supprimer'))
    })

    await waitFor(() => {
      expect(deleteFavoriteSpy).toHaveBeenNthCalledWith(1, favorite.id)
      expect(mockShowErrorSnackBar).not.toHaveBeenCalled()
    })
  })

  it('should fail to delete favorite on button click', async () => {
    const deleteFavoriteSpy = jest.spyOn(api, 'deletenativev1mefavoritesfavoriteId')
    const id = 0
    simulateBackend({ id, hasRemoveFavoriteError: true })
    mockDistance = '10 km'
    const { getByText } = renderFavorite({
      favorite: { ...favorite, id, offer: { ...favorite.offer, id } },
    })

    act(() => {
      fireEvent.press(getByText('Supprimer'))
    })

    await waitFor(() => {
      expect(deleteFavoriteSpy).toHaveBeenNthCalledWith(1, id)
      expect(mockShowErrorSnackBar).toBeCalledWith({
        message: `L'offre n'a pas été retirée de tes favoris`,
        timeout: SNACK_BAR_TIME_OUT,
      })
    })
  })

  it('should call share when press share icon', () => {
    const share = jest.spyOn(Share, 'share')
    const { getByLabelText } = renderFavorite()

    const shareButton = getByLabelText(`Partager l’offre ${favorite.offer.name}`)
    fireEvent.press(shareButton)

    expect(share).toBeCalledTimes(1)
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
  server.use(
    rest.delete<EmptyResponse>(
      `${env.API_BASE_URL}/native/v1/me/favorites/${id}`,
      (req, res, ctx) =>
        !hasRemoveFavoriteError ? res(ctx.status(204)) : res(ctx.status(422), ctx.json({}))
    )
  )
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
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    reactQueryProviderHOC(
      <Favorite favorite={favorite} user={user} onInAppBooking={onInAppBooking} />
    )
  )
}
