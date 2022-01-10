import mockdate from 'mockdate'
import React from 'react'
import { QueryObserverResult } from 'react-query'

import { OfferResponse, OfferStockResponse, SettingsResponse } from 'api/gen'
import { notExpiredStock } from 'features/offer/services/useCtaWordingAndAction.testsFixtures'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, RenderAPI } from 'tests/utils'

import { CancellationDetails, formatDate } from '../CancellationDetails'

mockdate.set(new Date('2021-01-04T00:00:00Z'))
const pastDate = '2021-01-02T00:00:00'
const futureDate = '2021-01-06T00:00:00'

describe('formatDate()', () => {
  it.each`
    limitDate                        | expected
    ${'2021-02-23T13:45:00'}         | ${'23 février 2021, 13h45'}
    ${new Date(2021, 4, 3, 9, 30)}   | ${'3 mai 2021, 09h30'}
    ${new Date(2021, 11, 16, 15, 0)} | ${'16 décembre 2021, 15h00'}
    ${new Date(2021, 11, 16, 9, 3)}  | ${'16 décembre 2021, 09h03'}
  `(
    'should format Date $limitDate to string "$expected"',
    ({ limitDate, expected }: { limitDate: string; expected: string }) => {
      expect(formatDate(limitDate)).toEqual(expected)
    }
  )
})

let mockStock: OfferStockResponse | undefined = undefined
let mockOffer = { id: 1, isDuo: true } as unknown as OfferResponse
jest.mock('features/bookOffer/pages/BookingOfferWrapper', () => ({
  useBookingStock: jest.fn(() => mockStock),
  useBookingOffer: jest.fn(() => mockOffer),
}))

let mockSettings = {
  autoActivateDigitalBookings: false,
}
jest.mock('features/auth/settings', () => ({
  useAppSettings: jest.fn(
    () =>
      ({
        data: mockSettings,
      } as unknown as QueryObserverResult<SettingsResponse, unknown>)
  ),
}))

describe('<CancellationDetails /> when autoActivateDigitalBookings = false', () => {
  it('should be cancellable if no limitDate specified', () => {
    mockStock = { ...notExpiredStock, cancellationLimitDatetime: null }
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    const page = render(reactQueryProviderHOC(<CancellationDetails />))

    expectCancellable(page)
  })

  it('should not be cancellable if limitDate in the past', () => {
    mockStock = { ...notExpiredStock, cancellationLimitDatetime: pastDate }
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    const page = render(reactQueryProviderHOC(<CancellationDetails />))
    expectNotCancellable(page)
  })

  it('should be cancellable if limitDate in the future', () => {
    mockStock = { ...notExpiredStock, cancellationLimitDatetime: futureDate }
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    const page = render(reactQueryProviderHOC(<CancellationDetails />))
    expect(
      page.queryByText('Cette réservation peut être annulée jusqu’au 6 janvier 2021, 00h00')
    ).toBeTruthy()
    expect(page.queryByText(/Cette réservation est annulable/)).toBeFalsy()
    expect(page.queryByText(/Cette réservation n’est pas annulable/)).toBeFalsy()
  })
})

describe('<CancellationDetails /> when autoActivateDigitalBookings = true and isDigital = true', () => {
  describe('activationCode with expiration date', () => {
    it.each([null, pastDate, futureDate])(
      'should not be cancellable when cancellation limit date=%s',
      (cancellationLimitDatetime) => {
        mockStock = {
          ...notExpiredStock,
          cancellationLimitDatetime,
          activationCode: { expirationDate: '2030-02-05T00:00:00Z' },
        }
        mockOffer = { ...mockOffer, isDigital: true } as unknown as OfferResponse
        mockSettings = { autoActivateDigitalBookings: true }
        // eslint-disable-next-line local-rules/no-react-query-provider-hoc
        const page = render(reactQueryProviderHOC(<CancellationDetails />))

        expectNotCancellable(page)
      }
    )
  })

  describe('activationCode with no expiration date', () => {
    it.each([null, pastDate, futureDate])(
      'should not be cancellable when cancellation limit date=%s',
      (cancellationLimitDatetime) => {
        mockStock = {
          ...notExpiredStock,
          cancellationLimitDatetime,
          activationCode: { expirationDate: null },
        }
        mockOffer = { ...mockOffer, isDigital: true } as unknown as OfferResponse
        mockSettings = { autoActivateDigitalBookings: true }
        // eslint-disable-next-line local-rules/no-react-query-provider-hoc
        const page = render(reactQueryProviderHOC(<CancellationDetails />))

        expectNotCancellable(page)
      }
    )
  })

  describe('no activationCode', () => {
    it('should be cancellable if no cancellation limit date', () => {
      mockStock = { ...notExpiredStock, cancellationLimitDatetime: null, activationCode: null }
      mockOffer = { ...mockOffer, isDigital: true } as unknown as OfferResponse
      mockSettings = { autoActivateDigitalBookings: true }
      // eslint-disable-next-line local-rules/no-react-query-provider-hoc
      const page = render(reactQueryProviderHOC(<CancellationDetails />))

      expectCancellable(page)
    })

    it('should not be cancellable if limitDate is past', () => {
      mockStock = { ...notExpiredStock, cancellationLimitDatetime: pastDate, activationCode: null }
      mockOffer = { ...mockOffer, isDigital: true } as unknown as OfferResponse
      mockSettings = { autoActivateDigitalBookings: true }
      // eslint-disable-next-line local-rules/no-react-query-provider-hoc
      const page = render(reactQueryProviderHOC(<CancellationDetails />))

      expectNotCancellable(page)
    })

    it('should be cancellable before limitDate if future', () => {
      mockStock = {
        ...notExpiredStock,
        cancellationLimitDatetime: futureDate,
        activationCode: null,
      }
      mockOffer = { ...mockOffer, isDigital: true } as unknown as OfferResponse
      mockSettings = { autoActivateDigitalBookings: true }
      // eslint-disable-next-line local-rules/no-react-query-provider-hoc
      const page = render(reactQueryProviderHOC(<CancellationDetails />))

      expectCancellableBefore(page)
    })
  })
})

const expectNotCancellable = (page: RenderAPI) => {
  expect(page.queryByText('Cette réservation n’est pas annulable')).toBeTruthy()
  expect(page.queryByText(/Cette réservation est annulable/)).toBeFalsy()
  expect(page.queryByText(/Cette réservation peut être annulée jusqu’au/)).toBeFalsy()
}

const expectCancellable = (page: RenderAPI) => {
  expect(page.queryByText('Cette réservation n’est pas annulable')).toBeFalsy()
  expect(page.queryByText(/Cette réservation est annulable/)).toBeTruthy()
  expect(page.queryByText(/Cette réservation peut être annulée jusqu’au/)).toBeFalsy()
}

const expectCancellableBefore = (page: RenderAPI) => {
  expect(page.queryByText('Cette réservation n’est pas annulable')).toBeFalsy()
  expect(page.queryByText(/Cette réservation est annulable/)).toBeFalsy()
  expect(page.queryByText(/Cette réservation peut être annulée jusqu’au/)).toBeTruthy()
}
