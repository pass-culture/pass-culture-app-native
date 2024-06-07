import mockdate from 'mockdate'
import React from 'react'

import { MoviesScreeningCalendar } from 'features/offer/components/MoviesScreeningCalendar/MoviesScreeningCalendar'
import { offersStocksResponseSnap } from 'features/offer/fixtures/offersStocksResponse'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { screen, render, act } from 'tests/utils'

jest.mock('libs/subcategories/useSubcategory')

mockdate.set(new Date('2024-04-18T00:00:00.000Z'))

describe('MoviesScreeningCalendar', () => {
  it('should render MoviesScreeningCalendar correctly', async () => {
    renderMoviesScreeningCalendar({
      isDesktopViewport: false,
    })
    await act(async () => {})

    await screen.findAllByText('Jeu.')
    await screen.findByText('18')
    await screen.findAllByText('Avril')

    expect(screen).toMatchSnapshot()
  })

  it('should render MoviesScreeningCalendar correctly on desktop', async () => {
    renderMoviesScreeningCalendar({
      isDesktopViewport: true,
    })

    await screen.findByLabelText('Jeudi 18 Avril')

    expect(screen).toMatchSnapshot()
  })
})

const renderMoviesScreeningCalendar = ({
  isDesktopViewport = false,
  offersIds = [offersStocksResponseSnap.offers[0].id],
}: {
  offersIds?: number[]
  isDesktopViewport?: boolean
}) => {
  render(reactQueryProviderHOC(<MoviesScreeningCalendar offerIds={offersIds} />), {
    theme: { isDesktopViewport: isDesktopViewport },
  })
}
