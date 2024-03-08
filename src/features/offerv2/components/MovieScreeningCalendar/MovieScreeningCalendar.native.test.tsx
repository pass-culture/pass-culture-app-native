import React from 'react'

import { OfferStockResponse } from 'api/gen'
import { MovieScreeningCalendar } from 'features/offerv2/components/MovieScreeningCalendar/MovieScreeningCalendar'
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

describe('Movie screening calendar', () => {
  it('should render <MovieScreeningCalendar /> without duplicated screening dates', async () => {
    renderMovieScreeningCalendar({
      stocks: [
        defaultOfferStockResponse,
        { ...defaultOfferStockResponse, beginningDatetime: '2024-02-27T11:20:00Z' },
      ],
    })

    expect(await screen.findByLabelText('Mardi 27 février')).toBeOnTheScreen()
  })

  it('should render <MovieScreeningCalendar /> without expired screenings', async () => {
    renderMovieScreeningCalendar({
      stocks: [
        defaultOfferStockResponse,
        {
          ...defaultOfferStockResponse,
          beginningDatetime: '2024-02-29T13:30:00Z',
          isExpired: true,
        },
      ],
    })

    await screen.findByLabelText('Mardi 27 février')

    expect(screen.queryByLabelText('Jeudi 29 février')).not.toBeOnTheScreen()
  })

  it('should render <MovieScreeningCalendar /> without forbidden to underage screenings', async () => {
    renderMovieScreeningCalendar({
      stocks: [
        defaultOfferStockResponse,
        {
          ...defaultOfferStockResponse,
          beginningDatetime: '2024-02-19T11:10:00Z',
          isForbiddenToUnderage: true,
        },
      ],
    })

    await screen.findByLabelText('Mardi 27 février')

    expect(screen.queryByLabelText('Lundi 19 février')).not.toBeOnTheScreen()
  })
})

const renderMovieScreeningCalendar = ({
  stocks = [defaultOfferStockResponse],
}: {
  stocks: OfferStockResponse[]
}) => {
  render(<MovieScreeningCalendar stocks={stocks} />)
}
