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
  BookedOffer = 'BookedOffer',
  ExpiredOffer = 'ExpiredOffer',
  ExhaustedOffer = 'ExhaustedOffer',
  NotEnoughCredit = 'NotEnoughCredit',
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
    isExhausted: false,
    isExpired: false,
  },
}
const user: UserProfileResponse = {
  isBeneficiary: true,
  bookedOffers: {},
  domainsCredit: { [ExpenseDomain.All]: { initial: 500, remaining: 300 } },
} as UserProfileResponse
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
    // prettier-ignore : do not format the following "table" to keep it readable
    it.each`
      user                                                     | credit    | favorite                                                                              | expectedCTA
      ${getUser()}                                             | ${credit} | ${getFavorite()}                                                                      | ${ExpectedCTA.InAppBooking}
      ${getUser()}                                             | ${credit} | ${getFavorite()}                                                                      | ${ExpectedCTA.InAppBooking}
      ${getUser({ remainingCredit: 0 })}                       | ${credit} | ${getFavorite({ price: 0, startPrice: null })}                                        | ${ExpectedCTA.InAppBooking}
      ${getUser({ remainingCredit: 10, isBookedOffer: true })} | ${credit} | ${getFavorite({ isExpired: true, isExhausted: true, price: 50 })}                     | ${ExpectedCTA.BookedOffer}
      ${getUser({ remainingCredit: 10 })}                      | ${credit} | ${getFavorite({ isExpired: true, isExhausted: true, price: 50 })}                     | ${ExpectedCTA.ExpiredOffer}
      ${getUser({ remainingCredit: 10 })}                      | ${credit} | ${getFavorite({ isExpired: true, isExhausted: false, price: 50 })}                    | ${ExpectedCTA.ExpiredOffer}
      ${getUser({ remainingCredit: 10 })}                      | ${credit} | ${getFavorite({ isExpired: false, isExhausted: true, price: 50 })}                    | ${ExpectedCTA.ExhaustedOffer}
      ${getUser({ remainingCredit: 10 })}                      | ${credit} | ${getFavorite({ isExpired: false, isExhausted: false, price: 50, startPrice: null })} | ${ExpectedCTA.NotEnoughCredit}
      ${getUser({ remainingCredit: 10 })}                      | ${credit} | ${getFavorite({ isExpired: false, isExhausted: false, price: null, startPrice: 50 })} | ${ExpectedCTA.NotEnoughCredit}
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
    const expiredCredit = { ...credit, isExpired: true }
    // prettier-ignore : do not format the following "table" to keep it readable
    it.each`
      user                                | credit           | favorite                                                                               | expectedCTA
      ${getUser()}                        | ${expiredCredit} | ${getFavorite({ price: 0 })}                                                           | ${ExpectedCTA.InAppBooking}
      ${getUser()}                        | ${expiredCredit} | ${getFavorite({ price: 100 })}                                                         | ${ExpectedCTA.ExternalBooking}
      ${getUser()}                        | ${expiredCredit} | ${getFavorite({ externalTicketOfficeUrl: null })}                                      | ${ExpectedCTA.NoButton}
      ${getUser({ isBookedOffer: true })} | ${expiredCredit} | ${getFavorite({ isExpired: true, isExhausted: true })}                                 | ${ExpectedCTA.BookedOffer}
      ${getUser()}                        | ${expiredCredit} | ${getFavorite({ isExpired: true, isExhausted: true })}                                 | ${ExpectedCTA.NoButton}
      ${getUser()}                        | ${expiredCredit} | ${getFavorite({ isExpired: true, isExhausted: false })}                                | ${ExpectedCTA.NoButton}
      ${getUser()}                        | ${expiredCredit} | ${getFavorite({ isExpired: false, isExhausted: true })}                                | ${ExpectedCTA.NoButton}
      ${getUser({ remainingCredit: 10 })} | ${expiredCredit} | ${getFavorite({ isExpired: false, isExhausted: false, price: 500, startPrice: null })} | ${ExpectedCTA.ExternalBooking}
      ${getUser({ remainingCredit: 10 })} | ${expiredCredit} | ${getFavorite({ isExpired: false, isExhausted: false, price: null, startPrice: 500 })} | ${ExpectedCTA.ExternalBooking}
    `(
      `should has CTA = $expectedCTA when 
        - credit = $credit 
        - favorite = $favorite
        - offer price = $favorite.offer.price
        - offer startPrice = $favorite.offer.startPrice
        - booked offers = $user.bookedOffers
        - offer isExpired = $favorite.offer.isExpired
        - offer isExhausted = $favorite.offer.isExhausted
        - offer externalTicketOfficeUrl = $favorite.offer.externalTicketOfficeUrl`,
      favoriteBookingButtonTestRunner
    )
  })

  describe('when user is NOT a beneficiary', () => {
    // prettier-ignore : do not format the following "table" to keep it readable
    it.each`
      user                                                      | credit    | favorite                                                | expectedCTA
      ${getUser({ isBeneficiary: false })}                      | ${credit} | ${getFavorite({})}                                      | ${ExpectedCTA.ExternalBooking}
      ${getUser({ isBeneficiary: false, isBookedOffer: true })} | ${credit} | ${getFavorite({})}                                      | ${ExpectedCTA.NoButton}
      ${getUser({ isBeneficiary: false })}                      | ${credit} | ${getFavorite({ externalTicketOfficeUrl: null })}       | ${ExpectedCTA.NoButton}
      ${getUser({ isBeneficiary: false })}                      | ${credit} | ${getFavorite({ isExpired: true, isExhausted: true })}  | ${ExpectedCTA.NoButton}
      ${getUser({ isBeneficiary: false })}                      | ${credit} | ${getFavorite({ isExpired: true, isExhausted: false })} | ${ExpectedCTA.NoButton}
      ${getUser({ isBeneficiary: false })}                      | ${credit} | ${getFavorite({ isExpired: false, isExhausted: true })} | ${ExpectedCTA.NoButton}
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

