import React from 'react'

import { OfferResponse, OfferStockResponse, SubcategoryIdEnum } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { MovieScreeningCalendar } from 'features/offer/components/MovieScreeningCalendar/MovieScreeningCalendar'
import { mockSubcategory } from 'features/offer/fixtures/mockSubcategory'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { Subcategory } from 'libs/subcategories/types'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { screen, render, act, fireEvent } from 'tests/utils'

const defaultOfferStockResponse: OfferStockResponse = {
  beginningDatetime: '2024-02-27T11:10:00Z',
  features: ['VO'],
  id: 6091,
  isBookable: false,
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

jest.mock('features/auth/context/AuthContext')
const mockUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>

describe('Movie screening calendar', () => {
  beforeEach(() => {
    mockServer.getApi<OfferResponse>(`/v1/offer/${offerResponseSnap.id}`, offerResponseSnap)

    mockUseAuthContext.mockReturnValue({
      isLoggedIn: false,
      setIsLoggedIn: jest.fn(),
      refetchUser: jest.fn(),
      isUserLoading: false,
    })
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
    renderMovieScreeningCalendar({
      offer: {
        ...defaultOfferResponse,
        stocks: [
          defaultOfferStockResponse,
          {
            ...defaultOfferStockResponse,
            isSoldOut: false,
          },
        ],
      },
    })

    await screen.findByLabelText('Mardi 27 février')

    await act(async () => {
      fireEvent.press(await screen.findByText('VO'))
    })

    expect(screen.queryByText('Identifie-toi pour réserver l’offre')).toBeOnTheScreen()
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
