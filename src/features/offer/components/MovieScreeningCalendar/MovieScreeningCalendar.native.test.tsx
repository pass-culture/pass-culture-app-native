import mockdate from 'mockdate'
import React from 'react'

import {
  BookingsResponse,
  OfferResponse,
  OfferStockResponse,
  SubcategoriesResponseModelv2,
  SubcategoryIdEnum,
  UserProfileResponse,
} from 'api/gen'
import { IAuthContext } from 'features/auth/context/AuthContext'
import { bookingsSnap } from 'features/bookings/fixtures/bookingsSnap'
import { mockOffer as mockBaseOffer } from 'features/bookOffer/fixtures/offer'
import { MovieScreeningCalendar } from 'features/offer/components/MovieScreeningCalendar/MovieScreeningCalendar'
import { mockSubcategory } from 'features/offer/fixtures/mockSubcategory'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { beneficiaryUser } from 'fixtures/user'
import { analytics } from 'libs/analytics'
import { placeholderData } from 'libs/subcategories/placeholderData'
import { Subcategory } from 'libs/subcategories/types'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { screen, render, act, fireEvent } from 'tests/utils'

mockdate.set(new Date('2024-01-01T00:00:00.000Z'))

const defaultAuthContext: IAuthContext = {
  isLoggedIn: false,
  setIsLoggedIn: jest.fn(),
  refetchUser: jest.fn(),
  isUserLoading: false,
}

const defaultLoggedInUser: UserProfileResponse | IAuthContext = {
  isLoggedIn: true,
  setIsLoggedIn: jest.fn(),
  isUserLoading: false,
  refetchUser: jest.fn(),
  user: {
    ...beneficiaryUser,
    depositExpirationDate: `${new Date()}`,
  },
}

let mockAuthContext = defaultAuthContext

jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: jest.fn(() => mockAuthContext),
}))

const mockOffer = mockBaseOffer
jest.mock('features/bookOffer/helpers/useBookingOffer', () => ({
  useBookingOffer: jest.fn(() => mockOffer),
}))

const defaultOfferStockResponse: OfferStockResponse = {
  beginningDatetime: '2024-02-27T11:10:00Z',
  features: ['VO'],
  id: 6091,
  isBookable: true,
  isExpired: false,
  isForbiddenToUnderage: false,
  isSoldOut: false,
  price: 570,
}

const defaultOfferResponse: OfferResponse = {
  ...offerResponseSnap,
  subcategoryId: SubcategoryIdEnum.SEANCE_CINE,
  stocks: [defaultOfferStockResponse],
}

