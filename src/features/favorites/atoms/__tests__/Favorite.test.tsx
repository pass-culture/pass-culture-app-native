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

const mockShowSuccessSnackBar = jest.fn()
const mockShowErrorSnackBar = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showSuccessSnackBar: jest.fn((props: SnackBarHelperSettings) => mockShowSuccessSnackBar(props)),
    showErrorSnackBar: jest.fn((props: SnackBarHelperSettings) => mockShowErrorSnackBar(props)),
  }),
}))

enum ExpectedCTA {
  InAppBooking = 'InAppBooking',
  ExternalBooking = 'ExternalBooking',
  NotEnoughCredit = 'NotEnoughCredit',
  ExpiredOffer = 'ExpiredOffer',
  ExhaustedOffer = 'ExhaustedOffer',
  NoButton = 'NoButton',
}

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
    isExhausted: false,
    isExpired: false,
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
    const beneficiaryUser = { isBeneficiary: true }
    // prettier-ignore : do not format the following "table" to keep it readable
    it.each`
      user               | credit                         | favorite                                                                                                             | expectedCTA
      ${beneficiaryUser} | ${{ ...credit, amount: 3000 }} | ${favorite}                                                                                                          | ${ExpectedCTA.InAppBooking}
      ${beneficiaryUser} | ${{ ...credit, amount: 3000 }} | ${{ ...favorite, offer: { ...favorite.offer, price: null, startPrice: 2700 } }}                                      | ${ExpectedCTA.InAppBooking}
      ${beneficiaryUser} | ${{ ...credit, amount: 0 }}    | ${{ ...favorite, offer: { ...favorite.offer, price: 0, startPrice: null } }}                                         | ${ExpectedCTA.InAppBooking}
      ${beneficiaryUser} | ${{ ...credit, amount: 0 }}    | ${{ ...favorite, offer: { ...favorite.offer, price: 0, startPrice: null } }}                                         | ${ExpectedCTA.InAppBooking}
      ${beneficiaryUser} | ${{ ...credit, amount: 100 }}  | ${{ ...favorite, offer: { ...favorite.offer, isExpired: true, isExhausted: true, price: 500 } }}                     | ${ExpectedCTA.ExpiredOffer}
      ${beneficiaryUser} | ${{ ...credit, amount: 100 }}  | ${{ ...favorite, offer: { ...favorite.offer, isExpired: true, isExhausted: false, price: 500 } }}                    | ${ExpectedCTA.ExpiredOffer}
      ${beneficiaryUser} | ${{ ...credit, amount: 100 }}  | ${{ ...favorite, offer: { ...favorite.offer, isExpired: false, isExhausted: true, price: 500 } }}                    | ${ExpectedCTA.ExhaustedOffer}
      ${beneficiaryUser} | ${{ ...credit, amount: 100 }}  | ${{ ...favorite, offer: { ...favorite.offer, isExpired: false, isExhausted: false, price: 500, startPrice: null } }} | ${ExpectedCTA.NotEnoughCredit}
      ${beneficiaryUser} | ${{ ...credit, amount: 100 }}  | ${{ ...favorite, offer: { ...favorite.offer, isExpired: false, isExhausted: false, price: null, startPrice: 500 } }} | ${ExpectedCTA.NotEnoughCredit}
    `(
      `should has CTA = $expectedCTA when 
        - credit = $credit 
        - favorite = $favorite
        - offer price = $favorite.offer.price
        - offer startPrice = $favorite.offer.startPrice
        - offer isExpired = $favorite.offer.isExpired
        - offer isExhausted = $favorite.offer.isExhausted
        - offer externalTicketOfficeUrl = $favorite.offer.externalTicketOfficeUrl`,
      favoriteBookingButtonTestRunner
    )
  })

  describe('when user is ex-beneficiary (i.e. beneficiary with expired credit)', () => {
    const beneficiaryUser = { isBeneficiary: true }
    const expiredCredit = { ...credit, isExpired: true }
    // prettier-ignore : do not format the following "table" to keep it readable
    it.each`
      user               | credit                               | favorite                                                                                                             | expectedCTA
      ${beneficiaryUser} | ${expiredCredit}                     | ${{ ...favorite, offer: { ...favorite.offer, price: 0 } }}                                                           | ${ExpectedCTA.InAppBooking}
      ${beneficiaryUser} | ${expiredCredit}                     | ${{ ...favorite, offer: { ...favorite.offer, price: 100 } }}                                                         | ${ExpectedCTA.ExternalBooking}
      ${beneficiaryUser} | ${expiredCredit}                     | ${{ ...favorite, offer: { ...favorite.offer, externalTicketOfficeUrl: null } }}                                      | ${ExpectedCTA.NoButton}
      ${beneficiaryUser} | ${expiredCredit}                     | ${{ ...favorite, offer: { ...favorite.offer, isExpired: true, isExhausted: true } }}                                 | ${ExpectedCTA.NoButton}
      ${beneficiaryUser} | ${expiredCredit}                     | ${{ ...favorite, offer: { ...favorite.offer, isExpired: true, isExhausted: false } }}                                | ${ExpectedCTA.NoButton}
      ${beneficiaryUser} | ${expiredCredit}                     | ${{ ...favorite, offer: { ...favorite.offer, isExpired: false, isExhausted: true } }}                                | ${ExpectedCTA.NoButton}
      ${beneficiaryUser} | ${{ ...expiredCredit, amount: 100 }} | ${{ ...favorite, offer: { ...favorite.offer, isExpired: false, isExhausted: false, price: 500, startPrice: null } }} | ${ExpectedCTA.ExternalBooking}
      ${beneficiaryUser} | ${{ ...expiredCredit, amount: 100 }} | ${{ ...favorite, offer: { ...favorite.offer, isExpired: false, isExhausted: false, price: null, startPrice: 500 } }} | ${ExpectedCTA.ExternalBooking}
    `(
      `should has CTA = $expectedCTA when 
        - credit = $credit 
        - favorite = $favorite
        - offer price = $favorite.offer.price
        - offer startPrice = $favorite.offer.startPrice
        - offer isExpired = $favorite.offer.isExpired
        - offer isExhausted = $favorite.offer.isExhausted
        - offer externalTicketOfficeUrl = $favorite.offer.externalTicketOfficeUrl`,
      favoriteBookingButtonTestRunner
    )
  })

  describe('when user is NOT a beneficiary', () => {
    const notBeneficiaryUser = { isBeneficiary: false }
    // prettier-ignore : do not format the following "table" to keep it readable
    it.each`
      user                  | credit    | favorite                                                                              | expectedCTA
      ${notBeneficiaryUser} | ${credit} | ${favorite}                                                                           | ${ExpectedCTA.ExternalBooking}
      ${notBeneficiaryUser} | ${credit} | ${{ ...favorite, offer: { ...favorite.offer, externalTicketOfficeUrl: null } }}       | ${ExpectedCTA.NoButton}
      ${notBeneficiaryUser} | ${credit} | ${{ ...favorite, offer: { ...favorite.offer, isExpired: true, isExhausted: true } }}  | ${ExpectedCTA.NoButton}
      ${notBeneficiaryUser} | ${credit} | ${{ ...favorite, offer: { ...favorite.offer, isExpired: true, isExhausted: false } }} | ${ExpectedCTA.NoButton}
      ${notBeneficiaryUser} | ${credit} | ${{ ...favorite, offer: { ...favorite.offer, isExpired: false, isExhausted: true } }} | ${ExpectedCTA.NoButton}
    `(
      `should has CTA = $expectedCTA when 
        - credit = $credit 
        - favorite = $favorite
        - offer price = $favorite.offer.price
        - offer startPrice = $favorite.offer.startPrice
        - offer isExpired = $favorite.offer.isExpired
        - offer isExhausted = $favorite.offer.isExhausted
        - offer externalTicketOfficeUrl = $favorite.offer.externalTicketOfficeUrl`,
      favoriteBookingButtonTestRunner
    )
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
  setOfferToBook,
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
      <Favorite credit={credit} favorite={favorite} user={user} setOfferToBook={setOfferToBook} />
    )
  )
}

