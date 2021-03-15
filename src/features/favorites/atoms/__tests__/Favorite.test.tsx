import { fireEvent, render, waitFor } from '@testing-library/react-native'
import { rest } from 'msw'
import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { FavoriteCategoryResponse, FavoriteResponse } from 'api/gen'
import { initialFavoritesState } from 'features/favorites/pages/reducer'
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
    externalTicketOfficeUrl: null,
    id: 146105,
    image: {
      credit: null,
      url:
        'https://storage.gra.cloud.ovh.net/v1/AUTH_688df1e25bd84a48a3804e7fa8938085/storage-pc-dev/thumbs/mediations/CWMA',
    },
    name: 'Un lit sous une rivière',
    price: null,
    startDate: new Date('2021-03-04T20:00:00'),
    startPrice: 2700,
  },
}

type Options = {
  id?: number
  hasRemoveFavoriteError?: boolean
}

const defaultOptions = {
  id: favorite.id,
  hasRemoveFavoriteError: false,
}

function simulateBackend(options: Options = defaultOptions) {
  const { id, hasRemoveFavoriteError } = { ...defaultOptions, ...options }
  server.use(
    rest.delete<EmptyResponse>(
      `${env.API_BASE_URL}/native/v1/me/favorites/${id}`,
      (req, res, ctx) => (!hasRemoveFavoriteError ? res(ctx.status(204)) : res(ctx.status(422)))
    )
  )
}

const mockFavoritesState = initialFavoritesState

let mockDistance: string | null = null
jest.mock('features/offer/components/useDistance', () => ({
  useDistance: () => mockDistance,
}))

jest.mock('features/favorites/pages/FavoritesWrapper', () => ({
  useFavoritesState: () => ({
    favoritesState: mockFavoritesState,
  }),
}))

describe('Favorite component', () => {
  afterEach(jest.clearAllMocks)

  it('should navigate to the offer when clicking on the favorite', () => {
    const { getByTestId } = render(reactQueryProviderHOC(<Favorite favorite={favorite} />))
    fireEvent.press(getByTestId('favorite'))
    expect(navigate).toHaveBeenCalledWith('Offer', {
      id: favorite.offer.id,
      shouldDisplayLoginModal: false,
    })
  })

  it('should show distance if geolocation enabled', () => {
    mockDistance = '10 km'
    const { queryByText } = render(reactQueryProviderHOC(<Favorite favorite={favorite} />))
    expect(queryByText('10 km')).toBeTruthy()
  })

  it('offer name should take full space if no geolocation', () => {
    mockDistance = '10 km'
    const withDistance = render(reactQueryProviderHOC(<Favorite favorite={favorite} />)).toJSON()

    mockDistance = null
    const withoutDistance = render(reactQueryProviderHOC(<Favorite favorite={favorite} />)).toJSON()
    expect(withoutDistance).toMatchDiffSnapshot(withDistance)
  })

  it('should delete favorite on button click', async () => {
    simulateBackend()
    mockDistance = '10 km'
    const { getByText } = render(reactQueryProviderHOC(<Favorite favorite={favorite} />))

    const button = await getByText('Supprimer')
    await fireEvent.press(button)
    await superFlushWithAct()
    await waitFor(() => {
      expect(mockShowSuccessSnackBar).toBeCalledWith({
        message: `L'offre a été retirée de tes favoris`,
        timeout: SNACK_BAR_TIME_OUT,
      })
      expect(mockShowErrorSnackBar).not.toBeCalled()
    })
  })

  it('should fail to delete favorite on button click', async () => {
    simulateBackend()
    mockDistance = '10 km'
    const { getByText } = render(
      reactQueryProviderHOC(
        <Favorite favorite={{ ...favorite, id: 0, offer: { ...favorite.offer, id: 0 } }} />
      )
    )

    const button = await getByText('Supprimer')
    await fireEvent.press(button)
    await superFlushWithAct()
    await waitFor(() => {
      expect(mockShowSuccessSnackBar).not.toBeCalled()
      expect(mockShowErrorSnackBar).toBeCalledWith({
        message: `L'offre n'a pas été retirée de tes favoris`,
        timeout: SNACK_BAR_TIME_OUT,
      })
    })
  })
})
