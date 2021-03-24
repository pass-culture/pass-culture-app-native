import { fireEvent, render } from '@testing-library/react-native'
import { rest } from 'msw'
import React from 'react'
import waitForExpect from 'wait-for-expect'

import { navigate } from '__mocks__/@react-navigation/native'
import {
  ExpenseDomain,
  FavoriteCategoryResponse,
  FavoriteResponse,
  UserProfileResponse,
} from 'api/gen'
import { initialFavoritesState } from 'features/favorites/pages/reducer'
import { Credit } from 'features/home/services/useAvailableCredit'
import { env } from 'libs/environment'
import { EmptyResponse } from 'libs/fetch'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { superFlushWithAct } from 'tests/utils'
import { SNACK_BAR_TIME_OUT } from 'ui/components/snackBar/SnackBarContext'
import { SnackBarHelperSettings } from 'ui/components/snackBar/types'

import { Favorite } from '../Favorite'

const mockShowSuccessSnackBar = jest.fn()
const mockShowErrorSnackBar = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showSuccessSnackBar: jest.fn((props: SnackBarHelperSettings) => mockShowSuccessSnackBar(props)),
    showErrorSnackBar: jest.fn((props: SnackBarHelperSettings) => mockShowErrorSnackBar(props)),
  }),
}))

const credit: Credit = { amount: 100, isExpired: false }
const favorite: FavoriteResponse = {
  id: 393,
  offer: {
    category: {
      categoryType: 'Event',
      label: 'Pratique artistique',
      name: 'LECON',
    } as FavoriteCategoryResponse,
    coordinates: { latitude: 48.9263, longitude: 2.49008 },
    date: null,
    expenseDomains: [ExpenseDomain.All],
    externalTicketOfficeUrl: 'https://externalbooking.test.com',
    id: 146105,
    image: {
      credit: null,
      url:
        'https://storage.gra.cloud.ovh.net/v1/AUTH_688df1e25bd84a48a3804e7fa8938085/storage-pc-dev/thumbs/mediations/CWMA',
    },
    name: 'Un lit sous une rivière',
    price: null,
    startDate: new Date('2021-03-04T20:00:00'),
    startPrice: 270,
    isSoldOut: false,
    isExpired: false,
  },
}
const user: UserProfileResponse = {
  isBeneficiary: true,
  bookedOffers: {},
  domainsCredit: { [ExpenseDomain.All]: { initial: 500, remaining: 300 } },
} as UserProfileResponse
const onInAppBooking = jest.fn()

let mockDistance: string | null = null
jest.mock('features/offer/components/useDistance', () => ({
  useDistance: () => mockDistance,
}))

const mockFavoritesState = initialFavoritesState
jest.mock('features/favorites/pages/FavoritesWrapper', () => ({
  useFavoritesState: () => ({
    favoritesState: mockFavoritesState,
  }),
}))

describe('<Favorite /> component', () => {
  afterEach(jest.clearAllMocks)

  it('should navigate to the offer when clicking on the favorite', () => {
    const { getByTestId } = renderFavorite()
    fireEvent.press(getByTestId('favorite'))
    expect(navigate).toHaveBeenCalledWith('Offer', {
      from: 'favorites',
      id: favorite.offer.id,
      shouldDisplayLoginModal: false,
    })
  })

  it('should show distance if geolocation enabled', () => {
    mockDistance = '10 km'
    const { queryByText } = renderFavorite()
    expect(queryByText('10 km')).toBeTruthy()
  })

  it('offer name should take full space if no geolocation', () => {
    mockDistance = '10 km'
    const withDistance = renderFavorite().toJSON()

    mockDistance = null
    const withoutDistance = renderFavorite().toJSON()
    expect(withoutDistance).toMatchDiffSnapshot(withDistance)
  })

  it('should delete favorite on button click', async () => {
    simulateBackend()
    mockDistance = '10 km'
    const { getByText } = renderFavorite()
    await superFlushWithAct()
    fireEvent.press(getByText('Supprimer'))
    await superFlushWithAct()
    await waitForExpect(() => {
      expect(mockShowSuccessSnackBar).toBeCalledWith({
        message: `L'offre a été retirée de tes favoris`,
        timeout: SNACK_BAR_TIME_OUT,
      })
      expect(mockShowErrorSnackBar).not.toBeCalled()
    })
  })
  it('should fail to delete favorite on button click', async () => {
    const id = 0
    simulateBackend({ id, hasRemoveFavoriteError: true })
    mockDistance = '10 km'
    const { getByText } = renderFavorite({
      favorite: { ...favorite, id, offer: { ...favorite.offer, id } },
    })

    await superFlushWithAct()
    fireEvent.press(getByText('Supprimer'))
    await superFlushWithAct()

    await waitForExpect(() => {
      expect(mockShowSuccessSnackBar).not.toBeCalled()
      expect(mockShowErrorSnackBar).toBeCalledWith({
        message: `L'offre n'a pas été retirée de tes favoris`,
        timeout: SNACK_BAR_TIME_OUT,
      })
    })
  })
})

type Options = {
  id?: number
  hasRemoveFavoriteError?: boolean
}

const DEFAULT_GET_FAVORITE_OPTIONDS = {
  id: favorite.id,
  hasRemoveFavoriteError: false,
}

function simulateBackend(options: Options = DEFAULT_GET_FAVORITE_OPTIONDS) {
  const { id, hasRemoveFavoriteError } = { ...DEFAULT_GET_FAVORITE_OPTIONDS, ...options }
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
  credit?: Credit
  favorite?: FavoriteResponse
  user?: UserProfileResponse
}

function renderFavorite(props: RenderFavoriteParams = DEFAULT_PROPS) {
  const { credit, favorite, user } = { ...DEFAULT_PROPS, ...props }
  return render(
    reactQueryProviderHOC(
      <Favorite credit={credit} favorite={favorite} user={user} onInAppBooking={onInAppBooking} />
    )
  )
}