function getUser(params?: {
  isBeneficiary?: boolean
  remainingCredit?: number
  isBookedOffer?: boolean
}) {
  const { isBeneficiary = true, remainingCredit = 300, isBookedOffer = false } = params || {
    isBeneficiary: true,
    remainingCredit: 300,
    isBookedOffer: false,
  }
  return {
    isBeneficiary,
    bookedOffers: isBookedOffer ? { [favorite.offer.id]: 666 } : {},
    domainsCredit: { [ExpenseDomain.All]: { initial: 500, remaining: remainingCredit } },
  }
}

function getFavorite(params?: {
  externalTicketOfficeUrl?: string | null
  isExpired?: boolean
  isExhausted?: boolean
  price?: number | null
  startPrice?: number | null
}) {
  const {
    externalTicketOfficeUrl = favorite.offer.externalTicketOfficeUrl,
    isExpired = false,
    isExhausted = false,
    price = null,
    startPrice = 270,
  } = params || {
    externalTicketOfficeUrl: favorite.offer.externalTicketOfficeUrl,
    isExpired: false,
    isExhausted: false,
    price: null,
    startPrice: 270,
  }
  return {
    ...favorite,
    offer: {
      ...favorite.offer,
      externalTicketOfficeUrl,
      isExpired,
      isExhausted,
      price,
      startPrice,
    },
  }
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
    expect(renderAPI.queryByText('Offre réservée')).toBeFalsy()
    expect(renderAPI.queryByText('Offre expirée')).toBeFalsy()
    expect(renderAPI.queryByText('Offre épuisée')).toBeFalsy()
    expect(renderAPI.queryByText('Crédit insuffisant')).toBeFalsy()
    return
  }
  if (expectedCTA === ExpectedCTA.ExternalBooking) {
    fireEvent.press(renderAPI.getByText('Réserver'))
    expect(setOfferToBook).not.toBeCalled()
    expect(renderAPI.queryByText('button-icon-SVG-Mock')).toBeTruthy()
    expect(openExternalUrl).toBeCalledWith(favorite.offer.externalTicketOfficeUrl)
    expect(renderAPI.queryByText('Offre réservée')).toBeFalsy()
    expect(renderAPI.queryByText('Offre expirée')).toBeFalsy()
    expect(renderAPI.queryByText('Offre épuisée')).toBeFalsy()
    expect(renderAPI.queryByText('Crédit insuffisant')).toBeFalsy()
    return
  }
  if (expectedCTA === ExpectedCTA.BookedOffer) {
    expect(setOfferToBook).not.toBeCalled()
    expect(renderAPI.queryByText('button-icon-SVG-Mock')).toBeFalsy()
    expect(openExternalUrl).not.toBeCalled()
    expect(renderAPI.queryByText('Offre réservée')).toBeTruthy()
    expect(renderAPI.queryByText('Offre expirée')).toBeFalsy()
    expect(renderAPI.queryByText('Offre épuisée')).toBeFalsy()
    expect(renderAPI.queryByText('Crédit insuffisant')).toBeFalsy()
    return
  }
  if (expectedCTA === ExpectedCTA.ExpiredOffer) {
    expect(setOfferToBook).not.toBeCalled()
    expect(renderAPI.queryByText('button-icon-SVG-Mock')).toBeFalsy()
    expect(openExternalUrl).not.toBeCalled()
    expect(renderAPI.queryByText('Offre réservée')).toBeFalsy()
    expect(renderAPI.queryByText('Offre expirée')).toBeTruthy()
    expect(renderAPI.queryByText('Offre épuisée')).toBeFalsy()
    expect(renderAPI.queryByText('Crédit insuffisant')).toBeFalsy()
    return
  }
  if (expectedCTA === ExpectedCTA.ExhaustedOffer) {
    expect(setOfferToBook).not.toBeCalled()
    expect(renderAPI.queryByText('button-icon-SVG-Mock')).toBeFalsy()
    expect(openExternalUrl).not.toBeCalled()
    expect(renderAPI.queryByText('Offre réservée')).toBeFalsy()
    expect(renderAPI.queryByText('Offre expirée')).toBeFalsy()
    expect(renderAPI.queryByText('Offre épuisée')).toBeTruthy()
    expect(renderAPI.queryByText('Crédit insuffisant')).toBeFalsy()
    return
  }
  if (expectedCTA === ExpectedCTA.NotEnoughCredit) {
    expect(setOfferToBook).not.toBeCalled()
    expect(renderAPI.queryByText('button-icon-SVG-Mock')).toBeFalsy()
    expect(openExternalUrl).not.toBeCalled()
    expect(renderAPI.queryByText('Offre réservée')).toBeFalsy()
    expect(renderAPI.queryByText('Offre expirée')).toBeFalsy()
    expect(renderAPI.queryByText('Offre épuisée')).toBeFalsy()
    expect(renderAPI.queryByText('Crédit insuffisant')).toBeTruthy()
    return
  }
  if (expectedCTA === ExpectedCTA.NoButton) {
    expect(setOfferToBook).not.toBeCalled()
    expect(renderAPI.queryByText('button-icon-SVG-Mock')).toBeFalsy()
    expect(openExternalUrl).not.toBeCalled()
    expect(renderAPI.queryByText('Offre réservée')).toBeFalsy()
    expect(renderAPI.queryByText('Offre expirée')).toBeFalsy()
    expect(renderAPI.queryByText('Offre épuisée')).toBeFalsy()
    expect(renderAPI.queryByText('Crédit insuffisant')).toBeFalsy()
    return
  }
  throw new Error('expectedCTA does not match any member of enum ExpectedCTA')
}
