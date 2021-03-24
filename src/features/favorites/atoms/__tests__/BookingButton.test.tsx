import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'

import {
  ExpenseDomain,
  FavoriteCategoryResponse,
  FavoriteOfferResponse,
  UserProfileResponse,
} from 'api/gen'
import { Credit } from 'features/home/services/useAvailableCredit'
import * as NavigationHelpers from 'features/navigation/helpers'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'

import { BookingButton } from '../BookingButton'

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
const offer: FavoriteOfferResponse = {
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
}
const user: UserProfileResponse = {
  isBeneficiary: true,
  bookedOffers: {},
  domainsCredit: { [ExpenseDomain.All]: { initial: 500, remaining: 300 } },
} as UserProfileResponse
const setOfferToBook = jest.fn()

const openExternalUrl = jest
  .spyOn(NavigationHelpers, 'openExternalUrl')
  .mockImplementation(jest.fn())

describe('<BookingButtun />', () => {
  afterEach(jest.clearAllMocks)

  describe('when user is beneficiary', () => {
    // prettier-ignore : do not format the following "table" to keep it readable
    it.each`
      user                                                     | credit    | offer                                                                              | expectedCTA
      ${getUser()}                                             | ${credit} | ${getOffer()}                                                                      | ${ExpectedCTA.InAppBooking}
      ${getUser()}                                             | ${credit} | ${getOffer()}                                                                      | ${ExpectedCTA.InAppBooking}
      ${getUser({ remainingCredit: 0 })}                       | ${credit} | ${getOffer({ price: 0, startPrice: null })}                                        | ${ExpectedCTA.InAppBooking}
      ${getUser({ remainingCredit: 10, isBookedOffer: true })} | ${credit} | ${getOffer({ isExpired: true, isExhausted: true, price: 50 })}                     | ${ExpectedCTA.BookedOffer}
      ${getUser({ remainingCredit: 10 })}                      | ${credit} | ${getOffer({ isExpired: true, isExhausted: true, price: 50 })}                     | ${ExpectedCTA.ExpiredOffer}
      ${getUser({ remainingCredit: 10 })}                      | ${credit} | ${getOffer({ isExpired: true, isExhausted: false, price: 50 })}                    | ${ExpectedCTA.ExpiredOffer}
      ${getUser({ remainingCredit: 10 })}                      | ${credit} | ${getOffer({ isExpired: false, isExhausted: true, price: 50 })}                    | ${ExpectedCTA.ExhaustedOffer}
      ${getUser({ remainingCredit: 10 })}                      | ${credit} | ${getOffer({ isExpired: false, isExhausted: false, price: 50, startPrice: null })} | ${ExpectedCTA.NotEnoughCredit}
      ${getUser({ remainingCredit: 10 })}                      | ${credit} | ${getOffer({ isExpired: false, isExhausted: false, price: null, startPrice: 50 })} | ${ExpectedCTA.NotEnoughCredit}
    `(
      `should has CTA = $expectedCTA when 
        - credit = $credit 
        - favorite = $favorite
        - offer price = $offer.price
        - offer startPrice = $offer.startPrice
        - offer isExpired = $offer.isExpired
        - offer isExhausted = $offer.isExhausted
        - offer externalTicketOfficeUrl = $offer.externalTicketOfficeUrl`,
      favoriteBookingButtonTestRunner
    )
  })

  describe('when user is ex-beneficiary (i.e. beneficiary with expired credit)', () => {
    const expiredCredit = { ...credit, isExpired: true }
    // prettier-ignore : do not format the following "table" to keep it readable
    it.each`
      user                                | credit           | offer                                                                               | expectedCTA
      ${getUser()}                        | ${expiredCredit} | ${getOffer({ price: 0 })}                                                           | ${ExpectedCTA.InAppBooking}
      ${getUser()}                        | ${expiredCredit} | ${getOffer({ price: 100 })}                                                         | ${ExpectedCTA.ExternalBooking}
      ${getUser()}                        | ${expiredCredit} | ${getOffer({ externalTicketOfficeUrl: null })}                                      | ${ExpectedCTA.NoButton}
      ${getUser({ isBookedOffer: true })} | ${expiredCredit} | ${getOffer({ isExpired: true, isExhausted: true })}                                 | ${ExpectedCTA.BookedOffer}
      ${getUser()}                        | ${expiredCredit} | ${getOffer({ isExpired: true, isExhausted: true })}                                 | ${ExpectedCTA.NoButton}
      ${getUser()}                        | ${expiredCredit} | ${getOffer({ isExpired: true, isExhausted: false })}                                | ${ExpectedCTA.NoButton}
      ${getUser()}                        | ${expiredCredit} | ${getOffer({ isExpired: false, isExhausted: true })}                                | ${ExpectedCTA.NoButton}
      ${getUser({ remainingCredit: 10 })} | ${expiredCredit} | ${getOffer({ isExpired: false, isExhausted: false, price: 500, startPrice: null })} | ${ExpectedCTA.ExternalBooking}
      ${getUser({ remainingCredit: 10 })} | ${expiredCredit} | ${getOffer({ isExpired: false, isExhausted: false, price: null, startPrice: 500 })} | ${ExpectedCTA.ExternalBooking}
    `(
      `should has CTA = $expectedCTA when 
        - credit = $credit 
        - favorite = $favorite
        - offer price = $offer.price
        - offer startPrice = $offer.startPrice
        - booked offers = $user.bookedOffers
        - offer isExpired = $offer.isExpired
        - offer isExhausted = $offer.isExhausted
        - offer externalTicketOfficeUrl = $offer.externalTicketOfficeUrl`,
      favoriteBookingButtonTestRunner
    )
  })

  describe('when user is NOT a beneficiary', () => {
    // prettier-ignore : do not format the following "table" to keep it readable
    it.each`
      user                                                      | credit    | offer                                                | expectedCTA
      ${getUser({ isBeneficiary: false })}                      | ${credit} | ${getOffer({})}                                      | ${ExpectedCTA.ExternalBooking}
      ${getUser({ isBeneficiary: false, isBookedOffer: true })} | ${credit} | ${getOffer({})}                                      | ${ExpectedCTA.NoButton}
      ${getUser({ isBeneficiary: false })}                      | ${credit} | ${getOffer({ externalTicketOfficeUrl: null })}       | ${ExpectedCTA.NoButton}
      ${getUser({ isBeneficiary: false })}                      | ${credit} | ${getOffer({ isExpired: true, isExhausted: true })}  | ${ExpectedCTA.NoButton}
      ${getUser({ isBeneficiary: false })}                      | ${credit} | ${getOffer({ isExpired: true, isExhausted: false })} | ${ExpectedCTA.NoButton}
      ${getUser({ isBeneficiary: false })}                      | ${credit} | ${getOffer({ isExpired: false, isExhausted: true })} | ${ExpectedCTA.NoButton}
    `(
      `should has CTA = $expectedCTA when 
        - credit = $credit 
        - favorite = $favorite
        - offer price = $offer.price
        - offer startPrice = $offer.startPrice
        - offer isExpired = $offer.isExpired
        - offer isExhausted = $offer.isExhausted
        - offer externalTicketOfficeUrl = $offer.externalTicketOfficeUrl`,
      favoriteBookingButtonTestRunner
    )
  })
})

