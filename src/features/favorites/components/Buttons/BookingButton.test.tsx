import React from 'react'

import {
  ExpenseDomain,
  FavoriteOfferResponse,
  SubcategoryIdEnum,
  UserProfileResponse,
} from 'api/gen'
import { openUrl } from 'features/navigation/helpers/openUrl'
import { isUserBeneficiary, isUserExBeneficiary } from 'features/profile/utils'
import { Credit, getAvailableCredit } from 'features/user/helpers/useAvailableCredit'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render } from 'tests/utils'

import { BookingButton } from './BookingButton'

jest.mock('features/navigation/helpers/openUrl')
jest.mock('features/user/helpers/useAvailableCredit')
jest.mock('features/profile/utils')

const mockedOpenUrl = openUrl as jest.MockedFunction<typeof openUrl>

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
  coordinates: { latitude: 48.9263, longitude: 2.49008 },
  date: null,
  expenseDomains: [ExpenseDomain.all],
  externalTicketOfficeUrl: 'https://externalbooking.test.com',
  id: 146105,
  image: {
    credit: null,
    url: 'https://storage.gra.cloud.ovh.net/v1/AUTH_688df1e25bd84a48a3804e7fa8938085/storage-pc-dev/thumbs/mediations/CWMA',
  },
  subcategoryId: SubcategoryIdEnum.TELECHARGEMENT_MUSIQUE,
  name: 'Un lit sous une rivière',
  price: null,
  startDate: '2021-03-04T20:00:00',
  startPrice: 270,
  isSoldOut: false,
  isExpired: false,
  isReleased: true,
}
const user: UserProfileResponse = {
  isBeneficiary: true,
  bookedOffers: {},
  domainsCredit: { [ExpenseDomain.all]: { initial: 500, remaining: 300 } },
} as UserProfileResponse
const onInAppBooking = jest.fn()

const getAvailableCreditMock = getAvailableCredit as jest.Mock
const isUserBeneficiaryMock = isUserBeneficiary as jest.Mock
const isUserExBeneficiaryMock = isUserExBeneficiary as jest.Mock

