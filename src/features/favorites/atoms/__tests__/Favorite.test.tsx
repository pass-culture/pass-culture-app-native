import { fireEvent, render } from '@testing-library/react-native'
import { rest } from 'msw'
import React from 'react'
import waitForExpect from 'wait-for-expect'

import { navigate } from '__mocks__/@react-navigation/native'
import { FavoriteCategoryResponse, FavoriteResponse, UserProfileResponse } from 'api/gen'
import { initialFavoritesState } from 'features/favorites/pages/reducer'
import { Credit } from 'features/home/services/useAvailableCredit'
import * as NavigationHelpers from 'features/navigation/helpers'
import { env } from 'libs/environment'
import { EmptyResponse } from 'libs/fetch'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { superFlushWithAct } from 'tests/utils'
import { SNACK_BAR_TIME_OUT } from 'ui/components/snackBar/SnackBarContext'
import { SnackBarHelperSettings } from 'ui/components/snackBar/types'

import { Favorite } from '../Favorite'

allowConsole({ error: true })

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
    startPrice: 2700,
  },
}
const user: UserProfileResponse = { isBeneficiary: true } as UserProfileResponse
const setOfferToBook = jest.fn()

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

const openExternalUrl = jest
  .spyOn(NavigationHelpers, 'openExternalUrl')
  .mockImplementation(jest.fn())

