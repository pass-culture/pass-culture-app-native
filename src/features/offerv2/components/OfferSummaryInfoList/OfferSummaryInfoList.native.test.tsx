import mockdate from 'mockdate'
import React from 'react'

import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { OfferSummaryInfoList } from 'features/offerv2/components/OfferSummaryInfoList/OfferSummaryInfoList'
import { render, screen } from 'tests/utils'

describe('<OfferSummaryInfoList />', () => {
  it('should display top separator when offer venue is not permanent', () => {
    const offer = {
      ...offerResponseSnap,
      venue: { ...offerResponseSnap.venue, isPermanent: false },
    }
    render(<OfferSummaryInfoList offer={offer} />)

    expect(screen.getByTestId('topSeparator')).toBeOnTheScreen()
  })

  it('should not display top separator when offer venue is permanent', () => {
    render(<OfferSummaryInfoList offer={offerResponseSnap} />)

    expect(screen.queryByTestId('topSeparator')).not.toBeOnTheScreen()
  })

  it('should not display date summary information when offer stock has not date', () => {
    const offer = {
      ...offerResponseSnap,
      stocks: [
        {
          id: 118929,
          price: 500,
          isBookable: true,
          isExpired: false,
          isForbiddenToUnderage: false,
          isSoldOut: false,
          features: [],
        },
      ],
    }
    render(<OfferSummaryInfoList offer={offer} />)

    expect(screen.queryByText('Dates')).not.toBeOnTheScreen()
  })

  it('should not display date summary information when offer stock has not date in future', () => {
    render(<OfferSummaryInfoList offer={offerResponseSnap} />)

    expect(screen.queryByText('Dates')).not.toBeOnTheScreen()
  })

  it('should display date summary information when offer stock has date in future', () => {
    mockdate.set('2021-01-02T18:00:00')
    render(<OfferSummaryInfoList offer={offerResponseSnap} />)

    expect(screen.getByText('Dates')).toBeOnTheScreen()

    mockdate.reset()
  })

  it('should display offer dates when offer stock has date in future', () => {
    mockdate.set('2021-01-02T18:00:00')
    render(<OfferSummaryInfoList offer={offerResponseSnap} />)

    expect(screen.getByText('Les 3 et 4 janvier 2021')).toBeOnTheScreen()

    mockdate.reset()
  })

  it('should display online summary information when offer is digital', () => {
    const offer = { ...offerResponseSnap, isDigital: true }
    render(<OfferSummaryInfoList offer={offer} />)

    expect(screen.getByText('En ligne')).toBeOnTheScreen()
  })

  it('should display venue offer when offer is digital', () => {
    const offer = { ...offerResponseSnap, isDigital: true }
    render(<OfferSummaryInfoList offer={offer} />)

    expect(screen.getByText('PATHE BEAUGRENELLE')).toBeOnTheScreen()
  })

  it('should not display online summary information when offer is not digital', () => {
    render(<OfferSummaryInfoList offer={offerResponseSnap} />)

    expect(screen.queryByText('En ligne')).not.toBeOnTheScreen()
  })

  it('should display duration summary information when offer has duration', () => {
    const offer = { ...offerResponseSnap, extraData: { durationMinutes: 180 } }
    render(<OfferSummaryInfoList offer={offer} />)

    expect(screen.getByText('Durée')).toBeOnTheScreen()
  })

  it('should display offer duration when offer has duration', () => {
    const offer = { ...offerResponseSnap, extraData: { durationMinutes: 180 } }
    render(<OfferSummaryInfoList offer={offer} />)

    expect(screen.getByText('3h')).toBeOnTheScreen()
  })

  it('should not display duration summary information when offer has not duration', () => {
    render(<OfferSummaryInfoList offer={offerResponseSnap} />)

    expect(screen.queryByText('Durée')).not.toBeOnTheScreen()
  })

  it('should display duo summary information when offer can be booked as a duo', () => {
    render(<OfferSummaryInfoList offer={offerResponseSnap} />)

    expect(screen.getByText('Duo')).toBeOnTheScreen()
  })

  it('should display "Tu peux prendre deux places pour y aller accompagné" when offer can be booked as a duo', () => {
    render(<OfferSummaryInfoList offer={offerResponseSnap} />)

    expect(
      screen.getByText('Tu peux prendre deux places pour y aller accompagné')
    ).toBeOnTheScreen()
  })

  it('should not display duo summary information when offer can not be booked as a duo', () => {
    const offer = { ...offerResponseSnap, isDuo: false }
    render(<OfferSummaryInfoList offer={offer} />)

    expect(screen.queryByText('Duo')).not.toBeOnTheScreen()
  })
})
