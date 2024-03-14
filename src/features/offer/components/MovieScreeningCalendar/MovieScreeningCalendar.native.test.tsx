import React from 'react'

import { OfferResponse, OfferStockResponse, SubcategoryIdEnum } from 'api/gen'
import { MovieScreeningCalendar } from 'features/offer/components/MovieScreeningCalendar/MovieScreeningCalendar'
import { mockSubcategory } from 'features/offer/fixtures/mockSubcategory'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { Subcategory } from 'libs/subcategories/types'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { screen, render } from 'tests/utils'

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

describe('Movie screening calendar', () => {
  beforeEach(() => {
    mockServer.getApiV1<OfferResponse>(`/offer/${offerResponseSnap.id}`, offerResponseSnap)
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
