import mockdate from 'mockdate'
import React from 'react'

import { OfferResponse, OfferStockResponse } from 'api/gen'
import { offerStockResponseSnap } from 'features/offer/fixtures/offerStockResponse'
import { formatDateTimezone } from 'libs/parsers'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

import { CancellationDetails } from './CancellationDetails'

mockdate.set(new Date('2021-01-04T00:00:00Z'))
const pastDate = '2021-01-02T00:00:00'
const futureDate = '2021-01-06T00:00:00'

describe('formatDateTimezone()', () => {
  it.each`
    limitDate                        | expected
    ${'2021-02-23T13:45:00'}         | ${'23 février 2021, 13h45'}
    ${new Date(2021, 4, 3, 9, 30)}   | ${'3 mai 2021, 09h30'}
    ${new Date(2021, 11, 16, 15, 0)} | ${'16 décembre 2021, 15h00'}
    ${new Date(2021, 11, 16, 9, 3)}  | ${'16 décembre 2021, 09h03'}
  `(
    'should format Date $limitDate to string "$expected"',
    ({ limitDate, expected }: { limitDate: string; expected: string }) => {
      const shouldShowWeekDay = false

      expect(formatDateTimezone(limitDate, shouldShowWeekDay)).toEqual(expected)
    }
  )
})

let mockStock: OfferStockResponse | undefined = undefined
jest.mock('features/bookOffer/helpers/useBookingStock', () => ({
  useBookingStock: jest.fn(() => mockStock),
}))

let mockOffer = { id: 1, isDuo: true } as unknown as OfferResponse
jest.mock('features/bookOffer/helpers/useBookingOffer', () => ({
  useBookingOffer: jest.fn(() => mockOffer),
}))

describe('<CancellationDetails /> when isDigital = true', () => {
  describe('activationCode with expiration date', () => {
    // eslint-disable-next-line jest/expect-expect
    it.each([null, pastDate, futureDate])(
      'should not be cancellable when cancellation limit date=%s',
      (cancellationLimitDatetime) => {
        mockStock = {
          ...offerStockResponseSnap,
          cancellationLimitDatetime,
          activationCode: { expirationDate: '2030-02-05T00:00:00Z' },
        }
        mockOffer = { ...mockOffer, isDigital: true } as unknown as OfferResponse
        render(reactQueryProviderHOC(<CancellationDetails />))

        expectNotCancellable()
      }
    )
  })

  describe('activationCode with no expiration date', () => {
    // eslint-disable-next-line jest/expect-expect
    it.each([null, pastDate, futureDate])(
      'should not be cancellable when cancellation limit date=%s',
      (cancellationLimitDatetime) => {
        mockStock = {
          ...offerStockResponseSnap,
          cancellationLimitDatetime,
          activationCode: { expirationDate: null },
        }
        mockOffer = { ...mockOffer, isDigital: true } as unknown as OfferResponse
        render(reactQueryProviderHOC(<CancellationDetails />))

        expectNotCancellable()
      }
    )
  })

  describe('no activationCode', () => {
    // eslint-disable-next-line jest/expect-expect
    it('should be cancellable if no cancellation limit date', () => {
      mockStock = {
        ...offerStockResponseSnap,
        cancellationLimitDatetime: null,
        activationCode: null,
      }
      mockOffer = { ...mockOffer, isDigital: true } as unknown as OfferResponse
      render(reactQueryProviderHOC(<CancellationDetails />))

      expectCancellable()
    })

    // eslint-disable-next-line jest/expect-expect
    it('should not be cancellable if limitDate is past', () => {
      mockStock = {
        ...offerStockResponseSnap,
        cancellationLimitDatetime: pastDate,
        activationCode: null,
      }
      mockOffer = { ...mockOffer, isDigital: true } as unknown as OfferResponse
      render(reactQueryProviderHOC(<CancellationDetails />))

      expectNotCancellable()
    })

    // eslint-disable-next-line jest/expect-expect
    it('should be cancellable before limitDate if future', () => {
      mockStock = {
        ...offerStockResponseSnap,
        cancellationLimitDatetime: futureDate,
        activationCode: null,
      }
      mockOffer = { ...mockOffer, isDigital: true } as unknown as OfferResponse
      render(reactQueryProviderHOC(<CancellationDetails />))

      expectCancellableBefore()
    })
  })
})

const expectNotCancellable = () => {
  expect(screen.getByText('Cette réservation n’est pas annulable')).toBeOnTheScreen()
  expect(screen.queryByText(/Cette réservation est annulable/)).not.toBeOnTheScreen()
  expect(screen.queryByText(/Cette réservation peut être annulée jusqu’au/)).not.toBeOnTheScreen()
}

const expectCancellable = () => {
  expect(screen.queryByText('Cette réservation n’est pas annulable')).not.toBeOnTheScreen()
  expect(screen.getByText(/Cette réservation est annulable/)).toBeOnTheScreen()
  expect(screen.queryByText(/Cette réservation peut être annulée jusqu’au/)).not.toBeOnTheScreen()
}

const expectCancellableBefore = () => {
  expect(screen.queryByText('Cette réservation n’est pas annulable')).not.toBeOnTheScreen()
  expect(screen.queryByText(/Cette réservation est annulable/)).not.toBeOnTheScreen()
  expect(screen.getByText(/Cette réservation peut être annulée jusqu’au/)).toBeOnTheScreen()
}