function favoriteBookingButtonTestRunner({
  user,
  credit,
  favorite,
  expectedCTA,
}: {
  user: UserProfileResponse
  credit: Credit
  favorite: FavoriteResponse
  expectedCTA: ExpectedCTA
}) {
  const renderAPI = renderFavorite({ credit, favorite, user })
  if (expectedCTA === ExpectedCTA.InAppBooking) {
    fireEvent.press(renderAPI.getByText('Réserver'))
    expect(setOfferToBook).toBeCalledWith(favorite.offer)
    expect(renderAPI.queryByText('button-icon-SVG-Mock')).toBeFalsy()
    expect(openExternalUrl).not.toBeCalled()
    expect(renderAPI.queryByText('Crédit insuffisant')).toBeFalsy()
    expect(renderAPI.queryByText('Offre expirée')).toBeFalsy()
    expect(renderAPI.queryByText('Offre épuisée')).toBeFalsy()
    return
  }
  if (expectedCTA === ExpectedCTA.ExternalBooking) {
    fireEvent.press(renderAPI.getByText('Réserver'))
    expect(setOfferToBook).not.toBeCalled()
    expect(renderAPI.queryByText('button-icon-SVG-Mock')).toBeTruthy()
    expect(openExternalUrl).toBeCalledWith(favorite.offer.externalTicketOfficeUrl)
    expect(renderAPI.queryByText('Crédit insuffisant')).toBeFalsy()
    expect(renderAPI.queryByText('Offre expirée')).toBeFalsy()
    expect(renderAPI.queryByText('Offre épuisée')).toBeFalsy()
    return
  }
  if (expectedCTA === ExpectedCTA.NotEnoughCredit) {
    expect(setOfferToBook).not.toBeCalled()
    expect(renderAPI.queryByText('button-icon-SVG-Mock')).toBeFalsy()
    expect(openExternalUrl).not.toBeCalled()
    expect(renderAPI.queryByText('Crédit insuffisant')).toBeTruthy()
    expect(renderAPI.queryByText('Offre expirée')).toBeFalsy()
    expect(renderAPI.queryByText('Offre épuisée')).toBeFalsy()
    return
  }
  if (expectedCTA === ExpectedCTA.ExpiredOffer) {
    expect(setOfferToBook).not.toBeCalled()
    expect(renderAPI.queryByText('button-icon-SVG-Mock')).toBeFalsy()
    expect(openExternalUrl).not.toBeCalled()
    expect(renderAPI.queryByText('Crédit insuffisant')).toBeFalsy()
    expect(renderAPI.queryByText('Offre expirée')).toBeTruthy()
    expect(renderAPI.queryByText('Offre épuisée')).toBeFalsy()
    return
  }
  if (expectedCTA === ExpectedCTA.ExhaustedOffer) {
    expect(setOfferToBook).not.toBeCalled()
    expect(renderAPI.queryByText('button-icon-SVG-Mock')).toBeFalsy()
    expect(openExternalUrl).not.toBeCalled()
    expect(renderAPI.queryByText('Crédit insuffisant')).toBeFalsy()
    expect(renderAPI.queryByText('Offre expirée')).toBeFalsy()
    expect(renderAPI.queryByText('Offre épuisée')).toBeTruthy()
    return
  }
  if (expectedCTA === ExpectedCTA.NoButton) {
    expect(setOfferToBook).not.toBeCalled()
    expect(renderAPI.queryByText('button-icon-SVG-Mock')).toBeFalsy()
    expect(openExternalUrl).not.toBeCalled()
    expect(renderAPI.queryByText('Crédit insuffisant')).toBeFalsy()
    expect(renderAPI.queryByText('Offre expirée')).toBeFalsy()
    expect(renderAPI.queryByText('Offre épuisée')).toBeFalsy()
    return
  }
  throw new Error('expectedCTA does not match any member of enum ExpectedCTA')
}