describe('<BookingButton />', () => {
  describe('when user is beneficiary', () => {
    // prettier-ignore : do not format the following "table" to keep it readable
    // eslint-disable-next-line jest/expect-expect
    it.each`
      user                                                     | offer                                                                            | expectedCTA
      ${getUser()}                                             | ${getOffer()}                                                                    | ${ExpectedCTA.InAppBooking}
      ${getUser()}                                             | ${getOffer()}                                                                    | ${ExpectedCTA.InAppBooking}
      ${getUser({ remainingCredit: 0 })}                       | ${getOffer({ price: 0, startPrice: null })}                                      | ${ExpectedCTA.InAppBooking}
      ${getUser({ remainingCredit: 10, isBookedOffer: true })} | ${getOffer({ isExpired: true, isSoldOut: true, price: 50 })}                     | ${ExpectedCTA.BookedOffer}
      ${getUser({ remainingCredit: 10, isBookedOffer: true })} | ${getOffer({ isReleased: false })}                                               | ${ExpectedCTA.BookedOffer}
      ${getUser({ remainingCredit: 10 })}                      | ${getOffer({ isExpired: true, isSoldOut: true, price: 50 })}                     | ${ExpectedCTA.ExpiredOffer}
      ${getUser({ remainingCredit: 10 })}                      | ${getOffer({ isExpired: true, isSoldOut: false, price: 50 })}                    | ${ExpectedCTA.ExpiredOffer}
      ${getUser({ remainingCredit: 10 })}                      | ${getOffer({ isReleased: false })}                                               | ${ExpectedCTA.ExpiredOffer}
      ${getUser({ remainingCredit: 10 })}                      | ${getOffer({ isExpired: false, isSoldOut: true, price: 50 })}                    | ${ExpectedCTA.ExhaustedOffer}
      ${getUser({ remainingCredit: 10 })}                      | ${getOffer({ isExpired: false, isSoldOut: false, price: 50, startPrice: null })} | ${ExpectedCTA.NotEnoughCredit}
      ${getUser({ remainingCredit: 10 })}                      | ${getOffer({ isExpired: false, isSoldOut: false, price: null, startPrice: 50 })} | ${ExpectedCTA.NotEnoughCredit}
    `(
      `should has CTA = $expectedCTA when 
        - credit = $credit 
        - favorite = $favorite
        - offer price = $offer.price
        - offer startPrice = $offer.startPrice
        - offer isExpired = $offer.isExpired
        - offer isSoldOut = $offer.isSoldOut
        - offer isReleased = $offer.isReleased
        - offer externalTicketOfficeUrl = $offer.externalTicketOfficeUrl`,
      (...args) => {
        getAvailableCreditMock.mockReturnValueOnce(credit)
        isUserBeneficiaryMock.mockReturnValueOnce(true)
        isUserExBeneficiaryMock.mockReturnValueOnce(false)

        favoriteBookingButtonTestRunner(...args)
      }
    )
  })

  describe('when user is ex-beneficiary (i.e. beneficiary with expired credit)', () => {
    const expiredCredit = { ...credit, isExpired: true }

    // prettier-ignore : do not format the following "table" to keep it readable
    // eslint-disable-next-line jest/expect-expect
    it.each`
      user                                | offer                                                                             | expectedCTA
      ${getUser()}                        | ${getOffer({ price: 0 })}                                                         | ${ExpectedCTA.InAppBooking}
      ${getUser()}                        | ${getOffer({ price: 100 })}                                                       | ${ExpectedCTA.ExternalBooking}
      ${getUser()}                        | ${getOffer({ externalTicketOfficeUrl: null })}                                    | ${ExpectedCTA.NoButton}
      ${getUser({ isBookedOffer: true })} | ${getOffer({ isExpired: true, isSoldOut: true })}                                 | ${ExpectedCTA.BookedOffer}
      ${getUser({ isBookedOffer: true })} | ${getOffer({ isReleased: false })}                                                | ${ExpectedCTA.BookedOffer}
      ${getUser()}                        | ${getOffer({ isExpired: true, isSoldOut: true })}                                 | ${ExpectedCTA.NoButton}
      ${getUser()}                        | ${getOffer({ isExpired: true, isSoldOut: false })}                                | ${ExpectedCTA.NoButton}
      ${getUser()}                        | ${getOffer({ isExpired: false, isSoldOut: true })}                                | ${ExpectedCTA.NoButton}
      ${getUser()}                        | ${getOffer({ isReleased: false })}                                                | ${ExpectedCTA.NoButton}
      ${getUser({ remainingCredit: 10 })} | ${getOffer({ isExpired: false, isSoldOut: false, price: 500, startPrice: null })} | ${ExpectedCTA.ExternalBooking}
      ${getUser({ remainingCredit: 10 })} | ${getOffer({ isExpired: false, isSoldOut: false, price: null, startPrice: 500 })} | ${ExpectedCTA.ExternalBooking}
    `(
      `should has CTA = $expectedCTA when 
        - credit = $credit 
        - favorite = $favorite
        - offer price = $offer.price
        - offer startPrice = $offer.startPrice
        - booked offers = $user.bookedOffers
        - offer isExpired = $offer.isExpired
        - offer isSoldOut = $offer.isSoldOut
        - offer isReleased = $offer.isReleased
        - offer externalTicketOfficeUrl = $offer.externalTicketOfficeUrl`,
      (...args) => {
        isUserExBeneficiaryMock.mockReturnValueOnce(true)
        isUserBeneficiaryMock.mockReturnValueOnce(true)
        getAvailableCreditMock.mockReturnValueOnce(expiredCredit)

        favoriteBookingButtonTestRunner(...args)
      }
    )
  })

  describe('when user is NOT a beneficiary', () => {
    // prettier-ignore : do not format the following "table" to keep it readable
    // eslint-disable-next-line jest/expect-expect
    it.each`
      user                                                      | offer                                              | expectedCTA
      ${getUser({ isBeneficiary: false })}                      | ${getOffer({})}                                    | ${ExpectedCTA.ExternalBooking}
      ${getUser({ isBeneficiary: false, isBookedOffer: true })} | ${getOffer({})}                                    | ${ExpectedCTA.NoButton}
      ${getUser({ isBeneficiary: false })}                      | ${getOffer({ externalTicketOfficeUrl: null })}     | ${ExpectedCTA.NoButton}
      ${getUser({ isBeneficiary: false })}                      | ${getOffer({ isExpired: true, isSoldOut: true })}  | ${ExpectedCTA.NoButton}
      ${getUser({ isBeneficiary: false })}                      | ${getOffer({ isExpired: true, isSoldOut: false })} | ${ExpectedCTA.NoButton}
      ${getUser({ isBeneficiary: false })}                      | ${getOffer({ isReleased: false })}                 | ${ExpectedCTA.NoButton}
      ${getUser({ isBeneficiary: false })}                      | ${getOffer({ isExpired: false, isSoldOut: true })} | ${ExpectedCTA.NoButton}
    `(
      `should has CTA = $expectedCTA when 
        - credit = $credit 
        - favorite = $favorite
        - offer price = $offer.price
        - offer startPrice = $offer.startPrice
        - offer isExpired = $offer.isExpired
        - offer isSoldOut = $offer.isSoldOut
        - offer isReleased = $offer.isReleased
        - offer externalTicketOfficeUrl = $offer.externalTicketOfficeUrl`,
      (...args) => {
        getAvailableCreditMock.mockReturnValueOnce(credit)
        isUserBeneficiaryMock.mockReturnValueOnce(false)

        favoriteBookingButtonTestRunner(...args)
      }
    )
  })
})

