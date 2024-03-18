import mockdate from 'mockdate'
import React from 'react'

import {
  BookingsResponse,
  OfferResponse,
  OfferStockResponse,
  SubcategoriesResponseModelv2,
  SubcategoryIdEnum,
} from 'api/gen'
import { IAuthContext } from 'features/auth/context/AuthContext'
import { MovieScreeningCalendar } from 'features/offer/components/MovieScreeningCalendar/MovieScreeningCalendar'
import { mockSubcategory } from 'features/offer/fixtures/mockSubcategory'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { beneficiaryUser } from 'fixtures/user'
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
let mockAuthContext = defaultAuthContext

jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: jest.fn(() => mockAuthContext),
}))

const defaultOfferStockResponse: OfferStockResponse = {
  beginningDatetime: '2024-02-27T11:10:00Z',
  features: ['VO'],
  id: 6091,
  isBookable: true,
  isExpired: false,
  isForbiddenToUnderage: false,
  isSoldOut: true,
  price: 570,
}

const defaultOfferResponse: OfferResponse = {
  ...offerResponseSnap,
  subcategoryId: SubcategoryIdEnum.SEANCE_CINE,
  stocks: [defaultOfferStockResponse],
}

describe('Movie screening calendar', () => {
  beforeEach(() => {
    mockAuthContext = defaultAuthContext
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

    expect(await screen.findByLabelText('Mardi 27 février')).toBeOnTheScreen()
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

    await screen.findByLabelText('Mardi 27 février')

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

    await screen.findByLabelText('Mardi 27 février')

    expect(screen.queryByLabelText('Lundi 19 février')).not.toBeOnTheScreen()
  })

  it('should open authentication modal when an event card is pressed and user is not logged in', async () => {
    mockAuthContext = {
      isLoggedIn: false,
      setIsLoggedIn: jest.fn(),
      isUserLoading: false,
      refetchUser: jest.fn(),
      user: undefined,
    }

    renderMovieScreeningCalendar({
      offer: {
        ...defaultOfferResponse,
        stocks: [
          {
            ...defaultOfferStockResponse,
            isSoldOut: false,
          },
        ],
      },
    })

    const bookingOfferButton = await screen.findByLabelText('VO')
    await act(async () => {
      fireEvent.press(bookingOfferButton)
    })

    expect(screen.queryByText('Identifie-toi pour réserver l’offre')).toBeOnTheScreen()
  })

  it('should open isDuo modal when user is loggedIn and clicks on a bookable eventCard', async () => {
    mockAuthContext = {
      isLoggedIn: true,
      setIsLoggedIn: jest.fn(),
      isUserLoading: false,
      refetchUser: jest.fn(),
      user: { ...beneficiaryUser, depositExpirationDate: `${new Date()}` },
    }

    mockServer.getApi<BookingsResponse>(`/v1/bookings`, {})
    mockServer.getApi<SubcategoriesResponseModelv2>('/v1/subcategories/v2', placeholderData)
    mockServer.getApi<OfferResponse>(`/v1/offer/${offerResponseSnap.id}`, {
      requestOptions: { persist: true },
      responseOptions: { data: offerResponseSnap },
    })

    renderMovieScreeningCalendar({
      offer: {
        ...defaultOfferResponse,
        stocks: [
          {
            ...defaultOfferStockResponse,
            isSoldOut: false,
          },
        ],
      },
    })
    const bookingOfferButton = await screen.findByLabelText('VO')
    await act(async () => {
      fireEvent.press(bookingOfferButton)
    })

    expect(await screen.findByText('Nombre de places')).toBeOnTheScreen()
  })
})

const renderMovieScreeningCalendar = ({
  offer = offerResponseSnap,
  subcategory = mockSubcategory,
}: {
  offer: OfferResponse
  subcategory?: Subcategory
}) => {
  render(reactQueryProviderHOC(<MovieScreeningCalendar offer={offer} subcategory={subcategory} />))
}