const DEFAULT_PROPS = {
  credit,
  offer,
  user,
  setOfferToBook,
}

type RenderFavoriteParams = {
  credit?: Credit
  offer?: FavoriteOfferResponse
  user?: UserProfileResponse
}

function renderFavorite(props: RenderFavoriteParams = DEFAULT_PROPS) {
  const { credit, offer, user } = { ...DEFAULT_PROPS, ...props }
  return render(
    reactQueryProviderHOC(
      <BookingButton credit={credit} offer={offer} user={user} setOfferToBook={setOfferToBook} />
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
    bookedOffers: isBookedOffer ? { [offer.id]: 666 } : {},
    domainsCredit: { [ExpenseDomain.All]: { initial: 500, remaining: remainingCredit } },
  }
}

function getOffer(params?: {
  externalTicketOfficeUrl?: string | null
  isExpired?: boolean
  isExhausted?: boolean
  price?: number | null
  startPrice?: number | null
}) {
  const {
    externalTicketOfficeUrl = offer.externalTicketOfficeUrl,
    isExpired = false,
    isExhausted = false,
    price = null,
    startPrice = 270,
  } = params || {
    externalTicketOfficeUrl: offer.externalTicketOfficeUrl,
    isExpired: false,
    isExhausted: false,
    price: null,
    startPrice: 270,
  }
  return {
    ...offer,
    externalTicketOfficeUrl,
    isExpired,
    isExhausted,
    price,
    startPrice,
  }
}

function favoriteBookingButtonTestRunner({
  user,
  credit,
  offer,
  expectedCTA,
}: {
  user: UserProfileResponse
  credit: Credit
  offer: FavoriteOfferResponse
  expectedCTA: ExpectedCTA
}) {
  const renderAPI = renderFavorite({ credit, offer, user })
  if (expectedCTA === ExpectedCTA.InAppBooking) {
    fireEvent.press(renderAPI.getByText('Réserver'))
    expect(setOfferToBook).toBeCalledWith(offer)
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
    expect(openExternalUrl).toBeCalledWith(offer.externalTicketOfficeUrl)
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