const DEFAULT_PROPS = {
  credit,
  offer,
  user,
  onInAppBooking,
}

type RenderFavoriteParams = {
  offer?: FavoriteOfferResponse
  user?: UserProfileResponse
}

function renderFavorite(props: RenderFavoriteParams = DEFAULT_PROPS) {
  const { offer, user } = { ...DEFAULT_PROPS, ...props }
  return render(
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    reactQueryProviderHOC(
      <BookingButton offer={offer} user={user} onInAppBooking={onInAppBooking} />
    )
  )
}

function getUser(params?: {
  isBeneficiary?: boolean
  remainingCredit?: number
  isBookedOffer?: boolean
}) {
  const {
    isBeneficiary = true,
    remainingCredit = 300,
    isBookedOffer = false,
  } = params || {
    isBeneficiary: true,
    remainingCredit: 300,
    isBookedOffer: false,
  }
  return {
    isBeneficiary,
    bookedOffers: isBookedOffer ? { [offer.id]: 666 } : {},
    domainsCredit: { [ExpenseDomain.all]: { initial: 500, remaining: remainingCredit } },
  }
}

function getOffer(params?: {
  externalTicketOfficeUrl?: string | null
  isExpired?: boolean
  isSoldOut?: boolean
  isReleased?: boolean
  price?: number | null
  startPrice?: number | null
}) {
  const {
    externalTicketOfficeUrl = offer.externalTicketOfficeUrl,
    isExpired = false,
    isSoldOut = false,
    isReleased = true,
    price = null,
    startPrice = 270,
  } = params || {
    externalTicketOfficeUrl: offer.externalTicketOfficeUrl,
    isExpired: false,
    isSoldOut: false,
    isReleased: true,
    price: null,
    startPrice: 270,
  }
  return {
    ...offer,
    externalTicketOfficeUrl,
    isExpired,
    isSoldOut,
    isReleased,
    price,
    startPrice,
  }
}