describe('<Favorite /> component', () => {
  afterEach(jest.clearAllMocks)

  it('should navigate to the offer when clicking on the favorite', () => {
    const { getByTestId } = renderFavorite()
    fireEvent.press(getByTestId('favorite'))
    expect(navigate).toHaveBeenCalledWith('Offer', {
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
    await superFlushWithAct(15)
    fireEvent.press(getByText('Supprimer'))
    await superFlushWithAct(15)
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

    await superFlushWithAct(20)
    fireEvent.press(getByText('Supprimer'))
    await superFlushWithAct(20)
    await waitForExpect(() => {
      expect(mockShowSuccessSnackBar).not.toBeCalled()
      expect(mockShowErrorSnackBar).toBeCalledWith({
        message: `L'offre n'a pas été retirée de tes favoris`,
        timeout: SNACK_BAR_TIME_OUT,
      })
    })
  })
})

describe('<Favorite /> component - Booking button', () => {
  afterEach(jest.clearAllMocks)

  describe('when user is beneficiary', () => {
    it('they should be able to book in app when user has enough credit', async () => {
      function runTest(props: { credit: Credit; favorite: FavoriteResponse }) {
        const renderAPI = renderFavorite(props)

        fireEvent.press(renderAPI.getByText('Réserver'))
        expect(renderAPI.queryByText('button-icon-SVG-Mock')).toBeFalsy()
        expect(openExternalUrl).not.toBeCalled()
        expect(setOfferToBook).toBeCalledWith(props.favorite.offer)
      }

      runTest({ favorite, credit: { ...credit, amount: 3000 } })
      runTest({
        credit: { ...credit, amount: 3000 },
        favorite: { ...favorite, offer: { ...favorite.offer, price: null, startPrice: 2700 } },
      })
    })

    it('they should see a not enough credit disabled button when user has not enough credit', async () => {
      const renderAPI = renderFavorite()

      expect(renderAPI.queryByText('Réserver')).toBeFalsy()
      expect(renderAPI.queryByText('Crédit insuffisant')).toBeTruthy()

      const renderAPIStartPrice = renderFavorite({
        favorite: { ...favorite, offer: { ...favorite.offer, price: null, startPrice: 2700 } },
      })

      expect(renderAPIStartPrice.queryByText('Réserver')).toBeFalsy()
      expect(renderAPIStartPrice.queryByText('Crédit insuffisant')).toBeTruthy()
    })

    it('they should see booking button when offer is free and user has no credit', async () => {
      function runTest(props: { credit: Credit; favorite: FavoriteResponse }) {
        const renderAPI = renderFavorite(props)
        fireEvent.press(renderAPI.getByText('Réserver'))
        expect(renderAPI.queryByText('button-icon-SVG-Mock')).toBeFalsy()
        expect(openExternalUrl).not.toBeCalled()
        expect(setOfferToBook).toBeCalledWith(props.favorite.offer)

        setOfferToBook.mockClear()
      }

      runTest({
        credit: { ...credit, amount: 0 },
        favorite: { ...favorite, offer: { ...favorite.offer, startPrice: null, price: 0 } },
      })

      runTest({
        credit: { ...credit, amount: 0 },
        favorite: { ...favorite, offer: { ...favorite.offer, startPrice: null, price: 0 } },
      })
    })
  })

  describe('when user is ex-beneficiary (i.e. beneficiary with expired credit)', () => {
    it('they should be able to book in app when the offer is free', () => {
      const renderAPI = renderFavorite({
        favorite: { ...favorite, offer: { ...favorite.offer, price: 0 } },
        credit: { ...credit, isExpired: true },
      })

      fireEvent.press(renderAPI.getByText('Réserver'))

      expect(renderAPI.queryByText('button-icon-SVG-Mock')).toBeFalsy()
      expect(openExternalUrl).not.toBeCalled()
      expect(setOfferToBook).toBeCalledWith({ ...favorite.offer, price: 0 })
    })

    it('they should be able to book externally when the offer is NOT free', () => {
      const renderAPI = renderFavorite({ credit: { ...credit, isExpired: true } })

      fireEvent.press(renderAPI.getByText('Réserver'))

      expect(renderAPI.queryByText('button-icon-SVG-Mock')).toBeTruthy()
      expect(openExternalUrl).toBeCalledWith(favorite.offer.externalTicketOfficeUrl)
      expect(setOfferToBook).not.toBeCalled()
    })

    it('they should NOT be able to book externally when the offer is NOT free and an external URL has not been defined', () => {
      const renderAPI = renderFavorite({
        favorite: { ...favorite, offer: { ...favorite.offer, externalTicketOfficeUrl: null } },
        credit: { ...credit, isExpired: true },
      })

      expect(renderAPI.queryByText('Réserver')).toBeFalsy()
      expect(renderAPI.queryByText('button-icon-SVG-Mock')).toBeFalsy()
    })
  })

  describe('when user is NOT a beneficiary', () => {
    it('they should be able to book externally', () => {
      const renderAPI = renderFavorite({ user: { ...user, isBeneficiary: false } })

      fireEvent.press(renderAPI.getByText('Réserver'))

      expect(renderAPI.queryByText('button-icon-SVG-Mock')).toBeTruthy()
      expect(openExternalUrl).toBeCalledWith(favorite.offer.externalTicketOfficeUrl)
      expect(setOfferToBook).not.toBeCalled()
    })

    it('they should NOT be able to book externally when an external URL has not been defined', () => {
      const renderAPI = renderFavorite({
        favorite: { ...favorite, offer: { ...favorite.offer, externalTicketOfficeUrl: null } },
        user: { ...user, isBeneficiary: false },
      })

      expect(renderAPI.queryByText('Réserver')).toBeFalsy()
      expect(renderAPI.queryByText('button-icon-SVG-Mock')).toBeFalsy()
    })
  })
})

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
      (req, res, ctx) =>
        !hasRemoveFavoriteError ? res(ctx.status(204)) : res(ctx.status(422), ctx.json({}))
    )
  )
}

interface Props {
  credit?: Credit
  favorite?: FavoriteResponse
  user?: UserProfileResponse
  setOfferToBook?: () => void
}

const defaultProps = {
  credit,
  favorite,
  user,
  setOfferToBook,
}

function renderFavorite(props: Props = defaultProps) {
  const { credit, favorite, user, setOfferToBook } = { ...defaultProps, ...props }

  return render(
    reactQueryProviderHOC(
      <Favorite credit={credit} favorite={favorite} user={user} setOfferToBook={setOfferToBook} />
    )
  )
}