describe('Movie screening calendar', () => {
  it('should render <MovieScreeningCalendar /> with screening ordered by hours', async () => {
    renderMovieScreeningCalendar({
      offer: {
        ...defaultOfferResponse,
        stocks: [
          defaultOfferStockResponse,
          { ...defaultOfferStockResponse, beginningDatetime: '2024-02-27T13:20:00Z' },
          { ...defaultOfferStockResponse, beginningDatetime: '2024-02-27T10:20:00Z' },
          { ...defaultOfferStockResponse, beginningDatetime: '2024-02-27T12:20:00Z' },
          { ...defaultOfferStockResponse, beginningDatetime: '2024-02-27T12:00:00Z' },
          { ...defaultOfferStockResponse, beginningDatetime: '2024-02-27T00:10:00Z' },
          { ...defaultOfferStockResponse, beginningDatetime: '2024-02-27T00:00:00Z' },
        ],
      },
      isDesktopViewport: true,
    })

    await screen.findByLabelText('Mardi 27 Février')

    expect(screen).toMatchSnapshot()
  })

  it('should render <MovieScreeningCalendar /> without duplicated screening dates', async () => {
    renderMovieScreeningCalendar({
      offer: {
        ...defaultOfferResponse,
        stocks: [
          defaultOfferStockResponse,
          { ...defaultOfferStockResponse, beginningDatetime: '2024-02-27T11:20:00Z' },
        ],
      },
    })

    expect(await screen.findByLabelText('Mardi 27 Février')).toBeOnTheScreen()
  })

  it('should render <MovieScreeningCalendar /> without expired screenings', async () => {
    renderMovieScreeningCalendar({
      offer: {
        ...defaultOfferResponse,
        stocks: [
          defaultOfferStockResponse,
          {
            ...defaultOfferStockResponse,
            beginningDatetime: '2024-02-29T13:30:00Z',
            isExpired: true,
          },
        ],
      },
    })

    await screen.findByLabelText('Mardi 27 Février')

    expect(screen.queryByLabelText('Jeudi 29 février')).not.toBeOnTheScreen()
  })

  it('should render <MovieScreeningCalendar /> without forbidden to underage screenings', async () => {
    renderMovieScreeningCalendar({
      offer: {
        ...defaultOfferResponse,
        stocks: [
          defaultOfferStockResponse,
          {
            ...defaultOfferStockResponse,
            beginningDatetime: '2024-02-19T11:10:00Z',
            isForbiddenToUnderage: true,
          },
        ],
      },
    })

    await screen.findByLabelText('Mardi 27 Février')

    expect(screen.queryByLabelText('Lundi 19 février')).not.toBeOnTheScreen()
  })

  it('should render "Complet" when screening is sold out', async () => {
    renderMovieScreeningCalendar({
      offer: {
        ...defaultOfferResponse,
        stocks: [
          {
            ...defaultOfferStockResponse,
            isSoldOut: true,
          },
        ],
      },
    })

    await screen.findByLabelText('Mardi 27 Février')

    expect(screen.getByLabelText('Complet')).toBeOnTheScreen()
  })

  describe('Authentication dependant', () => {
    beforeEach(() => {
      mockServer.getApi<BookingsResponse>('/v1/bookings', bookingsSnap)
      mockServer.getApi<SubcategoriesResponseModelv2>('/v1/subcategories/v2', placeholderData)
      mockServer.getApi<OfferResponse>(`/v1/offer/${offerResponseSnap.id}`, offerResponseSnap)
      mockAuthContext = defaultAuthContext
    })

    it('should open authentication modal when an event card is pressed and user is not logged in', async () => {
      renderMovieScreeningCalendar({ offer: defaultOfferResponse })

      const bookingOfferButton = await screen.findByLabelText('VO')
      await act(async () => {
        fireEvent.press(bookingOfferButton)
      })

      expect(screen.getByText('Identifie-toi pour réserver l’offre')).toBeOnTheScreen()
    })

    it('should open isDuo modal when user is loggedIn and clicks on a bookable eventCard', async () => {
      mockServer.getApi<OfferResponse>(`/v1/offer/${offerResponseSnap.id}`, offerResponseSnap)

      mockAuthContext = defaultLoggedInUser

      renderMovieScreeningCalendar({ offer: defaultOfferResponse })

      const eventCard = await screen.findByLabelText('VO')
      await act(async () => {
        fireEvent.press(eventCard)
      })

      await screen.findByText('Choix des options')

      expect(await screen.findByText('Nombre de places')).toBeOnTheScreen()
    })

    it('should display "Déjà réservé" if user has already booked offer in venue', async () => {
      mockAuthContext = {
        ...defaultLoggedInUser,
        user: {
          ...beneficiaryUser,
          depositExpirationDate: `${new Date()}`,
          bookedOffers: { '213': 123 },
        },
      }

      renderMovieScreeningCalendar({
        offer: {
          ...defaultOfferResponse,
          id: 213,
          stocks: [
            {
              ...defaultOfferStockResponse,
              beginningDatetime: bookingsSnap?.ongoing_bookings?.[0]?.stock.beginningDatetime,
            },
          ],
        },
      })

      await screen.findByLabelText('Lundi 15 Mars')

      expect(await screen.findByText('Déjà réservé')).toBeOnTheScreen()
    })

    it('should show "Crédit insuffisant" when user is logged in and does not have enough credit', async () => {
      mockServer.getApi<OfferResponse>(`/v1/offer/${offerResponseSnap.id}`, offerResponseSnap)

      mockAuthContext = {
        ...defaultLoggedInUser,
        user: {
          ...beneficiaryUser,
          domainsCredit: {
            all: { initial: 0, remaining: 0 },
            physical: { initial: 0, remaining: 0 },
            digital: { initial: 0, remaining: 0 },
          },
        },
      }

      renderMovieScreeningCalendar({ offer: defaultOfferResponse })

      await screen.findByLabelText('Mardi 27 Février')

      expect(await screen.findByText('Crédit insuffisant')).toBeOnTheScreen()
    })

    it('should log event BookingProcessStart when user is logged in and a cliquable eventcard is pressed', async () => {
      mockServer.getApi<OfferResponse>(`/v1/offer/${offerResponseSnap.id}`, offerResponseSnap)

      mockAuthContext = defaultLoggedInUser

      renderMovieScreeningCalendar({ offer: defaultOfferResponse })

      await screen.findByLabelText('Mardi 27 Février')

      const eventCard = await screen.findByLabelText('VO')
      await act(async () => {
        fireEvent.press(eventCard)
      })

      expect(analytics.logBookingProcessStart).toHaveBeenCalledWith(offerResponseSnap.id)
    })

    it('should not log event BookingProcessStart when user clicks on a disabled eventcard', async () => {
      mockServer.getApi<OfferResponse>(`/v1/offer/${offerResponseSnap.id}`, offerResponseSnap)

      mockAuthContext = {
        ...defaultLoggedInUser,
        user: {
          ...beneficiaryUser,
          domainsCredit: {
            all: { initial: 0, remaining: 0 },
            physical: { initial: 0, remaining: 0 },
            digital: { initial: 0, remaining: 0 },
          },
        },
      }

      renderMovieScreeningCalendar({ offer: defaultOfferResponse })

      await screen.findByLabelText('Mardi 27 Février')

      const eventCard = await screen.findByLabelText('Crédit insuffisant')
      await act(async () => {
        fireEvent.press(eventCard)
      })

      await screen.findByLabelText('Mardi 27 Février')

      expect(analytics.logBookingProcessStart).not.toHaveBeenCalled()
    })
  })
})

const renderMovieScreeningCalendar = ({
  offer = offerResponseSnap,
  subcategory = mockSubcategory,
  isDesktopViewport = false,
}: {
  offer: OfferResponse
  subcategory?: Subcategory
  isDesktopViewport?: boolean
}) => {
  render(
    reactQueryProviderHOC(<MovieScreeningCalendar offer={offer} subcategory={subcategory} />),
    { theme: { isDesktopViewport: isDesktopViewport } }
  )
}
