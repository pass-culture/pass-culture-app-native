import mockdate from 'mockdate'
import React from 'react'

import { OfferStockResponse } from 'api/gen'
import { notExpiredStock } from 'features/offer/services/useCtaWordingAndAction.testsFixtures'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render } from 'tests/utils'

import { CancellationDetails, formatDate } from '../CancellationDetails'

mockdate.set(new Date('2021-01-04T00:00:00Z'))
const pastDate = new Date('2021-01-02T00:00:00')
const futureDate = new Date('2021-01-06T00:00:00')

describe('formatDate()', () => {
  it.each`
    limitDate                        | expected
    ${'2021-02-23T13:45:00'}         | ${'23 février 2021, 13h45'}
    ${new Date(2021, 4, 3, 9, 30)}   | ${'3 mai 2021, 09h30'}
    ${new Date(2021, 11, 16, 15, 0)} | ${'16 décembre 2021, 15h00'}
    ${new Date(2021, 11, 16, 9, 3)}  | ${'16 décembre 2021, 09h03'}
  `(
    'should format Date $limitDate to string "$expected"',
    ({ limitDate, expected }: { limitDate: Date; expected: string }) => {
      expect(formatDate(limitDate)).toEqual(expected)
    }
  )
})

let mockStock: OfferStockResponse | undefined = undefined
jest.mock('features/bookOffer/pages/BookingOfferWrapper', () => ({
  useBookingStock: jest.fn(() => mockStock),
}))

describe('<CancellationDetails />', () => {
  it('should be cancellable if no limitDate specified', () => {
    mockStock = { ...notExpiredStock, cancellationLimitDatetime: null }
    const page = render(reactQueryProviderHOC(<CancellationDetails />))
    expect(page.queryByText('Cette réservation est annulable')).toBeTruthy()
    expect(page.queryByText(/Cette réservation n’est pas annulable/)).toBeFalsy()
    expect(page.queryByText(/Cette réservation peut être annulée jusqu’au/)).toBeFalsy()
  })

  it('should not be cancellable if limitDate in the past', () => {
    mockStock = { ...notExpiredStock, cancellationLimitDatetime: pastDate }
    const page = render(reactQueryProviderHOC(<CancellationDetails />))
    expect(page.queryByText('Cette réservation n’est pas annulable')).toBeTruthy()
    expect(page.queryByText(/Cette réservation est annulable/)).toBeFalsy()
    expect(page.queryByText(/Cette réservation peut être annulée jusqu’au/)).toBeFalsy()
  })
  it('should be cancellable if limitDate in the future', () => {
    mockStock = { ...notExpiredStock, cancellationLimitDatetime: futureDate }
    const page = render(reactQueryProviderHOC(<CancellationDetails />))
    expect(
      page.queryByText('Cette réservation peut être annulée jusqu’au 6 janvier 2021, 00h00')
    ).toBeTruthy()
    expect(page.queryByText(/Cette réservation est annulable/)).toBeFalsy()
    expect(page.queryByText(/Cette réservation n’est pas annulable/)).toBeFalsy()
  })
})