function favoriteBookingButtonTestRunner({
  user,
  offer,
  expectedCTA,
}: {
  user: UserProfileResponse
  offer: FavoriteOfferResponse
  expectedCTA: ExpectedCTA
}) {
  const renderAPI = renderFavorite({ offer, user })
  if (expectedCTA === ExpectedCTA.InAppBooking) {
    fireEvent.press(renderAPI.getByText('Réserver'))
    expect(onInAppBooking).toBeCalledWith(offer)
    expect(renderAPI.queryByText('button-icon-SVG-Mock')).toBeNull()
    expect(mockedOpenUrl).not.toBeCalled()
    expect(renderAPI.queryByText('Offre réservée')).toBeNull()
    expect(renderAPI.queryByText('Offre expirée')).toBeNull()
    expect(renderAPI.queryByText('Offre épuisée')).toBeNull()
    expect(renderAPI.queryByText('Crédit insuffisant')).toBeNull()
    return
  }
  if (expectedCTA === ExpectedCTA.ExternalBooking) {
    fireEvent.press(renderAPI.getByText('Réserver'))
    expect(onInAppBooking).not.toBeCalled()
    expect(renderAPI.queryByText('button-icon-SVG-Mock')).toBeTruthy()
    expect(mockedOpenUrl).toBeCalledWith(offer.externalTicketOfficeUrl, {
      analyticsData: {
        offerId: offer.id,
      },
    })
    expect(renderAPI.queryByText('Offre réservée')).toBeNull()
    expect(renderAPI.queryByText('Offre expirée')).toBeNull()
    expect(renderAPI.queryByText('Offre épuisée')).toBeNull()
    expect(renderAPI.queryByText('Crédit insuffisant')).toBeNull()
    return
  }
  if (expectedCTA === ExpectedCTA.BookedOffer) {
    expect(onInAppBooking).not.toBeCalled()
    expect(renderAPI.queryByText('button-icon-SVG-Mock')).toBeNull()
    expect(mockedOpenUrl).not.toBeCalled()
    expect(renderAPI.queryByText('Offre réservée')).toBeTruthy()
    expect(renderAPI.queryByText('Offre expirée')).toBeNull()
    expect(renderAPI.queryByText('Offre épuisée')).toBeNull()
    expect(renderAPI.queryByText('Crédit insuffisant')).toBeNull()
    return
  }
  if (expectedCTA === ExpectedCTA.ExpiredOffer) {
    expect(onInAppBooking).not.toBeCalled()
    expect(renderAPI.queryByText('button-icon-SVG-Mock')).toBeNull()
    expect(mockedOpenUrl).not.toBeCalled()
    expect(renderAPI.queryByText('Offre réservée')).toBeNull()
    expect(renderAPI.queryByText('Offre expirée')).toBeTruthy()
    expect(renderAPI.queryByText('Offre épuisée')).toBeNull()
    expect(renderAPI.queryByText('Crédit insuffisant')).toBeNull()
    return
  }
  if (expectedCTA === ExpectedCTA.ExhaustedOffer) {
    expect(onInAppBooking).not.toBeCalled()
    expect(renderAPI.queryByText('button-icon-SVG-Mock')).toBeNull()
    expect(mockedOpenUrl).not.toBeCalled()
    expect(renderAPI.queryByText('Offre réservée')).toBeNull()
    expect(renderAPI.queryByText('Offre expirée')).toBeNull()
    expect(renderAPI.queryByText('Offre épuisée')).toBeTruthy()
    expect(renderAPI.queryByText('Crédit insuffisant')).toBeNull()
    return
  }
  if (expectedCTA === ExpectedCTA.NotEnoughCredit) {
    expect(onInAppBooking).not.toBeCalled()
    expect(renderAPI.queryByText('button-icon-SVG-Mock')).toBeNull()
    expect(mockedOpenUrl).not.toBeCalled()
    expect(renderAPI.queryByText('Offre réservée')).toBeNull()
    expect(renderAPI.queryByText('Offre expirée')).toBeNull()
    expect(renderAPI.queryByText('Offre épuisée')).toBeNull()
    expect(renderAPI.queryByText('Crédit insuffisant')).toBeTruthy()
    return
  }
  if (expectedCTA === ExpectedCTA.NoButton) {
    expect(onInAppBooking).not.toBeCalled()
    expect(renderAPI.queryByText('button-icon-SVG-Mock')).toBeNull()
    expect(mockedOpenUrl).not.toBeCalled()
    expect(renderAPI.queryByText('Offre réservée')).toBeNull()
    expect(renderAPI.queryByText('Offre expirée')).toBeNull()
    expect(renderAPI.queryByText('Offre épuisée')).toBeNull()
    expect(renderAPI.queryByText('Crédit insuffisant')).toBeNull()
    return
  }
  throw new Error('expectedCTA does not match any member of enum ExpectedCTA')
}
